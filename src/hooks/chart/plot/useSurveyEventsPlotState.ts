import { useCallback, useMemo } from "react";
import { TimelineSurveyEventPoint } from "@/types/chart";
import { colors, formatTime, gray } from "@/utils/timelineUtils";

export function useSurveyEventsPlotState(data: TimelineSurveyEventPoint[]) {
    const questionIds = useMemo(() => {
        const seen = new Set<number>();
        const ordered: number[] = [];
        for (const d of data) {
            if (!seen.has(d.questionId)) {
                seen.add(d.questionId);
                ordered.push(d.questionId);
            }
        }
        return ordered;
    }, [data]);

    const questionTitle = useMemo(() => {
        const m = new Map<number, string>();
        for (const d of data) if (!m.has(d.questionId)) m.set(d.questionId, d.questionTitle);
        return m;
    }, [data]);

    const questionColor = useCallback((questionId: number) => {
        const idx = questionIds.indexOf(questionId);
        if (idx < 0) return gray;
        return colors[idx % colors.length];
    }, [questionIds]);

    const getColor = useCallback((point: TimelineSurveyEventPoint) => {
        return [{ color: questionColor(point.questionId), opacity: 1 }];
    }, [questionColor]);

    const getTooltipData = useCallback((timeMs: number) => {
        if (data.length === 0) return null;
        let nearest: TimelineSurveyEventPoint | null = null;
        let nearestDist = Infinity;
        for (const d of data) {
            const dist = Math.abs(d.timestamp - timeMs);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = d;
            }
        }
        if (!nearest) return null;
        return [
            { label: 'Time', value: formatTime(nearest.timestamp) },
            { label: 'Question', value: nearest.questionTitle },
            { label: 'Response', value: nearest.response },
        ];
    }, [data]);

    return { questionIds, questionTitle, questionColor, getColor, getTooltipData };
}
