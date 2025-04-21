'use client'

import { PlotlyRelayoutEvent } from "@/types/plotlyEvent";
import { createPlot, loadPlotly } from "@/utils/plotlyLoader";
import { Config, Data, Layout } from "plotly.js-dist-min";
import { useEffect, useRef } from "react";

const TimelineChart: React.FC<{
    id: string;
    chartType: 'categorical' | 'numerical';
    timeRange: { start: number, end: number };
    data: { timestamp: number[], value: (string | number)[] };
    onComplete: (timeRange: { start: number, end: number }) => void;
}> = ({ id, data, chartType, timeRange, onComplete }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const initialTimeRangeRef = useRef<{ start: number, end: number } | null>(null);
    // Store original colors for each trace
    const originalColorsRef = useRef<{ [key: number]: string }>({});

    useEffect(() => {
        if (typeof window === 'undefined' || !chartRef.current) return;
        const chartElement = chartRef.current;
        const layout: Partial<Layout> = {
            margin: { t: 30, b: 0, l: 0, r: 0 },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            xaxis: {
                type: 'date',
                range: [timeRange.start, timeRange.end],
                visible: false
            },
            bargap: 0.01,
            dragmode: 'zoom',
            showlegend: chartType === 'categorical',
            legend: {
                x: 0.5,
                y: 1.1,
                orientation: 'h',
                xanchor: 'center',
                yanchor: 'bottom',
                bgcolor: 'rgba(255, 255, 255, 0.7)'
            }
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

            for (const category of uniqueCategories) {
                const x = data.timestamp.filter((_, i) => data.value[i] === category)
                plotData.push({
                    x,
                    y: Array(x.length).fill(1),
                    type: 'bar',
                    name: category,
                    marker: {
                        color: categoryColors[category]
                    },
                    legendgroup: category,
                    showlegend: true
                })
            }
        }

        // Plotly.newPlot(chartRef.current, plotData, layout, config)
        createPlot(chartRef.current, plotData, layout, config)
            .then((plot) => {
                // Store the initial time range
                if (!initialTimeRangeRef.current) {
                    const xaxis = plot._fullLayout.xaxis;
                    initialTimeRangeRef.current = {
                        start: new Date(xaxis.range[0]).getTime(),
                        end: new Date(xaxis.range[1]).getTime()
                    };
                }

                const handleRelayout = (event: PlotlyRelayoutEvent) => {
                    console.log(event);
                    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
                        const start = new Date(event["xaxis.range[0]"]).getTime();
                        const end = new Date(event["xaxis.range[1]"]).getTime();
                        onComplete({ start, end });
                    } else if (event['xaxis.autorange'] && event['yaxis.autorange']) {
                        onComplete(initialTimeRangeRef.current ?? timeRange);
                    }
                };

                plot.on("plotly_relayout", handleRelayout);

                // Add event handler for legend clicks
                plot.on("plotly_legendclick", (event: { curveNumber: number }) => {
                    // Get the clicked trace index
                    const traceIndex = event.curveNumber;

                    // Get the current visibility state
                    const isVisible = plot.data[traceIndex].visible !== 'legendonly';

                    // Store the original color if not already stored
                    if (!originalColorsRef.current[traceIndex]) {
                        originalColorsRef.current[traceIndex] = plot.data[traceIndex].marker?.color as string || '#3b82f6';
                    }

                    // Get the color to use (gray when hiding, original when showing)
                    const colorToUse = isVisible ? '#d1d5db' : originalColorsRef.current[traceIndex];

                    // Update the trace color based on visibility
                    loadPlotly().then(Plotly => {
                        // Use the chart element as the container
                        const chartElement = chartRef.current;
                        if (!chartElement) return;

                        // Update the trace
                        Plotly.restyle(chartElement, {
                            visible: isVisible ? 'legendonly' : true,
                            marker: { color: colorToUse }
                        }, [traceIndex]);
                    });

                    return false;
                });
            })
            .catch((error: Error) => {
                console.error('Error creating plot:', error);
            });

        return () => {
            if (chartElement) {
                loadPlotly().then(Plot => {
                    Plot.purge(chartElement);
                }).catch(console.error);
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