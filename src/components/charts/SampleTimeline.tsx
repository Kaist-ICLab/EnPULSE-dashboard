'use client';

import dynamic from 'next/dynamic';
import { Data, Layout } from 'plotly.js';
import Loading from '@/components/Loading';


const Plot = dynamic(
    () => import('react-plotly.js'),
    {
        ssr: false,
        loading: () => <Loading />
    },
);

const SampleTimeline: React.FC<{
    title: string,
    data: { name: string, x: number[], y: number[] },
    height: number,
}> = ({ title, data, height }) => {
    const trace: Data = {
        x: data.x,
        y: data.y,
        type: 'scatter',
        mode: 'lines',
        name: data.name,
        line: { width: 2, color: 'blue' },
    };
    const layout: Partial<Layout> = {
        title,
        xaxis: {
            title: 'Time',
        },
        yaxis: {
            title: 'Sensor Value',
        },
        legend: {
            orientation: 'h',
            x: 0.1,
            y: 1.15,
        },
        margin: { t: 60, l: 60, r: 40, b: 60 },
    };
    return (<Plot
        data={[trace]}
        layout={layout}
        style={{ width: '100%', height: `${height}px` }}
        config={{
            modeBarButtonsToRemove: [
                'zoom2d',
                'pan2d',
                'select2d',
                'lasso2d',
                'zoomIn2d',
                'zoomOut2d',
                'autoScale2d',
                'hoverClosestCartesian',
                'hoverCompareCartesian',
                'toggleSpikelines',
                'toImage',
            ],
            displaylogo: false,
            responsive: true
        }}
    />)
}

export default SampleTimeline;