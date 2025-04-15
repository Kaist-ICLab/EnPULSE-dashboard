'use client'

import Plotly, { Config, Data, Layout, PlotlyHTMLElement } from "plotly.js-dist-min";
import { useEffect, useRef } from "react";

const TimelineChart: React.FC<{
    id: string;
    chartType: 'categorical' | 'numerical';
    timeRange: { start: number, end: number };
    data: { timestamp: number[], value: (string | number)[] };
    onComplete: (timeRange: { start: number, end: number }) => void;
}> = ({ id, data, chartType, timeRange, onComplete }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !chartRef.current) return;
        const layout: Partial<Layout> = {
            margin: { t: 0, b: 0, l: 0, r: 0 },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            xaxis: {
                type: 'date',
                range: [timeRange.start, timeRange.end],
                visible: false
            },
            bargap: 0.01,
            dragmode: 'zoom',
        };

        const config: Partial<Config> = {
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
            scrollZoom: false,
        };
        let plotData: Data[] = [];
        if (chartType === 'numerical') {
            plotData = [{
                x: data.timestamp,
                y: data.value,
                type: 'bar',
                marker: {
                    color: '#3b82f6'
                }
            }];
        } else {
            const colors = [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
            ];

            // Create a map of unique categories to colors
            const uniqueCategories = [...new Set(data.value as string[])].sort();
            const categoryColors: { [key: string]: string } = {};
            uniqueCategories.forEach((category, index) => {
                categoryColors[category] = colors[index % colors.length];
            });

            plotData = [{
                x: data.timestamp,
                y: Array(data.value.length).fill(1),
                type: 'bar',
                marker: {
                    color: (data.value as string[]).map(category => categoryColors[category])
                }
            }];
        }


        Plotly.newPlot(chartRef.current, plotData, layout, config)
            .then((plot: PlotlyHTMLElement) => {
                const handleRelayout = (event: any) => {
                    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
                        const start = new Date(event["xaxis.range[0]"]).getTime();
                        const end = new Date(event["xaxis.range[1]"]).getTime();
                        onComplete({start, end});
                    }
                };

                plot.on("plotly_relayout", handleRelayout);
            })
            .catch((error: any) => {
                console.error('Error creating plot:', error);
            });

        return () => {
            if (chartRef.current) {
                Plotly.purge(chartRef.current);
            }
        };
    }, [data, timeRange, id]);


    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '100px' }} />
        </div>
    );
};

export default TimelineChart;