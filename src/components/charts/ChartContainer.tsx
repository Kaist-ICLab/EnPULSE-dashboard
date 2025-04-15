import { useState } from 'react';
import TimelineChart from '@/components/charts/TimelineChart';
import TimelineXAxis from '@/components/charts/TimelineXAxis';
import { DnDProvider, DnDItem, DragHandle } from '@/components/DnDList';

interface TimelineData {
    id: string;
    table: string;
    column: string;
    chartType: 'numerical' | 'categorical';
    timestamp: number[];
    value: (string | number)[];
}

const ChartContainer: React.FC<{
    data: TimelineData[];
    defaultTimeRange: { start: number, end: number };
}> = ({ data, defaultTimeRange }) => {
    const [timeRange, setTimeRange] = useState<{ start: number, end: number }>(defaultTimeRange);
    const [pinnedChart, setPinnedChart] = useState<string | null>(null);
    const [chartOrder, setChartOrder] = useState<string[]>(data.map((d) => d.id));

    return (
        <div>
            <div>
                HEADER
            </div>
            {data.filter(d => d.id === pinnedChart).map((d) => <div key={d.id} className='w-full flex flex-row justify-center items-center'>
                <div className='w-6'>☰</div>
                <button className='text-gray-500 border w-6' onClick={() => setPinnedChart(null)}>unpin</button>
                <TimelineChart key={d.id}
                    id={d.id}
                    chartType={d.chartType}
                    timeRange={timeRange}
                    onComplete={setTimeRange}
                    data={{ timestamp: d.timestamp, value: d.value }}
                />
            </div>
            )}
            <DnDProvider
                items={chartOrder.filter(id => id !== pinnedChart)}
                onItemsChange={setChartOrder}
            >
                {chartOrder.filter(id => id !== pinnedChart).map((id) => <DnDItem key={id} id={id} className='w-full flex flex-row justify-center items-center'>
                    <DragHandle className='w-6'>
                        <div> ☰</div>
                    </DragHandle>
                    <div className='grow flex flex-row justify-center items-center'>
                        <button className='text-gray-500 border w-6' onClick={() => setPinnedChart(id)}>pin</button>
                        <TimelineChart key={id}
                            id={id}
                            chartType={data.find(d => d.id === id)!.chartType}
                            timeRange={timeRange}
                            onComplete={setTimeRange}
                            data={{ timestamp: data.find(d => d.id === id)!.timestamp, value: data.find(d => d.id === id)!.value }}
                        />
                    </div>
                </DnDItem>)}
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

export default ChartContainer;