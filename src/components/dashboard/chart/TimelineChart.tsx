'use client'

import { useRef } from "react";
import { ChartType, TimelineDataPoint } from "@/types/chart";
import { TimelinePlot } from "./plot/TimelinePlot";
import { TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { Group } from '@visx/group';
import { Brush } from "@visx/brush";
import { usePlotState } from "@/hooks/chart/plot/usePlotState";
import { CategoricalTimelineLegend } from "./legend/CategoricalTimelineLegend";
import { useChartLegendState } from "@/hooks/chart/legend/useChartLegendState";

interface TimelineChartProps {
    fieldId: number;
    chartType: ChartType;
    baseTime: number;
    data: TimelineDataPoint[];
    bucketSize: number;
    isSelected: boolean;
    width: number;
    height: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
    fieldId,
    chartType,
    baseTime,
    data,
    bucketSize,
    isSelected,
    width,
    height,
}) => {
    const chartHeight = chartType === 'categorical' ? height - 26 : height;
    const svgRef = useRef<SVGSVGElement>(null);
    const { getCategoryColor, uniqueCategories, handleLegendClick } = useChartLegendState(chartType, data);
    const {
        timeScale,
        valueScale,
        barWidth,
        handleMouseMove,
        handleDoubleClick,
        handleBrushChange,
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        hideTooltip,
        getColor,
    } = usePlotState(data, chartType, bucketSize, baseTime, svgRef, width, chartHeight, fieldId);


    if (width === 0 || height === 0) {
        return (
            <div className='w-full flex flex-row justify-center items-center' />
        );
    }


    return (
        <div className="w-full flex flex-col justify-center items-center" onClick={e => e.stopPropagation()}>
            <div
                className={`w-full flex flex-col justify-center items-center relative border-2 ${isSelected ? 'border-blue-200' : 'border-gray-200'}`}
                style={{ height: `${height}px` }}
            >
                {chartType === 'categorical' && <CategoricalTimelineLegend
                    uniqueCategories={uniqueCategories}
                    getCategoryColor={getCategoryColor}
                    handleLegendClick={handleLegendClick}
                    fieldId={fieldId} />}
                <svg
                    ref={svgRef}
                    width={width}
                    height={chartHeight}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={hideTooltip}
                >
                    <Group onDoubleClick={handleDoubleClick}>
                        <TimelinePlot
                            chartType={chartType}
                            data={data}
                            height={chartHeight}
                            timeScale={timeScale}
                            valueScale={valueScale}
                            barWidth={barWidth}
                            getCategoryColor={getCategoryColor}
                            getColor={getColor as (point: TimelineDataPoint) => { color: string; opacity: number }[]}
                        />
                        <Brush
                            xScale={timeScale}
                            yScale={valueScale}
                            width={width}
                            height={chartHeight}
                            handleSize={8}
                            brushDirection="horizontal"
                            onBrushEnd={handleBrushChange}
                            resetOnEnd={true}
                        />
                    </Group>
                </svg>
                {tooltipOpen && tooltipData && (
                    <TooltipWithBounds
                        top={tooltipTop}
                        left={tooltipLeft}
                        style={{
                            ...defaultStyles,
                            position: 'absolute',
                        }}
                    >
                        <div>
                            {
                                tooltipData.map((d) => (
                                    <div key={d.label}>{d.label}: {d.value}</div>
                                ))
                            }
                        </div>
                    </TooltipWithBounds>
                )}
            </div>
        </div >
    );
};

export default TimelineChart;
