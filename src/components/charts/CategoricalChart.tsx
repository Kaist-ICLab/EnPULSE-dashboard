'use client'
import { useRef, useEffect, useMemo, useState } from "react"
// ChartJS Related
import { Chart, Chart as ChartJS, registerables, TooltipItem } from "chart.js";
import { Scatter } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-moment'
// Color Scheme from d3
import { schemeCategory10 as colors } from 'd3-scale-chromatic'
// Flowbite
import { Dropdown, DropdownItem, Checkbox } from 'flowbite-react'

type CategoryType = { [key: string]: { index: number, isChecked: boolean } }

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
  const { title, data, height } = props

  const chartRef = useRef<Chart<"scatter", { x: number; y: number; }[], string> | null>(null)
  const [category, setCategory] = useState<CategoryType>(() => {
    console.log("Not again :(")
    const uniqueElements = Array.from(new Set(data.y))
    return uniqueElements.reduce((acc, curr, idx) => (acc[curr] = { index: idx, isChecked: (idx < 10) }, acc), {} as CategoryType)
  })

  const [timestampMin, timestampMax] = useMemo(() => {
    const minTime = data.x[0]
    const maxTime = data.x.at(-1) || minTime
    const timeGap = (maxTime - minTime)

    return [minTime - timeGap * 0.05, maxTime + timeGap * 0.05]
  }, [data])

  // Chart data configuration. Hide the points.
  const chartData = {
    labels: data.y,
    datasets: Object.keys(category).map((c) => {
      return {
        label: c,
        data: data.x.filter((x, i) => data.y[i] == c).map((x, i) => ({ x, y: 1 })),
        pointRadius: 0,
        pointHoverRadius: 0,
        showLine: false,
        fill: false,
        borderColor: undefined,
        tension: 0.1,
        pointBackgroundColor: colors[category[c].index]
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
    borderColor: colors[category[data.y[index]].index],
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
        category={category}
        onCheckboxChanged={v => { console.log(v, category[v]); const newc = { ...category }; newc[v].isChecked = !category[v].isChecked; console.log(newc); setCategory(newc) }}
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
  category: CategoryType,
  onCheckboxChanged: (categoryName: string) => void
}) {
  const { category, onCheckboxChanged } = props

  return (
    <Dropdown
      label="Select Categories"
      className="absolute right-0 border-gray-100 border-2 bg-white text-black"
      size="sm"
    >
      {
        Object.keys(category).map((value, index) =>
          <DropdownItem key={index} onClickCapture={(e) => { e.stopPropagation(); onCheckboxChanged(value) }}>
            <Checkbox defaultChecked={category[value].isChecked} />
            <label htmlFor="checkbox-item-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{value}</label>
          </DropdownItem>
        )
      }
    </Dropdown>
  )
}