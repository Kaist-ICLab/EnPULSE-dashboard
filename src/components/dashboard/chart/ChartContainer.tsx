import { useEffect, useMemo, useRef, useState } from 'react';
import TimelineXAxis from '@/components/dashboard/chart/TimelineXAxis';
import { DnDProvider } from '@/components/common/DnDList';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import useSectionState from '@/hooks/useSectionState';
import { TimelineData } from '@/types/chart';
import { ComparisonType } from "@/types/dashboard";
import { ChartItem } from './ChartItem';

const ChartContainer: React.FC<{
    timelines: TimelineData[];
    bucketSize: number;
}> = ({ timelines, bucketSize }) => {
    const widthReduction = 80;
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const [chartWidth, setChartWidth] = useState(0);
    const { updateComparisonParams, chartPinQuery, updatePinQuery, selectedSection, updateSelectedSection, updateDate } = useSectionState()
    const [selectedChart, setSelectedChart] = useState<string | null>(null);
    const [chartOrder, setChartOrder] = useState<string[]>(timelines.map((d) => d.id));

    // TODO: Currently it is bugged, should prevent update when it is dragged
    useEffect(() => {
        setChartOrder(timelines.map((d) => d.id))
    }, [timelines])

    useEffect(() => {
        if (chartContainerRef.current) {
            setChartWidth(chartContainerRef.current.offsetWidth - widthReduction);

            const updateSize = () => {
                if (chartContainerRef.current) {
                    setChartWidth(chartContainerRef.current.offsetWidth - widthReduction);
                }
            }
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, [chartContainerRef])

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
        <div className="w-full" ref={chartContainerRef}>
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
                    <div className="flex items-center gap-2">
                        {selectedChart && (
                            <>
                                <span className="font-medium text-gray-700">Compare with other:</span>
                                {Object.entries(comparisonName).map(([type, value]) => (
                                    selectedSection !== type && <Link key={type} href={`./dashboard/#${type}-comparison-chart`}>
                                        <Button
                                            size="md"
                                            className="flex flex-row gap-1 text-base px-3"
                                            onClick={() => {
                                                const params = timelines.find(t => t.id === selectedChart)!.params
                                                updateComparisonParams(type as ComparisonType, { uuid: [params.uuid], fieldId: [params.fieldId] })
                                                updateDate(params.date)
                                                updatePinQuery(params)
                                                updateSelectedSection(type as ComparisonType)
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
            {timelines.filter(d => d.id === pinnedChart).map((timeline) =>
                <ChartItem
                    key={timeline.id}
                    timeline={timeline}
                    pinned={true}
                    isSelected={selectedChart === timeline.id}
                    setSelectedChart={(p) => setSelectedChart(p)}
                    bucketSize={bucketSize}
                    width={Math.max(chartWidth - 160, 0)}
                />
            )}
            <DnDProvider
                items={chartOrder.filter(id => id !== pinnedChart)}
                onItemsChange={setChartOrder}
            >
                {chartOrder.filter(id => id !== pinnedChart).map((id) => (
                    <ChartItem
                        key={id}
                        timeline={timelines.find(d => d.id === id)!}
                        pinned={pinnedChart === id}
                        isSelected={selectedChart === id}
                        setSelectedChart={(p) => setSelectedChart(p)}
                        bucketSize={bucketSize}
                        width={chartWidth}
                    />
                ))}
            </DnDProvider>
            <div className='flex flex-row justify-end items-end'>
                <TimelineXAxis
                    width={chartWidth}
                />
            </div>
        </div>
    )
}

export default ChartContainer;