'use client'

import { PlotlyRelayoutEvent } from "@/types/plotlyEvent";
import { createPlot, loadPlotly } from "@/utils/plotlyLoader";
import { Config, Data, Layout } from "plotly.js-dist-min";
import { useEffect, useRef } from "react";

const TimelineChart: React.FC<{
    id: string;
    chartType: 'categorical' | 'numerical';
    timeRange: { start: number, end: number };
    defaultTimeRange: { start: number, end: number };
    baseTime: number;
    data: { timestamp: number[], value: (string | number)[] };
    onComplete: (timeRange: { start: number, end: number }) => void;
}> = ({ id, data, chartType, timeRange, defaultTimeRange, baseTime, onComplete }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    // Store original colors for each trace
    const colorQueue = useRef<{ traceIndex: number, colorIndex: number }[] | null>(null)

    useEffect(() => {
        const colors = [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
        ];
        const gray = '#d1d5db'

        if (typeof window === 'undefined' || !chartRef.current) return;
        const chartElement = chartRef.current;
        const layout: Partial<Layout> = {
            margin: { t: 30, b: 0, l: 0, r: 0 },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            xaxis: {
                type: 'date',
                range: [baseTime + timeRange.start, baseTime + timeRange.end],
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
            // Create a map of unique categories to colors
            const uniqueCategories = [...new Set(data.value as string[])].sort();
            if (colorQueue.current == null) {
                colorQueue.current = uniqueCategories.filter((_, i) => i < colors.length).map((_, i) => ({ traceIndex: i, colorIndex: i }))
            }

            uniqueCategories.forEach((category, i) => {
                const x = data.timestamp.filter((_, i) => data.value[i] === category)
                const colorIndexEntry = colorQueue.current?.filter(item => item.traceIndex === i)[0]
                const colorIndex = colorIndexEntry?.colorIndex ?? -1
                plotData.push({
                    x,
                    y: Array(x.length).fill(1),
                    type: 'bar',
                    name: category,
                    marker: {
                        color: colorIndex !== -1 ? colors[colorIndex] : gray
                    },
                    legendgroup: category,
                    showlegend: true
                })
            })
        }

        createPlot(chartRef.current, plotData, layout, config)
            .then((plot) => {
                // // Store the initial time range
                // if (!initialTimeRangeRef.current) {
                //     const xaxis = plot._fullLayout.xaxis;
                //     initialTimeRangeRef.current = {
                //         start: new Date(xaxis.range[0]).getTime(),
                //         end: new Date(xaxis.range[1]).getTime()
                //     };
                // }

                const handleRelayout = (event: PlotlyRelayoutEvent) => {
                    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
                        const start = new Date(event["xaxis.range[0]"]).getTime();
                        const end = new Date(event["xaxis.range[1]"]).getTime();
                        onComplete({ start: start - baseTime, end: end - baseTime });

                    } else if (event['xaxis.autorange'] && event['yaxis.autorange']) {
                        onComplete(defaultTimeRange);
                    }
                };

                plot.on("plotly_relayout", handleRelayout);

                // Add event handler for legend clicks
                plot.on("plotly_legendclick", (event: { curveNumber: number }) => {
                    if (colorQueue.current == null) return
                    // Get the clicked trace index
                    const traceIndex = event.curveNumber;

                    // Get the current visibility state
                    let colorToUse = gray
                    let popIndex = -1
                    const isVisible = colorQueue.current.some(item => item.traceIndex === traceIndex)

                    if (!isVisible) {
                        if (colorQueue.current.length == colors.length) {
                            const { traceIndex: removedTraceIndex, colorIndex } = colorQueue.current.splice(0, 1)[0]
                            colorQueue.current.push({ traceIndex, colorIndex })
                            colorToUse = colors[colorIndex]
                            popIndex = removedTraceIndex
                        } else {
                            const existingIndex = colorQueue.current.map(item => item.colorIndex)
                            for (let i = 0; i < colors.length; i++) {
                                if (!existingIndex.includes(i)) {
                                    colorQueue.current.push({ traceIndex, colorIndex: i })
                                    colorToUse = colors[i]
                                    break;
                                }
                            }
                        }

                    } else {
                        const spliceIndex = colorQueue.current.findIndex(item => item.traceIndex === traceIndex)
                        colorQueue.current.splice(spliceIndex, 1)
                    }

                    // Update the trace color based on visibility
                    loadPlotly().then(Plotly => {
                        // Use the chart element as the container
                        const chartElement = chartRef.current;
                        if (!chartElement) return;

                        // Update the trace
                        Plotly.restyle(chartElement, {
                            marker: { color: colorToUse }
                        }, [traceIndex]);

                        if (popIndex !== -1) {
                            Plotly.restyle(chartElement, {
                                marker: { color: gray }
                            }, [popIndex]);
                        }
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
    }, [data, timeRange, baseTime, id, chartType, onComplete, defaultTimeRange]);

    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '100px' }} />
        </div>
    );
};

export default TimelineChart;