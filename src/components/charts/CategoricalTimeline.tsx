'use client'
import { useRef } from "react"
import useCategoryToIndex from "@/hooks/chart/useCategoryToIndex";

// ChartJS Related
import { Chart } from 'chart.js'
import { Scatter } from 'react-chartjs-2'
import 'chartjs-adapter-moment'
import CateogorySelectionDropdown from "./CategorySelectionDropdown";

// d3 colorScheme
import { schemeCategory10 as colors } from 'd3-scale-chromatic'
import useChartOptions from "@/hooks/chart/useChartOptions";

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
  const chartRef = useRef<Chart<"scatter", { x: number; y: number; }[], string> | null>(null)

  const [categoryToIndex, modifySelectedCategory] = useCategoryToIndex(uniqueElements, MAX_SELECTED_CATEGORY)
  const { chartData, options, initZoom, setIsMouseDown } = useChartOptions(data, colors, uniqueElements, chartRef, categoryToIndex)

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
          onDoubleClick={initZoom}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        />
      </div>
    </div>
  );
}