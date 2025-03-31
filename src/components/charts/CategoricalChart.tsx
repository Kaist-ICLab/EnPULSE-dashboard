'use client'
import { useRef, useEffect } from "react"
import useCategoryToIndex from "@/hooks/useCategoryToIndex";

// ChartJS Related
import { Chart, Chart as ChartJS, registerables, TooltipItem } from "chart.js";
import { Scatter } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-moment'

// Color Scheme from d3
import { schemeCategory10 as colors } from 'd3-scale-chromatic'
import CateogorySelectionDropdown from "./CategorySelectionDropdown";



ChartJS.register(...registerables, annotationPlugin);


const MAX_SELECTED_CATEGORY = 10

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
  const { data } = props

  const uniqueElements = Array.from(new Set(data.y))
  const [timestampMin, timestampMax] = (() => {
    const minTime = data.x[0]
    const maxTime = data.x.at(-1) || minTime
    const timeGap = maxTime - minTime
    return [minTime - timeGap * 0.05, maxTime + timeGap * 0.05]
  })()

  const chartRef = useRef<Chart<"scatter", { x: number; y: number; }[], string> | null>(null)
  const [categoryToIndex, modifySelectedCategory] = useCategoryToIndex(uniqueElements, MAX_SELECTED_CATEGORY)

  // Chart data configuration. Hide the points.
  const chartData = {
    labels: data.y,
    datasets: uniqueElements.filter(c => c in categoryToIndex).map((c) => {
      return {
        label: c,
        data: data.x.filter((_, i) => data.y[i] == c).map(x => ({ x, y: 1 })),
        pointRadius: 0,
        pointHoverRadius: 0,
        showLine: false,
        fill: false,
        borderColor: undefined,
        borderWidth: 0,
        tension: 0.1,
        pointBackgroundColor: colors[categoryToIndex[c]]
      }
    })
  };

  // Zoom plugin configuration.
  const zoomOptions = {
    pan: {
      enabled: true,
      modifierKey: "ctrl" as const,
    },
    zoom: {
      mode: "x" as const,
      drag: {
        enabled: true,
        maintainAspectRatio: false,
        backgroundColor: 'rgba(200, 200, 200, 0.5)'
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
    yMax: value in categoryToIndex ? 1 : 0,
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
        display: false,
        labels: {
          boxWidth: 20
        }
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
        ChartJS.register(plugin.default);
        chartRef.current?.update() // Force update to make interaction available as the first action.
      });
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex mb-2 px-4">
        <div className="min-h-0 mr-4 my-auto flex-1 text-sm break-normal text-wrap">
          {
            Object.keys(categoryToIndex).map((c, i) =>
              <div key={i} className="inline-block ml-4 break-keep">
                <span className="w-4 h-4 mr-1 inline-block align-text-bottom" style={{ backgroundColor: colors[categoryToIndex[c]] }} />
                {c + ' '}
              </div>
            )
          }
        </div>
        <CateogorySelectionDropdown
          uniqueElements={uniqueElements}
          categoryToIndex={categoryToIndex}
          maxSelectedCategory={MAX_SELECTED_CATEGORY}
          onCheckboxChanged={modifySelectedCategory}
        />
      </div>
      <div className="w-full flex-1 relative">
        <Scatter
          ref={chartRef}
          data={chartData}
          options={options}
          onDoubleClick={() => chartRef.current?.resetZoom()}
        />
      </div>
    </div>
  );
}