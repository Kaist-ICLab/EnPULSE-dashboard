'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import useSectionState from "@/hooks/useSectionState";
import { SectionType } from "@/types/chart";
import { scaleTime } from '@visx/scale';
import { AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import dayjs from "dayjs";

const TimelineXAxis: React.FC<{
    sectionType: SectionType;
    width: number;
}> = ({ sectionType, width }) => {
    const { timeRange, updateTimeRange } = useSectionState();
    const currentTimeRange = useMemo(() => {
        return timeRange[sectionType];
    }, [timeRange, sectionType]);

    const height = 20;
    const containerRef = useRef<HTMLDivElement>(null);

    const margin = { top: 0, right: 0, bottom: 20, left: 0 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Time scale for the axis
    const timeScale = useMemo(() => {
        return scaleTime({
            domain: [currentTimeRange.start, currentTimeRange.end],
            range: [0, innerWidth],
        });
    }, [currentTimeRange, innerWidth]);


    // Handle panning with mouse drag
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number; startTime: number; endTime: number } | null>(null);

    const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (event.button !== 0) return; // Only handle left mouse button
        setIsDragging(true);
        dragStartRef.current = {
            x: event.clientX,
            startTime: currentTimeRange.start,
            endTime: currentTimeRange.end,
        };
    }, [currentTimeRange]);

    const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging || !dragStartRef.current) return;

        const deltaX = event.clientX - dragStartRef.current.x;
        const currentRange = dragStartRef.current.endTime - dragStartRef.current.startTime;
        const pixelToTimeRatio = currentRange / innerWidth;
        const deltaTime = -deltaX * pixelToTimeRatio; // Negative because dragging right should move forward in time

        const newStart = dragStartRef.current.startTime + deltaTime;
        const newEnd = dragStartRef.current.endTime + deltaTime;

        updateTimeRange(sectionType, {
            start: newStart,
            end: newEnd,
        });
    }, [isDragging, innerWidth, sectionType, updateTimeRange]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        dragStartRef.current = null;
    }, []);

    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseUp = () => {
                setIsDragging(false);
                dragStartRef.current = null;
            };
            window.addEventListener('mouseup', handleGlobalMouseUp);
            return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
        }
    }, [isDragging]);

    // Format tick values for date display
    const formatTickValue = useCallback((value: Date | { valueOf(): number }) => {
        // We are using a millisecond offset, so to convert this into human readable format, we need to convert to UTC
        // Hence we subtract the utc offset from the date
        if (value instanceof Date) {
            const day = dayjs(value)
            const utcDay = day.subtract(day.utcOffset(), 'minutes')
            return utcDay.format('HH:mm');
        } else {
            return dayjs(value.valueOf()).format('HH:mm');
        }
    }, []);

    if (width === 0) {
        return (
            <div ref={containerRef} className='w-full flex flex-row justify-center items-center' style={{ height: `${height}px` }} />
        );
    }

    return (
        <div className='ml-auto pr-1 flex flex-row justify-center items-center'>
            <div ref={containerRef} style={{ width: '100%', height: `${height}px` }}>
                <svg
                    width={width}
                    height={height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    <Group left={margin.left} top={margin.top}>
                        <AxisBottom
                            top={innerHeight}
                            scale={timeScale}
                            tickFormat={formatTickValue}
                            stroke="#000"
                            tickStroke="#000"
                            tickLabelProps={() => ({
                                fill: '#000',
                                fontSize: 10,
                                textAnchor: 'middle' as const,
                            })}
                            numTicks={Math.max(2, Math.floor(innerWidth / 100))}
                        />
                        {/* Invisible overlay for panning */}
                        <rect
                            x={0}
                            y={0}
                            width={innerWidth}
                            height={innerHeight}
                            fill="transparent"
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        />
                    </Group>
                </svg>
            </div>
        </div>
    );
};

export default TimelineXAxis;
