'use client'
import { useRef, useEffect, useMemo } from "react"
import { Chart as ChartJS, elements, registerables, TooltipItem, TooltipModel } from "chart.js";
import { Scatter } from 'react-chartjs-2'
import { schemeCategory10 } from 'd3-scale-chromatic'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(...registerables, annotationPlugin);

/**
 * Component for chart that visualizes categorical data.
 * 
 * Note that the wrapping &lt;div&gt; element should be positioned relative.
 * @param props a
 * @returns 
 */
export default function CategoricalChart(props: {
  title: string,
  data: { name: string, x: number[], y: string[] }
  height: number
}) {
  const colors = schemeCategory10

  const { title, data, height } = props
  const ref = useRef<HTMLDivElement>(null)

  const categoryToIndex = useMemo(() => {
    const uniqueElements = Array.from(new Set(data.y))
    return uniqueElements.reduce((acc, curr, idx) => (acc[curr] = idx, acc), {} as { [key: string]: number })
  }, [data])

  const chartData = {

    labels: data.y,
    datasets: Object.keys(categoryToIndex).map((category) => {
      return {
        label: category,
        data: data.x.filter((x, i) => data.y[i] == category).map((x, i) => { return { x, y: 1 } }),
        pointRadius: 0,
        showLine: false,
        fill: false,
        borderColor: undefined,
        tension: 0.1,
        pointBackgroundColor: colors[categoryToIndex[category]]
      }
    })
  };

  const zoomOptions = {
    pan: {
      enabled: true,
      modifierKey: "ctrl" as const,
    },
    zoom: {
      drag: {
        enabled: true,
        maintainAspectRatio: false,
      },
      wheel: {
        enabled: true,
        maintainAspectRatio: false,
      },
      mode: "x" as const,
    },
  };

  // Generate event line
  const annotationOptions = data.y.map((value, index) => ({
    type: 'line' as const,
    xMin: data.x[index],
    xMax: data.x[index],
    yMin: 0,
    yMax: 1,
    value: value,
    borderColor: colors[categoryToIndex[data.y[index]]],
    borderWidth: 2,
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      y: {
        display: false,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    plugins: {
      zoom: zoomOptions,
      annotation: {
        annotations: annotationOptions
      },
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          // title: function (context: TooltipItem<"scatter">) { return data.x[context.dataIndex] },
          label: function (context: TooltipItem<"scatter">) { return data.y[context.dataIndex] }
        }
      }
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      import("chartjs-plugin-zoom").then((plugin) => {
        ChartJS.register(plugin.default);
      });
    }

  }, []);

  return (
    <Scatter data={chartData} options={options} />
  );
}