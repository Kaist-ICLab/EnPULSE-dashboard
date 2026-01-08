'use client'

import { useRef } from "react";
import { SectionType, TimelineCategoricalPoint, TimelineNumericalPoint } from "@/types/chart";
import { TimelineGraph } from "./graphs/TimelineGraph";
import { TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { Group } from '@visx/group';
import { margin } from "./shared/timelineUtils";
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
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const { timeScale, valueScale, barWidth, handleMouseMove, handleDoubleClick, handleBrushChange, tooltipData, tooltipLeft, tooltipTop, tooltipOpen, hideTooltip, getCategoryColor, uniqueCategories, handleLegendClick } = useChartState(data, chartType, sectionType, bucketSize, baseTime, svgRef, containerRef, innerWidth, innerHeight);

    if (width === 0 || height === 0) {
        return (
            <div ref={containerRef} className='w-full flex flex-row justify-center items-center' style={{ height: '100px' }} />
        );
    }

    return (
        <div className="w-full flex flex-col justify-center items-center" ref={containerRef}>
            <div
                className="w-full flex flex-col justify-center items-center relative"
                style={{ height: `${height}px` }}
            >
                {chartType === 'categorical' && <CategoricalTimelineLegend uniqueCategories={uniqueCategories} getCategoryColor={getCategoryColor} handleLegendClick={handleLegendClick} />}
                <svg
                    ref={svgRef}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={hideTooltip}
                >
                    <Group left={margin.left} top={margin.top} onDoubleClick={handleDoubleClick}>
                        <TimelineGraph chartType={chartType} data={data} height={height} timeScale={timeScale} valueScale={valueScale} barWidth={barWidth} getCategoryColor={getCategoryColor} />
                        <Brush
                            xScale={timeScale}
                            yScale={valueScale}
                            width={width - margin.left - margin.right}
                            height={height - margin.top - margin.bottom}
                            margin={margin}
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
