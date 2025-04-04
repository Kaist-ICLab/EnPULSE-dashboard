import annotationPlugin, { AnnotationPluginOptions } from 'chartjs-plugin-annotation'
import { ZoomPluginOptions } from "chartjs-plugin-zoom/types/options"
import { useRef, useMemo, useEffect, RefObject } from "react"
import { Chart, Chart as ChartJS, ChartOptions, Plugin, registerables, TooltipItem } from "chart.js";

// Color Scheme from d3
ChartJS.register(...registerables, annotationPlugin);

export default function useChartOptions(
  data: { x: number[], y: string[] },
  colors: readonly string[],
  uniqueElements: string[],
  chartRef: RefObject<Chart<'scatter', { x: number, y: number }[], string> | null>,
  categoryToIndex: { [key: string]: number }
) {
  const [timestampMin, timestampMax] = (() => {
    const minTime = data.x[0]
    const maxTime = data.x.at(-1) || minTime
    const timeGap = maxTime - minTime
    return [minTime - timeGap * 0.05, maxTime + timeGap * 0.05]
  })()

  // Detect whether the zoom/pan is happening due to user interaction
  // use reference to bypass any possible re-renders.
  const isZooming = useRef(false)
  const isPanning = useRef(false)
  const isMouseDown = useRef(false)
  const scaleMinMax = useRef({ min: -1, max: -1 })

  // Chart data configuration.
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

  // Generate event line.
  const annotationOptions: AnnotationPluginOptions = useMemo(() => {
    return {
      annotations: data.y.map((value, index) => {
        const idx = categoryToIndex[data.y[index]]
        const color = idx === undefined ? '#cccccc' : colors[idx]

        return {
          type: 'line' as const,
          xMin: data.x[index],
          xMax: data.x[index],
          yMin: 0,
          yMax: 1,
          value: value,
          borderColor: color,
          borderWidth: 2,
        }
      })
    }
  }, [colors, data, categoryToIndex])


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
        },
      },
    }
  }, [timestampMax, timestampMin, zoomOptions, annotationOptions])

  const scaleHaltPlugin: Plugin<'scatter', { x: number, y: number }[]> = useMemo(() => ({
    id: 'scale-halt',
    afterDataLimits: function (chart: Chart<'scatter', { x: number, y: number }[]>, { scale }) {
      // We only care about x (time) axis
      if (scale.axis != 'x') return
      // Check if zoom plugin is loaded, by checking for zoom()
      if (!(Object.keys(chart).includes('zoom'))) return
      if (scaleMinMax.current.min == -1) return

      // allow scales
      // On panning
      if (isPanning.current) return
      // Zooming via wheel or double-click
      if (isZooming.current) return
      // Zoom via mouse drag, range selection finalized
      if (chart.isZoomingOrPanning() && !isMouseDown.current) return

      // if(chart > scaleMinMax.current.max) return
      scale.min = scaleMinMax.current.min

      const lastTimestamp = Math.max(...chart.data.datasets.map((dataset) => dataset.data[dataset.data.length - 1].x))
      // latest data out of range || still selecting => fix max
      if (scaleMinMax.current.max < lastTimestamp || isMouseDown.current) {
        scale.max = scaleMinMax.current.max
      } else {
        scaleMinMax.current.max = scale.max
      }
    }
  }), [])

  const initZoom = () => {
    isZooming.current = true
    chartRef.current?.resetZoom()
  }

  const setIsMouseDown = (mouseDown: boolean) => {
    isMouseDown.current = mouseDown
  }


  useEffect(() => {
    if (chartRef.current) {
      import("chartjs-plugin-zoom").then((plugin) => {
        ChartJS.register(plugin.default);
        ChartJS.register(scaleHaltPlugin)
        chartRef.current?.update() // Force update to make interaction available as the first action.
      });
    }
  }, [chartRef, scaleHaltPlugin]);

  return { chartData, options, initZoom, setIsMouseDown }
}