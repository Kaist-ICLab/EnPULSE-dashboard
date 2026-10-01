import { DnDProvider } from "@/components/common/DnDList";
import TimelineXAxis from "@/components/dashboard/chart/TimelineXAxis";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { TimelineData } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { ParentSize } from "@visx/responsive";
import { useMemo, useState } from "react";
import { ChartItem } from "./ChartItem";

const ChartContainer: React.FC<{
  timelines: TimelineData[];
  bucketSize: number;
  selectedChart: string | null;
  setSelectedChart: (chartId: string | null) => void;
}> = ({ timelines, bucketSize, selectedChart, setSelectedChart }) => {
  const { chartPinQuery, selectedSection } = useSectionParamStore((state) => state);
  // User-chosen drag order. It can hold ids that are no longer in `timelines`,
  // so it is reconciled with the incoming timelines during render below.
  const [chartOrder, setChartOrder] = useState<string[]>(timelines.map((d) => d.id));

  // Reconcile during render (not in an effect) so a chart that was just removed
  // is never rendered with an undefined timeline: keep the user's order for ids
  // that still exist, then append new ids.
  const orderedTimelines = useMemo(() => {
    const byId = new Map(timelines.map((d) => [d.id, d]));
    const orderSet = new Set(chartOrder);
    const preserved = chartOrder.flatMap((id) => byId.get(id) ?? []);
    const added = timelines.filter((d) => !orderSet.has(d.id));
    return [...preserved, ...added];
  }, [chartOrder, timelines]);

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
      <DnDProvider
        items={orderedTimelines.filter((d) => d.id !== pinnedChart).map((d) => d.id)}
        onItemsChange={setChartOrder}
      >
        {orderedTimelines
          .filter((d) => d.id !== pinnedChart)
          .map((timeline) => (
            <ChartItem
              key={timeline.id}
              timeline={timeline}
              pinned={false}
              isSelected={selectedChart === timeline.id}
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
