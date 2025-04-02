'use client'
import { useRef, useEffect, useMemo } from "react"
import useCategoryToIndex from "@/hooks/useCategoryToIndex";

// ChartJS Related
import { Chart, Chart as ChartJS, ChartOptions, registerables, TooltipItem } from "chart.js";
import { Scatter } from 'react-chartjs-2'
import annotationPlugin, { AnnotationPluginOptions } from 'chartjs-plugin-annotation'
import 'chartjs-adapter-moment'

// Color Scheme from d3
import { schemeCategory10 as colors } from 'd3-scale-chromatic'
import CateogorySelectionDropdown from "./CategorySelectionDropdown";
import { ZoomPluginOptions } from "chartjs-plugin-zoom/types/options";



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
  height: number,
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
  const isZooming = useRef(false)
  const isPanning = useRef(false)
  const scaleMinMax = useRef({ min: -1, max: -1 })

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
  }

  // Zoom plugin configuration.
  const zoomOptions: ZoomPluginOptions = useMemo(() => {
    return {
      pan: {
        onPan: function () {
          isPanning.current = true
        },
        onPanComplete: function ({ chart }) {
          const scale = chart.scales.x
          scaleMinMax.current.min = scale.min
          scaleMinMax.current.max = scale.max
          isPanning.current = false
        },
        enabled: true,
        modifierKey: "ctrl" as const,
      },
      zoom: {
        onZoom: function () {
          isZooming.current = true
        },
        onZoomComplete: function ({ chart }) {
          const scale = chart.scales.x
          scaleMinMax.current.min = scale.min
          scaleMinMax.current.max = scale.max
          isZooming.current = false
        },
        mode: "x" as const,
        drag: {
          enabled: true,
          maintainAspectRatio: false,
          backgroundColor: 'rgba(200, 200, 200, 0.5)'
        },
        wheel: {
          enabled: true,
        },
      },
      limits: {
        x: {
          min: timestampMin,
          max: timestampMax,
        },
        y: {
          min: 0,
          max: 1.2,
        }
      }
    }
  }, [timestampMin, timestampMax])

  // Generate event line
  const annotationOptions: AnnotationPluginOptions = useMemo(() => {
    return {
      annotations: data.y.map((value, index) => ({
        type: 'line' as const,
        xMin: data.x[index],
        xMax: data.x[index],
        yMin: 0,
        yMax: value in categoryToIndex ? 1 : 0,
        value: value,
        borderColor: colors[categoryToIndex[data.y[index]]],
        borderWidth: 2,
      }))
    }
  }, [data, categoryToIndex])


  const options: ChartOptions<'scatter'> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          type: 'time' as const,
          min: timestampMin,
          max: timestampMax,
          // ticks: {

          //   callback: function (timestamp, index, ticks) {
          //     if (!this.ticks || index == 0) return this.getLabelForValue(Number(timestamp))
          //     const [monthDay, year, time] = this.getLabelForValue(Number(timestamp)).split(',')
          //     const [prevMonthDay, prevYear, prevTime] = this.getLabelForValue(Number(ticks[index - 1].value)).split(',')

          //     let tick = time
          //     if (monthDay != prevMonthDay) {
          //       if (year != prevYear) tick = year + ',' + tick
          //       tick = monthDay + ',' + tick
          //     }

          //     return tick
          //   }
          // }
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
        annotation: annotationOptions,
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
      },
    }
  }, [timestampMax, timestampMin, zoomOptions, annotationOptions])

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
          colors={colors}
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
          onDoubleClick={() => { isZooming.current = true; chartRef.current?.resetZoom() }}
          plugins={[{
            id: 'test',
            afterDataLimits: function (chart, { scale }) {
              if (scale.axis != 'x') return
              if (!(Object.keys(chart).includes('zoom'))) return
              if (scaleMinMax.current.min == -1) return
              if (isPanning.current || isZooming.current || chart.isZoomingOrPanning()) return

              scale.min = scaleMinMax.current.min
              scale.max = scaleMinMax.current.max
            }
          }]}
        />
      </div>
    </div>
  );
}