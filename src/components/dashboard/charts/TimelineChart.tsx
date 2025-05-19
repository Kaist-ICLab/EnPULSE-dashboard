'use client'

import useSectionState from "@/hooks/charts/useSectionState";
import { SectionType, TimelineCategoricalValue, TimelineNumericalValue } from "@/types/chart";
import { PlotlyRelayoutEvent } from "@/types/plotlyEvent";
import { createPlot, loadPlotly } from "@/utils/plotlyLoader";
import { Config, Data, Layout } from "plotly.js-dist-min";
import { useEffect, useMemo, useRef } from "react";

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};

const TimelineChart: React.FC<{
    id: string;
    sectionType: SectionType;
    chartType: 'categorical' | 'numerical';
    baseTime: number;
    data: { timestamp: number[], value: (TimelineNumericalValue | TimelineCategoricalValue)[] };
    bucketSize: number;
}> = ({ id, sectionType, chartType, baseTime, data, bucketSize }) => {
    const { timeRange, updateTimeRange, initTimeRange } = useSectionState()
    const currentTimeRange = useMemo(() => timeRange[sectionType], [timeRange, sectionType])

    const chartRef = useRef<HTMLDivElement>(null);
    // Store original colors for each trace
    const colorQueue = useRef<{ traceIndex: number, colorIndex: number }[] | null>(null)

    useEffect(() => {
        initTimeRange(sectionType)
    }, [sectionType, initTimeRange])

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
                range: [baseTime + currentTimeRange.start, baseTime + currentTimeRange.end],
                visible: false
            },
            bargap: 0.1,
            barmode: 'stack',
            dragmode: 'zoom',
            hovermode: 'x',
            hoverdistance: 10000,
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
            const values = data.value as TimelineNumericalValue[]
            const singleDataMask = values.map(v => v.avg_value === v.min_value && v.avg_value === v.max_value)

            plotData = [
                {
                    x: data.timestamp,
                    y: values.map(v => v.avg_value),
                    type: 'bar',
                    marker: {
                        color: '#3b82f6'
                    },
                    hovertemplate: values.map((v, i) =>
                        singleDataMask[i]
                            ? `Time: ${formatTime(data.timestamp[i])} ~ ${formatTime(data.timestamp[i] + bucketSize)}<br>Value: ${v.avg_value.toFixed(2)}<extra></extra>`
                            : `Time: ${formatTime(data.timestamp[i])} ~ ${formatTime(data.timestamp[i] + bucketSize)}<br>Average: ${v.avg_value.toFixed(2)}<br>Min: ${v.min_value.toFixed(2)}<br>Max: ${v.max_value.toFixed(2)}<extra></extra>`
                    )
                },
                {
                    x: data.timestamp.filter((_, i) => !singleDataMask[i]),
                    y: values.filter((_, i) => !singleDataMask[i]).map(v => v.min_value),
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        color: '#f59e0b',
                        symbol: 'square',
                        size: 5,
                    },
                    hoverinfo: 'skip'
                },
                {
                    x: data.timestamp.filter((_, i) => !singleDataMask[i]),
                    y: values.filter((_, i) => !singleDataMask[i]).map(v => v.max_value),
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        color: '#10b981',
                        symbol: 'square',
                        size: 5,
                    },
                    hoverinfo: 'skip'
                }
            ];
        } else {
            // Create a map of unique categories to colors
            const values = data.value as TimelineCategoricalValue[]
            const uniqueCategories = [...new Set(values.map(v => v.value))].sort();

            if (uniqueCategories.length == 0) {
                colorQueue.current = null
            } else if (colorQueue.current == null) {
                colorQueue.current = uniqueCategories.filter((_, i) => i < colors.length).map((_, i) => ({ traceIndex: i, colorIndex: i }))
            }

            // Sort categories based on colorQueue
            uniqueCategories.forEach(category => {
                const x = data.timestamp.filter((_, i) => values[i].value === category)
                const colorIndexEntry = colorQueue.current?.filter(item => item.traceIndex === uniqueCategories.indexOf(category))[0]
                const colorIndex = colorIndexEntry?.colorIndex ?? -1
                plotData.push({
                    x,
                    y: values.filter((_, i) => values[i].value === category).map(v => v.count),
                    type: 'bar',
                    name: category,
                    marker: {
                        color: colorIndex !== -1 ? colors[colorIndex] : gray
                    },
                    legendgroup: category,
                    showlegend: true,
                })
            })

            const uniqueTimestamps = [...new Set(data.timestamp)]
            plotData.push({
                x: uniqueTimestamps,
                y: uniqueTimestamps.map(() => 0),
                type: 'bar',
                name: 'Total',
                marker: {
                    color: 'rgba(0, 0, 0, 0)',
                    opacity: 0
                },
                showlegend: false,
                hovertemplate: uniqueTimestamps.map(v => `Time: ${formatTime(v)} ~ ${formatTime(v + bucketSize)}<extra></extra>`)
            })
        }

        createPlot(chartRef.current, plotData, layout, config)
            .then((plot) => {
                const handleRelayout = (event: PlotlyRelayoutEvent) => {
                    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
                        const start = new Date(event["xaxis.range[0]"]).getTime();
                        const end = new Date(event["xaxis.range[1]"]).getTime();
                        updateTimeRange(sectionType, { start: start - baseTime, end: end - baseTime });

                    } else if (event['xaxis.autorange'] && event['yaxis.autorange']) {
                        initTimeRange(sectionType)
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
    }, [data, currentTimeRange, baseTime, id, chartType, sectionType, bucketSize, updateTimeRange, initTimeRange]);

    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '100px' }} />
        </div>
    );
};

export default TimelineChart;