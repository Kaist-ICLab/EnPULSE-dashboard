'use client'

import { useEffect, useMemo, useRef } from "react";
import { loadPlotly } from "@/utils/plotlyLoader";
import { PlotlyRelayoutEvent } from "@/types/plotlyEvent";
import useSectionState from "@/hooks/charts/useSectionState";
import { SectionType } from "@/types/chart";

const TimelineXAxis: React.FC<{
    id: string;
    sectionType: SectionType;
}> = ({ id, sectionType }) => {
    const { timeRange, updateTimeRange } = useSectionState()

    const currentTimeRange = useMemo(() => {
        return timeRange[sectionType]
    }, [timeRange, sectionType])
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const initPlot = async () => {
            try {
                const Plot = await loadPlotly();

                const data = [{
                    x: [currentTimeRange.start, currentTimeRange.end],
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
                        range: [currentTimeRange.start, currentTimeRange.end],
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
                plot.on('plotly_relayout', (eventData: PlotlyRelayoutEvent) => {
                    if (eventData['xaxis.range[0]'] !== undefined && eventData['xaxis.range[1]'] !== undefined) {
                        const start = new Date(eventData['xaxis.range[0]']).getTime();
                        const end = new Date(eventData['xaxis.range[1]']).getTime();
                        updateTimeRange(sectionType, { start, end });
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
    }, [id, currentTimeRange, sectionType, updateTimeRange]);

    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '20px' }} />
        </div>
    );
};

export default TimelineXAxis;