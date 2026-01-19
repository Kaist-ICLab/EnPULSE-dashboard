'use client'

import { useRef } from "react";
import { SectionType, TimelineCategoricalPoint, TimelineNumericalPoint } from "@/types/chart";
import { TimelineGraph } from "./graphs/TimelineGraph";
import { TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { Group } from '@visx/group';
import { Brush } from "@visx/brush";
import { useChartState } from "@/hooks/charts/useChartState";
import { CategoricalTimelineLegend } from "./legends/CategoricalTimelineLegend";

interface TimelineChartProps {
    sectionType: SectionType;
    chartType: 'categorical' | 'numerical';
    baseTime: number;
    data: (TimelineNumericalPoint | TimelineCategoricalPoint)[];
    bucketSize: number;
    width: number;
    height: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
    sectionType,
    chartType,
    baseTime,
    data,
    bucketSize,
    width,
    height,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const { timeScale, valueScale, barWidth, handleMouseMove, handleDoubleClick, handleBrushChange, tooltipData, tooltipLeft, tooltipTop, tooltipOpen, hideTooltip, getCategoryColor, uniqueCategories, handleLegendClick } = useChartState(data, chartType, sectionType, bucketSize, baseTime, svgRef, width, height);

    if (width === 0 || height === 0) {
        return (
            <div className='w-full flex flex-row justify-center items-center' />
        );
    }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            {chartType === 'categorical' && <CategoricalTimelineLegend uniqueCategories={uniqueCategories} getCategoryColor={getCategoryColor} handleLegendClick={handleLegendClick} />}
            <div
                className="w-full flex flex-col justify-center items-center relative border-1 border-gray-200"
                style={{ height: `${height}px` }}
            >
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={hideTooltip}
                >
                    <Group onDoubleClick={handleDoubleClick}>
                        <TimelineGraph chartType={chartType} data={data} height={height} timeScale={timeScale} valueScale={valueScale} barWidth={barWidth} getCategoryColor={getCategoryColor} />
                        <Brush
                            xScale={timeScale}
                            yScale={valueScale}
                            width={width}
                            height={height}
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
