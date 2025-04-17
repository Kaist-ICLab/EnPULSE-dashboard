'use client'

import Plotly, { Config, Data, Layout, PlotlyHTMLElement } from "plotly.js-dist-min";
import { useEffect, useRef } from "react";

const TimelineXAxis: React.FC<{
    id: string;
    timeRange: { start: number, end: number };
    onComplete: (timeRange: { start: number, end: number }) => void;
}> = ({ id, timeRange, onComplete }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const data: Data[] = [{
            x: [timeRange.start, timeRange.end],
            y: [0, 0],
            type: 'scatter',
            mode: 'lines',
            line: { width: 0 },
            hoverinfo: 'none',
        }];

        const layout: Partial<Layout> = {
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

        const config: Partial<Config> = {
            displayModeBar: false,
            responsive: true,
        };

        Plotly.newPlot(chartRef.current, data, layout, config).then((plot: PlotlyHTMLElement) => {
            // Handle panning events
            plot.on('plotly_relayout', (eventData: any) => {
                if (eventData['xaxis.range[0]'] !== undefined && eventData['xaxis.range[1]'] !== undefined) {
                    const start = eventData['xaxis.range[0]'];
                    const end = eventData['xaxis.range[1]'];
                    onComplete({start, end});
                }
            });
        });

        return () => {
            if (chartRef.current) {
                Plotly.purge(chartRef.current);
            }
        };
    }, [id, timeRange]);

    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '20px' }} />
        </div>
    );
};

export default TimelineXAxis;