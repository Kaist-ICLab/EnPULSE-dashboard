import { useEffect, useMemo, useState } from 'react';
import TimelineXAxis from '@/components/dashboard/chart/TimelineXAxis';
import { DnDProvider } from '@/components/common/DnDList';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useSectionParamStore } from '@/providers/SectionParamStoreProvider';
import { TimelineData } from '@/types/chart';
import { ComparisonType } from "@/types/dashboard";
import { ChartItem } from './ChartItem';
import { ParentSize } from '@visx/responsive';

const ChartContainer: React.FC<{
    timelines: TimelineData[];
    bucketSize: number;
}> = ({ timelines, bucketSize }) => {
    const { updateComparisonParams, chartPinQuery, updatePinQuery, selectedSection, updateSelectedSection, updateDate } = useSectionParamStore((state) => state);
    const [selectedChart, setSelectedChart] = useState<string | null>(null);
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
    }, [timelines])

    const pinnedChart = useMemo(() => {
        switch (selectedSection) {
            case ComparisonType.Days:
                return timelines.find(t => t.params.date.getTime() === chartPinQuery.date?.getTime())?.id || null
            case ComparisonType.Participants:
                return timelines.find(t => t.params.uuid === chartPinQuery.uuid)?.id || null
            case ComparisonType.Sensors:
                return timelines.find(t => t.params.fieldId === chartPinQuery.fieldId)?.id || null
            default:
                return null
        }
    }, [selectedSection, timelines, chartPinQuery])

    const comparisonName = {
        [ComparisonType.Participants]: "Participants",
        [ComparisonType.Sensors]: "Sensors",
        [ComparisonType.Days]: "Days"
    }

    return (
        <div className="w-full">
            <div className="py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        {selectedChart ? (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">Selected Chart:</span>
                                <span className="text-gray-600">{timelines.find(t => t.id === selectedChart)?.title}</span>
                            </div>
                        ) : (
                            <div className="text-gray-500">No chart selected</div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 h-8">
                        {selectedChart && (
                            <>
                                <span className="font-medium text-gray-700">Compare with other:</span>
                                {Object.entries(comparisonName).map(([type, value]) => (
                                    selectedSection !== type && <Link key={type} href={`./dashboard/#${type}-comparison-chart`}>
                                        <Button
                                            size="xs"
                                            className="flex flex-row gap-1 text-base px-3"
                                            onClick={() => {
                                                const params = timelines.find(t => t.id === selectedChart)!.params
                                                updateComparisonParams(type as ComparisonType, { uuid: [params.uuid], fieldId: [params.fieldId] })
                                                updateDate(params.date)
                                                updatePinQuery(params)
                                                updateSelectedSection(type as ComparisonType)
                                                setSelectedChart(null)
                                            }}
                                        >
                                            <span>{value}</span>
                                        </Button>
                                    </Link>

                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {timelines.filter(d => d.id === pinnedChart).map((timeline, idx) =>
                <ChartItem
                    key={idx}
                    timeline={timeline}
                    pinned={true}
                    isSelected={selectedChart === timeline.id}
                    setSelectedChart={(p) => setSelectedChart(p)}
                    bucketSize={bucketSize}
                    sectionType={selectedSection}
                />
            )}
            <DnDProvider
                items={chartOrder.filter(id => id !== pinnedChart)}
                onItemsChange={setChartOrder}
            >
                {chartOrder.filter(id => id !== pinnedChart).map((id, idx) => (
                    <ChartItem
                        key={idx}
                        timeline={timelines.find(d => d.id === id)!}
                        pinned={pinnedChart === id}
                        isSelected={selectedChart === id}
                        setSelectedChart={(p) => setSelectedChart(p)}
                        bucketSize={bucketSize}
                        sectionType={selectedSection}
                    />
                ))}
            </DnDProvider>
            <div className='w-full flex flex-row px-2'>
                <div className='w-7 shrink-0' />
                <div className='grow min-w-0'>
                    <ParentSize>
                        {({ width }) => <TimelineXAxis width={width} />}
                    </ParentSize>
                </div>
            </div>
        </div>
    )
}

export default ChartContainer;