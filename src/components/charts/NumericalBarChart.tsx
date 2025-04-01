'use client'
import { useRef, useEffect, useState } from "react";
import { Chart as ChartJS, registerables, ChartOptions } from "chart.js";
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(...registerables, zoomPlugin);

export default function NumericalBarChart(props: {
  title: string;
  data: { x: number[]; y: number[] };
  height: number;
}) {
  const { data } = props;

  const [timestampMin, timestampMax] = (() => {
    const minTime = data.x[0];
    const maxTime = data.x.at(-1) || minTime;
    const timeGap = maxTime - minTime;
    return [minTime - timeGap * 0.05, maxTime + timeGap * 0.05];
  })();

  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  const chartData = {
    labels: data.x,
    datasets: [
      {
        label: props.title,
        data: data.y,
        backgroundColor: "rgba(99, 132, 255, 0.8)",
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        min: timestampMin,
        max: timestampMax,
        time: {
          unit: 'hour',
          displayFormats: {
            day: 'MMM D',
          },
        },
        offset: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          modifierKey: 'ctrl',
        },
        zoom: {
          drag: {
            enabled: true,
            backgroundColor: 'rgba(200,200,200,0.3)',
          },
          wheel: {
            enabled: true,
          },
          mode: 'x',
        },
        limits: {
          x: { min: timestampMin, max: timestampMax },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.formattedValue;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-1 relative overflow-x-auto">
        <div className="min-w-[800px] h-full">
          <Bar
            ref={chartRef}
            data={chartData}
            options={options}
            onDoubleClick={() => chartRef.current?.resetZoom()}
          />
        </div>
      </div>
    </div>
  );
}