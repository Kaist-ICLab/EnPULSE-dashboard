'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import useSectionState from "@/hooks/useSectionState";
import { scaleTime } from '@visx/scale';
import { AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import dayjs from "dayjs";

const TimelineXAxis: React.FC<{
    width: number;
}> = ({ width }) => {
    const { timeRange, draggedTime, updateDraggedTime, updateTimeRangeAfterDrag } = useSectionState();
    const currentTimeRange = useMemo(() => {
        return { start: timeRange.start + draggedTime, end: timeRange.end + draggedTime };
    }, [timeRange, draggedTime]);

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

    // Throttle store updates with requestAnimationFrame so we don't
    // push draggedTime on every mousemove and hit maximum update depth.
    const latestDeltaRef = useRef(0);
    const rafIdRef = useRef<number | null>(null);
    const lastSentTimeRef = useRef(0);

    const startRafLoop = useCallback(() => {
        if (rafIdRef.current != null) return;

        const loop = () => {
            const now = performance.now();
            const minInterval = 1000 / 30; // ms -> ~20 updates per second

            if (now - lastSentTimeRef.current >= minInterval) {
                updateDraggedTime(latestDeltaRef.current);
                lastSentTimeRef.current = now;
            }

            rafIdRef.current = window.requestAnimationFrame(loop);
        };

        rafIdRef.current = window.requestAnimationFrame(loop);
    }, [updateDraggedTime]);

    const stopRafLoop = useCallback(() => {
        if (rafIdRef.current != null) {
            window.cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
    }, []);

    const handleMouseDown = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (event.button !== 0) return; // Only handle left mouse button

        // Prevent text/tick selection while dragging
        event.preventDefault();

        setIsDragging(true);
        dragStartRef.current = {
            x: event.clientX,
            startTime: currentTimeRange.start,
            endTime: currentTimeRange.end,
        };
        latestDeltaRef.current = 0;
        startRafLoop();
    }, [currentTimeRange, startRafLoop]);

    const handleMouseMove = useCallback((clientX: number) => {
        if (!isDragging || !dragStartRef.current) return;

        const deltaX = clientX - dragStartRef.current.x;
        const currentRange = dragStartRef.current.endTime - dragStartRef.current.startTime;
        const pixelToTimeRatio = currentRange / innerWidth;
        const deltaTime = -deltaX * pixelToTimeRatio; // Negative because dragging right should move forward in time

        // Only update the ref here; the RAF loop will push to the store
        latestDeltaRef.current = deltaTime;
    }, [isDragging, innerWidth]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        stopRafLoop();
        dragStartRef.current = null;
        latestDeltaRef.current = 0;
        updateTimeRangeAfterDrag();
    }, [stopRafLoop, updateTimeRangeAfterDrag]);

    // Handle global mouseup and mousemove so dragging continues even if the cursor leaves the SVG.
    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalMouseMove = (event: MouseEvent) => {
            handleMouseMove(event.clientX);
        };

        const handleGlobalMouseUp = () => {
            handleMouseUp();
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Cleanup RAF on unmount just in case.
    useEffect(() => {
        return () => {
            stopRafLoop();
        };
    }, [stopRafLoop]);

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
                    onMouseMove={(e) => handleMouseMove(e.clientX)}
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
