import { useEffect, useMemo, useRef, useState } from 'react';
import TimelineXAxis from '@/components/dashboard/charts/TimelineXAxis';
import { DnDProvider } from '@/components/common/DnDList';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import useSectionState from '@/hooks/useSectionState';
import { SectionType, TimelineData } from '@/types/chart';
import { ChartItem } from './ChartItem';

const ChartContainer: React.FC<{
    timelines: TimelineData[];
    bucketSize: number;
}> = ({ timelines, bucketSize }) => {
    const widthReduction = 80;
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const [chartWidth, setChartWidth] = useState(0);
    const { updateTimelineParams, chartPinQuery, updatePinQuery, selectedSection, updateSelectedSection } = useSectionState()
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
            case SectionType.IntraPerson:
                return timelines.find(t => t.params.date.getTime() === chartPinQuery.date?.getTime())?.id || null
            case SectionType.InterPerson:
                return timelines.find(t => t.params.uuid === chartPinQuery.uuid)?.id || null
            case SectionType.TimelineOverview:
                return timelines.find(t => t.params.fieldId === chartPinQuery.fieldId)?.id || null
            default:
                return null
        }
    }, [selectedSection, timelines, chartPinQuery])

    const comparisonName = {
        [SectionType.InterPerson]: "Participants",
        [SectionType.TimelineOverview]: "Sensors",
        [SectionType.IntraPerson]: "Days"
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
                                                updateTimelineParams(params)
                                                updatePinQuery(params)
                                                updateSelectedSection(type as SectionType)
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