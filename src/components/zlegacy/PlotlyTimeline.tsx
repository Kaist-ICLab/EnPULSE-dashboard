'use client'

import { useEffect, useRef, useState } from 'react';
import Plotly, { Data, Layout, Config, PlotlyHTMLElement, Shape } from 'plotly.js-dist-min';

const Timeline: React.FC<{
    id: string;
    chartType: 'categorical' | 'numerical';
    data: { timestamp: number[], value: number[] };
    onBrush: (id: string, x0: number, x1: number) => void;
    onRelayouting: (id: string, x0: number, x1: number) => void;
    timeRange: { start: number, end: number };
}> = ({ id, data, onBrush, onRelayouting, timeRange }) => {

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        console.log("isDragging: ", isDragging)
    }, [isDragging])

    const chartRef = useRef<HTMLDivElement>(null);

    const applyBrushShape = (x0: string, x1: string) => {
        const shape: Partial<Shape>[] = [{
            type: "rect",
            xref: "x",
            yref: "paper",
            x0,
            x1,
            y0: 0,
            y1: 1,
            fillcolor: "rgba(0,0,200,0.15)",
            line: { width: 0 },
        }];
        Plotly.relayout(chartRef.current!, { shapes: shape });
    };

    // const clearBrushShape = () => {
    //     Plotly.relayout(chartRef.current!, { shapes: [] });
    // };

    useEffect(() => {
        if (typeof window === 'undefined' || !chartRef.current) return;
        const layout: Partial<Layout> = {
            margin: { t: 20, b: 40, l: 0, r: 0 },
            xaxis: {
                type: 'date',
                range: [timeRange.start, timeRange.end]
            },
            bargap: 0.01
        };

        const config: Partial<Config> = {
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
            scrollZoom: false,
        };

        const plotData: Data[] = [{
            x: data.timestamp,
            y: data.value,
            type: 'bar'
        }];

        Plotly.newPlot(chartRef.current, plotData, layout, config)
            .then((plot: PlotlyHTMLElement) => {
                // const handleRelayouting = (event: any) => {
                //     // if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
                //     //     onRelayouting?.(id, event["xaxis.range[0]"], event["xaxis.range[1]"]);
                //     // }
                //     console.log("DragMode", layout.dragmode)
                //     console.log("Relayouting: ", event)
                // }
                // const handleRelayout = (event: any) => {
                //     // if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
                //     //     onRelayout.(id, event["xaxis.range[0]"], event["xaxis.range[1]"]);
                //     // }
                //     setIsDragging(false)
                //     console.log("Relayout: ", event)
                // }
                // plot.on('plotly_relayouting', handleRelayouting);
                // plot.on('plotly_relayout', handleRelayout);
                Plotly.relayout(chartRef.current!, { dragmode: "pan" }).then((event: any) => {
                    console.log("DragMode: Pan", event)
                })
                // Cleanup function
                return () => {
                    plot.removeAllListeners('plotly_relayout');
                    plot.removeAllListeners('plotly_relayouting');
                };
            })
            .catch((error: any) => {
                console.error('Error creating plot:', error);
            });

        // Cleanup
        return () => {
            if (chartRef.current) {
                Plotly.purge(chartRef.current);
            }
        };
    }, [data, timeRange]);

    return (
        <div className='w-full flex flex-row justify-center items-center'>
            <div ref={chartRef} style={{ width: '100%', height: '200px' }} />
        </div>
    );
};

export default Timeline;