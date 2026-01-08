import { useMemo, useState, useRef, useCallback } from "react";
import { colors, gray } from "@/components/dashboard/charts/shared/timelineUtils";
import { TimelineCategoricalPoint } from "@/types/chart";

export function useCategoricalChartLegend(data: TimelineCategoricalPoint[]) {
    const colorQueue = useRef<{ traceIndex: number, colorIndex: number }[] | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<Set<number>>(new Set());

    const uniqueCategories = useMemo(() => {
        // Extract all unique categories from all data points
        const categorySet = new Set<number>();

        if (data.length > 0) {
            data.forEach(d => {
                d.value.forEach(item => {
                    categorySet.add(item.category);
                });
            });
        }
        return [...categorySet].sort();
    }, [data]);

    // Initialize color queue
    useMemo(() => {
        if (uniqueCategories.length === 0) {
            colorQueue.current = null;
        } else if (colorQueue.current == null) {
            colorQueue.current = uniqueCategories
                .filter((_, i) => i < colors.length)
                .map((_, i) => ({ traceIndex: i, colorIndex: i }));
            setVisibleCategories(new Set(colorQueue.current.map(item => item.traceIndex)));
        }
    }, [uniqueCategories]);

    // Get category color
    const getCategoryColor = useCallback((categoryIndex: number) => {
        if (colorQueue.current == null) return gray;
        const entry = colorQueue.current.find(item => item.traceIndex === categoryIndex);
        if (entry && visibleCategories.has(categoryIndex)) {
            return colors[entry.colorIndex];
        }
        return gray;
    }, [visibleCategories]);

    // Handle legend click
    const handleLegendClick = useCallback((categoryIndex: number) => {
        if (colorQueue.current == null) return;

        const isVisible = visibleCategories.has(categoryIndex);
        const newVisibleCategories = new Set(visibleCategories);

        if (!isVisible) {
            if (colorQueue.current.length === colors.length) {
                const { traceIndex: removedTraceIndex } = colorQueue.current.splice(0, 1)[0];
                const colorIndex = colorQueue.current[colorQueue.current.length - 1]?.colorIndex ?? 0;
                colorQueue.current.push({ traceIndex: categoryIndex, colorIndex });
                newVisibleCategories.delete(removedTraceIndex);
            } else {
                const existingIndex = colorQueue.current.map(item => item.colorIndex);
                for (let i = 0; i < colors.length; i++) {
                    if (!existingIndex.includes(i)) {
                        colorQueue.current.push({ traceIndex: categoryIndex, colorIndex: i });
                        break;
                    }
                }
            }
            newVisibleCategories.add(categoryIndex);
        } else {
            const spliceIndex = colorQueue.current.findIndex(item => item.traceIndex === categoryIndex);
            if (spliceIndex !== -1) {
                colorQueue.current.splice(spliceIndex, 1);
            }
            newVisibleCategories.delete(categoryIndex);
        }

        setVisibleCategories(newVisibleCategories);
    }, [visibleCategories]);

    return {
        uniqueCategories,
        getCategoryColor,
        handleLegendClick,
    };
}
