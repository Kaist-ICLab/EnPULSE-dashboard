import { useEffect, useMemo, useState } from 'react';
import TimelineChart from '@/components/dashboard/charts/TimelineChart';
import TimelineXAxis from '@/components/dashboard/charts/TimelineXAxis';
import { DnDProvider, DnDItem, DragHandle } from '@/components/common/DnDList';
import { Button } from 'flowbite-react';
import { TimelineData, SectionType, ChartParams } from '@/types/chart';
import Link from 'next/link';
import useSectionState from '@/hooks/charts/useSectionState';

const ChartContainer: React.FC<{
    timelines: TimelineData[];
    sectionType: SectionType;
    bucketSize: number;
}> = ({ timelines, sectionType, bucketSize }) => {
    const { updateSectionParams, chartPinQuery, updatePinQuery } = useSectionState()
    const [selectedChart, setSelectedChart] = useState<string | null>(null);
    const [chartOrder, setChartOrder] = useState<string[]>(timelines.map((d) => d.id));

    useEffect(() => {
        setChartOrder(timelines.map((d) => d.id))
    }, [timelines])

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

    const setPinnedChart = (chartType: SectionType, params: ChartParams | null) => {
        if (chartType == SectionType.IntraPerson) {
            updatePinQuery(chartType, params ? { date: params.date } : null)
        } else if (chartType == SectionType.InterPerson) {
            updatePinQuery(chartType, params ? { uuid: params.uuid } : null)
        } else if (chartType == SectionType.TimelineOverview) {
            updatePinQuery(chartType, params ? { fieldId: params.fieldId } : null)
        }
    }

    const comparisonName = {
        [SectionType.InterPerson]: "Participants",
        [SectionType.TimelineOverview]: "Sensors",
        [SectionType.IntraPerson]: "Days"
    }

    return (
        <div>
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
                                                setPinnedChart(type as SectionType, params)
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
                <ChartItem key={timeline.id}
                    timeline={timeline}
                    sectionType={sectionType}
                    pinned={true}
                    onPin={() => setPinnedChart(sectionType, null)}
                    isSelected={selectedChart === timeline.id}
                    setSelectedChart={(p) => setSelectedChart(p)}
                    bucketSize={bucketSize}
                />
            )}
            <DnDProvider
                items={chartOrder.filter(id => id !== pinnedChart)}
                onItemsChange={setChartOrder}
            >
                {chartOrder.filter(id => id !== pinnedChart).map((id) => (
                    <ChartItem key={id}
                        timeline={timelines.find(d => d.id === id)!}
                        sectionType={sectionType}
                        pinned={pinnedChart === id}
                        onPin={(pinned) => setPinnedChart(sectionType, pinned ? timelines.find(d => d.id === id)!.params : null)}
                        isSelected={selectedChart === id}
                        setSelectedChart={(p) => setSelectedChart(p)}
                        bucketSize={bucketSize}
                    />
                ))}
            </DnDProvider>
            <div className='flex flex-row justify-center items-center'>
                <div className='w-12'></div>
                <TimelineXAxis
                    id="xaxis"
                    sectionType={sectionType}
                />
            </div>
        </div>
    )
}

const ChartItem: React.FC<{
    timeline: TimelineData;
    sectionType: SectionType;
    pinned: boolean;
    onPin: (pinned: boolean) => void;
    isSelected: boolean;
    setSelectedChart: (id: string | null) => void;
    bucketSize: number;
}> = ({ timeline, sectionType, pinned, onPin, isSelected, setSelectedChart, bucketSize }) => {
    if (!timeline) return

    return (
        <DnDItem id={timeline.id} className={`w-full flex flex-row justify-center items-center p-2 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`} >
            <div className='w-18 flex flex-row justify-center items-center' onClick={() => {
                setSelectedChart(isSelected ? null : timeline.id);
            }} >
                <DragHandle>
                    <span className='w-6 h-6 ml-4 mr-2 text-gray-300 icon-[mdi--hamburger-menu]' />
                </DragHandle>
                <div className='flex flex-col w-12 mr-8'>
                    <div className='text-sm overflow-ellipsis'>{timeline.title}</div>
                    <button className='text-gray-400 w-6 cursor-pointer' onClick={() => {
                        onPin(!pinned);
                    }}>
                        {pinned ? <span className="w-6 h-6 icon-[mdi--pin-off]" /> : <span className="w-6 h-6 icon-[mdi--pin]" />}
                    </button>
                </div>
            </div>
            <div
                className={`grow flex flex-row justify-center items-center cursor-pointer transition-colors`}
            >
                <TimelineChart
                    id={timeline.id}
                    sectionType={sectionType}
                    chartType={timeline.chartType}
                    baseTime={timeline.params.date.getTime()}
                    data={{ timestamp: timeline.timestamp, value: timeline.value }}
                    bucketSize={bucketSize}
                />
            </div>
        </DnDItem>
    )
}

export default ChartContainer;