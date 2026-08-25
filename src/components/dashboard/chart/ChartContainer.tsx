import { DnDProvider } from "@/components/common/DnDList";
import TimelineXAxis from "@/components/dashboard/chart/TimelineXAxis";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { TimelineData } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { ParentSize } from "@visx/responsive";
import { useEffect, useMemo, useState } from "react";
import { ChartItem } from "./ChartItem";

const ChartContainer: React.FC<{
  timelines: TimelineData[];
  bucketSize: number;
  selectedChart: string | null;
  setSelectedChart: (chartId: string | null) => void;
}> = ({ timelines, bucketSize, selectedChart, setSelectedChart }) => {
  const { chartPinQuery, selectedSection } = useSectionParamStore((state) => state);
  const [chartOrder, setChartOrder] = useState<string[]>(timelines.map((d) => d.id));

  useEffect(() => {
    const incomingIds = timelines.map((d) => d.id);
    setChartOrder((prev) => {
      const incomingSet = new Set(incomingIds);
      const prevSet = new Set(prev);
      const preserved = prev.filter((id) => incomingSet.has(id));
      const added = incomingIds.filter((id) => !prevSet.has(id));
      const merged = [...preserved, ...added];
      if (merged.length === prev.length && merged.every((id, i) => id === prev[i])) {
        return prev;
      }
      return merged;
    });
  }, [timelines]);

  const pinnedChart = useMemo(() => {
    switch (selectedSection) {
      case ComparisonType.Days:
        return timelines.find((t) => t.params.date.getTime() === chartPinQuery.date?.getTime())?.id || null;
      case ComparisonType.Participants:
        return timelines.find((t) => t.params.uuid === chartPinQuery.uuid)?.id || null;
      case ComparisonType.Sensors:
        if (chartPinQuery.questionId !== null) {
          return timelines.find((t) => t.params.questionId === chartPinQuery.questionId)?.id || null;
        }
        return timelines.find((t) => t.params.fieldId === chartPinQuery.fieldId)?.id || null;
      default:
        return null;
    }
  }, [selectedSection, timelines, chartPinQuery]);

  return (
    <div className="w-full">
      {timelines
        .filter((d) => d.id === pinnedChart)
        .map((timeline) => (
          <ChartItem
            key={timeline.id}
            timeline={timeline}
            pinned={true}
            isSelected={selectedChart === timeline.id}
            setSelectedChart={(p) => setSelectedChart(p)}
            bucketSize={bucketSize}
            sectionType={selectedSection}
          />
        ))}
      <DnDProvider items={chartOrder.filter((id) => id !== pinnedChart)} onItemsChange={setChartOrder}>
        {chartOrder
          .filter((id) => id !== pinnedChart)
          .map((id) => (
            <ChartItem
              key={id}
              timeline={timelines.find((d) => d.id === id)!}
              pinned={pinnedChart === id}
              isSelected={selectedChart === id}
              setSelectedChart={(p) => setSelectedChart(p)}
              bucketSize={bucketSize}
              sectionType={selectedSection}
            />
          ))}
      </DnDProvider>
      <div className="flex w-full flex-row px-2">
        <div className="w-7 shrink-0" />
        <div className="min-w-0 grow">
          <ParentSize>{({ width }) => <TimelineXAxis width={width} />}</ParentSize>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
