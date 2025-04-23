import { useState } from 'react';
import TimelineChart from '@/components/dashboard/charts/TimelineChart';
import TimelineXAxis from '@/components/dashboard/charts/TimelineXAxis';
import { DnDProvider, DnDItem, DragHandle } from '@/components/common/DnDList';
import { Button } from 'flowbite-react';
import { TimelineData, ChartType, ChartParams } from '@/types/chart';
import Link from 'next/link';

const ChartContainer: React.FC<{
    timelines: TimelineData[];
    chartType: ChartType;
    params: ChartParams;
    setChartParams: (chartType: ChartType, params: ChartParams) => void;
    defaultTimeRange: { start: number, end: number };
}> = ({ timelines, chartType, setChartParams, defaultTimeRange }) => {
    const [timeRange, setTimeRange] = useState<{ start: number, end: number }>(defaultTimeRange);
    const [pinnedChart, setPinnedChart] = useState<string | null>(null);
    const [chartOrder, setChartOrder] = useState<string[]>(timelines.map((d) => d.id));
    const [selectedChart, setSelectedChart] = useState<string | null>(null);

    const comparisonName = {
        [ChartType.InterPerson]: "Participants",
        [ChartType.TimelineOverview]: "Sensors",
        [ChartType.IntraPerson]: "Days"
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
                                    chartType !== type && <Link key={type} href={`./dashboard/#${type}-comparison-chart`}>
                                        <Button
                                            size="md"
                                            className="flex flex-row gap-1 text-base px-3"
                                            onClick={() => setChartParams(type as ChartType, timelines.find(t => t.id === selectedChart)!.params)}
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
                    pinned={true}
                    onPin={() => setPinnedChart(null)}
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    isSelected={selectedChart === timeline.id}
                    setSelectedChart={setSelectedChart} />
            )}
            <DnDProvider
                items={chartOrder.filter(id => id !== pinnedChart)}
                onItemsChange={setChartOrder}
            >
                {chartOrder.filter(id => id !== pinnedChart).map((id) => (
                    <ChartItem key={id}
                        timeline={timelines.find(d => d.id === id)!}
                        pinned={pinnedChart === id}
                        onPin={(pinned) => setPinnedChart(pinned ? id : null)}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        isSelected={selectedChart === id}
                        setSelectedChart={setSelectedChart} />
                ))}
            </DnDProvider>
            <div className='flex flex-row justify-center items-center'>
                <div className='w-12'></div>
                <TimelineXAxis
                    id="xaxis"
                    timeRange={timeRange}
                    onComplete={setTimeRange}
                />
            </div>
        </div>
    )
}

const ChartItem: React.FC<{
    timeline: TimelineData;
    pinned: boolean;
    onPin: (pinned: boolean) => void;
    timeRange: { start: number, end: number };
    setTimeRange: (timeRange: { start: number, end: number }) => void;
    isSelected: boolean;
    setSelectedChart: (id: string | null) => void;
}> = ({ timeline, pinned, onPin, timeRange, setTimeRange, isSelected, setSelectedChart }) => {
    return (
        <DnDItem id={timeline.id} className={`w-full flex flex-row justify-center items-center p-2 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`} >
            <div className='w-18 flex flex-row justify-center items-center' onClick={() => {
                setSelectedChart(isSelected ? null : timeline.id);
                console.log("Clicked", timeline.id);
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
                    chartType={timeline.chartType}
                    timeRange={timeRange}
                    onComplete={setTimeRange}
                    data={{ timestamp: timeline.timestamp, value: timeline.value }}
                />
            </div>
        </DnDItem>
    )
}

export default ChartContainer;