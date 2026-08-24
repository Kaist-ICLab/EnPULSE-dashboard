import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { TimelineHeatmapPoint } from "@/types/chart";
import { colors, formatTime } from "@/utils/timelineUtils";
import { useCallback, useMemo } from "react";

export function useHeatmapPlotState(data: TimelineHeatmapPoint[], bucketSize: number, fieldId: number) {
  const { campaignTableFieldMapping } = useCampaignStore((state) => state);
  const mapping = useMemo(() => {
    return campaignTableFieldMapping.get(fieldId);
  }, [campaignTableFieldMapping, fieldId]);

  const { maxBitIndex, maxCount } = useMemo(() => {
    let maxBit = -1;
    let maxCnt = 0;
    data.forEach((point) => {
      point.value.forEach((item) => {
        const bit = item.bitIndex;
        maxBit = Math.max(maxBit, bit);
        maxCnt = Math.max(maxCnt, item.count);
      });
    });
    return {
      maxBitIndex: Math.max(0, maxBit),
      maxCount: Math.max(1, maxCnt),
    };
  }, [data]);

  const getTooltipData = useCallback(
    (timeMs: number) => {
      const pointsAtTime = data.filter((d) => d.timestamp <= timeMs && timeMs <= d.timestamp + bucketSize);
      if (pointsAtTime.length === 0) return null;

      const bitCountMap = new Map<number, number>();
      pointsAtTime.forEach((d) => {
        d.value.forEach((item) => {
          const bit = item.bitIndex;
          const current = bitCountMap.get(bit) ?? 0;
          bitCountMap.set(bit, current + item.count);
        });
      });

      const tooltipItems = Array.from(bitCountMap.entries())
        .filter(([, count]) => count > 0)
        .sort(([a], [b]) => a - b)
        .map(([bit, count]) => ({
          label: mapping?.get(bit.toString()) ?? bit.toString(),
          value: count.toString(),
        }));

      return [
        {
          label: "Time",
          value: `${formatTime(pointsAtTime[0].timestamp)} ~ ${formatTime(pointsAtTime[0].timestamp + bucketSize)}`,
        },
        ...tooltipItems,
      ];
    },
    [data, bucketSize, mapping],
  );

  const getColor = useCallback(
    (point: TimelineHeatmapPoint) => {
      return point.value.map((item) => {
        const count = item.count;
        const opacity = count / maxCount;
        return {
          color: colors[0],
          opacity: opacity,
        };
      });
    },
    [maxCount],
  );

  return { maxValue: maxBitIndex + 1, getTooltipData, getColor };
}
