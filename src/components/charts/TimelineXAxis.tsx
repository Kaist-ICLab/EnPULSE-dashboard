'use client'

import { useEffect, useRef } from "react";
import { loadPlotly } from "@/utils/plotlyLoader";

const TimelineXAxis: React.FC<{
    id: string;
    timeRange: { start: number, end: number };
    onComplete: (timeRange: { start: number, end: number }) => void;
}> = ({ id, timeRange, onComplete }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const initPlot = async () => {
            try {
                const Plot = await loadPlotly();

                const data = [{
                    x: [timeRange.start, timeRange.end],
                    y: [0, 0],
                    type: 'scatter',
                    mode: 'lines',
                    line: { width: 0 },
                    hoverinfo: 'none',
                }];

                const layout = {
                    height: 20,
                    margin: {
                        l: 0, r: 0, t: 0, b: 20
                    },
                    xaxis: {
                        range: [timeRange.start, timeRange.end],
                        type: 'date',
                        showticklabels: true,
                        zeroline: false,
                    },
                    yaxis: {
                        showgrid: false,
                        zeroline: false,
                        showticklabels: false,
                        showline: false,
                    },
                    dragmode: 'pan',
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                };

                const config = {
                    displayModeBar: false,
                    responsive: true,
                };

                const plot = await Plot.newPlot(chartRef.current, data, layout, config);

                // Handle panning events
                plot.on('plotly_relayout', (eventData: any) => {
                    if (eventData['xaxis.range[0]'] !== undefined && eventData['xaxis.range[1]'] !== undefined) {
                        const start = eventData['xaxis.range[0]'];
                        const end = eventData['xaxis.range[1]'];
                        onComplete({ start, end });
                    }
                });
            } catch (error) {
                console.error('Failed to initialize plot:', error);
            }
        };

        initPlot();

        return () => {
            if (chartRef.current) {
                // We need to load Plotly again to purge
                loadPlotly().then(Plot => {
                    Plot.purge(chartRef.current);
                }).catch(console.error);
            }
        };
    }, [id, timeRange, onComplete]);

    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '20px' }} />
        </div>
    );
};

export default TimelineXAxis;