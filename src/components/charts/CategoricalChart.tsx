'use client'
import { useRef, useEffect, useMemo, useState } from "react"
import { Chart, Chart as ChartJS, registerables, TooltipItem } from "chart.js";
import { Scatter } from 'react-chartjs-2'
import { schemeCategory10 } from 'd3-scale-chromatic'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Dropdown, DropdownItem } from 'flowbite-react'
import 'chartjs-adapter-moment'

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
  const chartRef = useRef<Chart<"scatter", { x: number; y: number; }[], string> | null>(null)

  const categoryToIndex = useMemo(() => {
    const uniqueElements = Array.from(new Set(data.y))
    return uniqueElements.reduce((acc, curr, idx) => (acc[curr] = idx, acc), {} as { [key: string]: number })
  }, [data])
  const [timestampMin, timestampMax] = useMemo(() => {
    const minTime = data.x[0]
    const maxTime = data.x.at(-1) || minTime
    const timeGap = (maxTime - minTime)

    return [minTime - timeGap * 0.05, maxTime + timeGap * 0.05]
  }, [data])

  // Chart data configuration. Hide the points.
  const chartData = {
    labels: data.y,
    datasets: Object.keys(categoryToIndex).map((category) => {
      return {
        label: category,
        data: data.x.filter((x, i) => data.y[i] == category).map((x, i) => { return { x, y: 1 } }),
        pointRadius: 0,
        pointHoverRadius: 0,
        showLine: false,
        fill: false,
        borderColor: undefined,
        tension: 0.1,
        pointBackgroundColor: colors[categoryToIndex[category]]
      }
    })
  };

  // Zoom plugin configuration.
  const zoomOptions = {
    pan: {
      enabled: false,
      modifierKey: "ctrl" as const,
    },
    zoom: {
      mode: "x" as const,
      drag: {
        enabled: true,
        maintainAspectRatio: false,
      },
      wheel: {
        enabled: true,
      },
      limits: {
        x: {
          min: timestampMin,
          max: timestampMax,
        }
      }
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
      x: {
        type: 'time' as const,
        min: timestampMin,
        max: timestampMax,
      },
      y: {
        display: false,
        min: 0,
        max: 1.2
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
          title: function (context: TooltipItem<"scatter">[]) { return context[0].dataset.label },
          label: function (context: TooltipItem<"scatter">) { return context.formattedValue.split(/,|\(/).splice(1, 3).join() }
        }
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      import("chartjs-plugin-zoom").then((plugin) => {
        console.log("Register!")
        ChartJS.register(plugin.default);
        chartRef.current?.render()
      });
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <CateogorySelectDropdown
        category={Object.keys(categoryToIndex)}
      />
      <Scatter
        ref={chartRef}
        data={chartData}
        options={options}
        onDoubleClick={() => chartRef.current?.resetZoom()}
      />
    </div>
  );
}

function CateogorySelectDropdown(props: {
  category: string[]
}) {
  const { category } = props
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <Dropdown
      label="Select Categories"
      className="absolute right-0 border-gray-100 border-2 bg-white text-black"
      size="sm"
    >
      {
        category.map((value) =>
          <DropdownItem>
            <input checked id="checkbox-item-2" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
            <label htmlFor="checkbox-item-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{value}</label>
          </DropdownItem>
        )
      }
    </Dropdown>
  )
}