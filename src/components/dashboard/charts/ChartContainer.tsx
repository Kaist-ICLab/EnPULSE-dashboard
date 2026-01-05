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
    sectionType: SectionType;
    bucketSize: number;
}> = ({ timelines, sectionType, bucketSize }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);
    const { updateSectionParams, chartPinQuery, updatePinQuery } = useSectionState()
    const [selectedChart, setSelectedChart] = useState<string | null>(null);
    const [chartOrder, setChartOrder] = useState<string[]>(timelines.map((d) => d.id));

    useEffect(() => {
        setChartOrder(timelines.map((d) => d.id))
    }, [timelines])

    useEffect(() => {
        if (chartContainerRef.current) {
            setWidth(chartContainerRef.current.offsetWidth);

            const updateSize = () => {
                if (chartContainerRef.current) {
                    setWidth(chartContainerRef.current.offsetWidth);
                }
            }
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, [chartContainerRef])

    const pinnedChart = useMemo(() => {
        if (chartPinQuery[sectionType] == null) return null

        switch (sectionType) {
            case SectionType.IntraPerson:
                return timelines.find(t => t.params.date.getTime() === chartPinQuery[SectionType.IntraPerson]?.date?.getTime())?.id || null
            case SectionType.InterPerson:
                return timelines.find(t => t.params.uuid === chartPinQuery[SectionType.InterPerson]?.uuid)?.id || null
            case SectionType.TimelineOverview:
                return timelines.find(t => t.params.fieldId === chartPinQuery[SectionType.TimelineOverview]?.fieldId)?.id || null
        }
    }, [sectionType, timelines, chartPinQuery])

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
                                    sectionType !== type && <Link key={type} href={`./dashboard/#${type}-comparison-chart`}>
                                        <Button
                                            size="md"
                                            className="flex flex-row gap-1 text-base px-3"
                                            onClick={() => {
                                                const params = timelines.find(t => t.id === selectedChart)!.params
                                                updateSectionParams(type as SectionType, params)
                                                updatePinQuery(type as SectionType, params)
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
                    sectionType={sectionType}
                    pinned={true}
                    isSelected={selectedChart === timeline.id}
                    setSelectedChart={(p) => setSelectedChart(p)}
                    bucketSize={bucketSize}
                    width={width - 80}
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
                        sectionType={sectionType}
                        pinned={pinnedChart === id}
                        isSelected={selectedChart === id}
                        setSelectedChart={(p) => setSelectedChart(p)}
                        bucketSize={bucketSize}
                        width={width - 80}
                    />
                ))}
            </DnDProvider>
            <div className='flex flex-row justify-center items-center'>
                <div className='w-12'></div>
                <TimelineXAxis
                    sectionType={sectionType}
                />
            </div>
        </div>
    )
}

export default ChartContainer;