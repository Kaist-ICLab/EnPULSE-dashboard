import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { colors, gray } from "@/components/dashboard/charts/shared/timelineUtils";
import { TimelineCategoricalPoint } from "@/types/chart";

export function useCategoricalChartLegend(data: TimelineCategoricalPoint[]) {
    const colorQueue = useRef<{ category: string, colorIndex: number }[] | null>(null);
    const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());

    const uniqueCategories = useMemo(() => {
        // Extract all unique categories from all data points
        const categorySet = new Set<string>();

        if (data.length === 0) return [];

        data.forEach(d => {
            d.value.forEach(item => {
                categorySet.add(item.category);
            });
        });

        return [...categorySet].sort();
    }, [data]);

    // Initialize color queue
    useEffect(() => {
        if (uniqueCategories.length === 0) {
            colorQueue.current = null;
        } else if (colorQueue.current == null) {
            colorQueue.current = uniqueCategories
                .filter((_, i) => i < colors.length)
                .map((category, i) => ({ category, colorIndex: i }));
            setVisibleCategories(new Set(colorQueue.current.map(item => item.category)));
        }
    }, [uniqueCategories]);

    // Get category color
    const getCategoryColor = useCallback((category: string) => {
        if (colorQueue.current == null) return gray;
        const entry = colorQueue.current.find(item => item.category === category);
        if (entry) {
            return colors[entry.colorIndex];
        }
        return gray;
    }, []);

    // Handle legend click
    const handleLegendClick = useCallback((category: string) => {
        if (colorQueue.current == null) return;


        const isVisible = visibleCategories.has(category);
        const newVisibleCategories = new Set(visibleCategories);
        console.log('handleLegendClick', category, isVisible);

        if (!isVisible) {
            if (colorQueue.current.length === colors.length) {
                const { category: removedCategory, colorIndex: removedColorIndex } = colorQueue.current.splice(0, 1)[0];
                colorQueue.current.push({ category, colorIndex: removedColorIndex });
                newVisibleCategories.delete(removedCategory);
            } else {
                const existingIndex = colorQueue.current.map(item => item.colorIndex);
                for (let i = 0; i < colors.length; i++) {
                    if (!existingIndex.includes(i)) {
                        colorQueue.current.push({ category, colorIndex: i });
                        break;
                    }
                }
            }
            newVisibleCategories.add(category);
        } else {
            const spliceIndex = colorQueue.current.findIndex(item => item.category === category);
            if (spliceIndex !== -1) {
                colorQueue.current.splice(spliceIndex, 1);
            }
            newVisibleCategories.delete(category);
        }

        setVisibleCategories(newVisibleCategories);
    }, [visibleCategories]);

    return {
        uniqueCategories,
        getCategoryColor,
        handleLegendClick,
    };
}
