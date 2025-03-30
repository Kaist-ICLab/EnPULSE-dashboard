'use client'
import { useRef, useEffect, useState } from "react"
// ChartJS Related
import { Chart, Chart as ChartJS, registerables, TooltipItem } from "chart.js";
import { Scatter } from 'react-chartjs-2'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-adapter-moment'

// Color Scheme from d3
import { schemeCategory10 as colors } from 'd3-scale-chromatic'

// Flowbite
import { Dropdown, DropdownItem, Checkbox } from 'flowbite-react'

type CategoryType = { [key: string]: number }

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
    const { data } = props
    const MAX_SELECTED_CATEGORY = 10

    const uniqueElements = Array.from(new Set(data.y))
    const [timestampMin, timestampMax] = (() => {
        const minTime = data.x[0]
        const maxTime = data.x.at(-1) || minTime
        const timeGap = maxTime - minTime
        return [minTime - timeGap * 0.05, maxTime + timeGap * 0.05]
    })()

    const chartRef = useRef<Chart<"scatter", { x: number; y: number; }[], string> | null>(null)
    const [categoryToIndex, setCategoryToIndex] = useState(
        uniqueElements.filter((_, i) => i < MAX_SELECTED_CATEGORY).reduce((acc, curr, idx) => (acc[curr] = idx, acc), {} as CategoryType)
    )
    const modifySelectedCategory = (c: string) => {
        const newCategoryToIndex = { ...categoryToIndex }
        if (c in categoryToIndex) {
            delete newCategoryToIndex[c]
        } else {
            const indices = Object.values(categoryToIndex)
            let nextFreeIndex = 0;
            for (; nextFreeIndex < MAX_SELECTED_CATEGORY; nextFreeIndex++) {
                if (!indices.includes(nextFreeIndex)) break
            }

            if (nextFreeIndex < MAX_SELECTED_CATEGORY) newCategoryToIndex[c] = nextFreeIndex
        }

        setCategoryToIndex(newCategoryToIndex)
    }

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
                tension: 0.1,
                pointBackgroundColor: colors[categoryToIndex[c]]
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
                ChartJS.register(plugin.default);
                chartRef.current?.render()
            });
        }
    }, []);

    return (
        <div className="w-full h-full relative">
            <CateogorySelectDropdown
                uniqueElements={uniqueElements}
                categoryToIndex={categoryToIndex}
                onCheckboxChanged={modifySelectedCategory}
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
    uniqueElements: string[],
    categoryToIndex: { [key: string]: number },
    onCheckboxChanged: (categoryName: string) => void
}) {
    const { uniqueElements, categoryToIndex, onCheckboxChanged } = props

    return (
        <Dropdown
            label="Select Categories"
            className="absolute right-0 border-gray-100 border-2 bg-white text-black"
            size="sm"
        >
            {
                uniqueElements.map((value, index) =>
                    <DropdownItem key={index} onClickCapture={(e) => { e.stopPropagation(); onCheckboxChanged(value) }}>
                        <Checkbox checked={value in categoryToIndex} readOnly />
                        <label htmlFor="checkbox-item-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{value}</label>
                    </DropdownItem>
                )
            }
        </Dropdown>
    )
}