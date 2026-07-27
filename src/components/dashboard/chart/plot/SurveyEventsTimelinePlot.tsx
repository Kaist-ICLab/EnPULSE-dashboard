'use client'

import { TimelinePlotProps, TimelineSurveyEventPoint } from "@/types/chart";
import { useMemo } from "react";

export const SurveyEventsTimelinePlot: React.FC<TimelinePlotProps<TimelineSurveyEventPoint> & {
    getColor: (point: TimelineSurveyEventPoint) => { color: string, opacity: number }[];
}> = ({
    timeScale,
    data,
    height,
    getColor,
}) => {
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

        const rowOf = useMemo(() => {
            const m = new Map<number, number>();
            questionIds.forEach((qid, i) => m.set(qid, i));
            return m;
        }, [questionIds]);

        const rowCount = Math.max(1, questionIds.length);
        const rowHeight = height / rowCount;
        const markHeight = Math.min(rowHeight * 0.6, 24);

        return (
            <>
                {/* Faint row dividers so the user can see where each question's track is */}
                {questionIds.map((qid, i) => (
                    <line
                        key={`divider-${qid}`}
                        x1={timeScale.range()[0]}
                        y1={i * rowHeight}
                        x2={timeScale.range()[1]}
                        y2={i * rowHeight}
                        stroke="#F3F4F6"
                        strokeWidth={1}
                    />
                ))}
                {data.map((d, i) => {
                    const x = timeScale(d.timestamp);
                    if (x === undefined || isNaN(x)) return null;
                    const row = rowOf.get(d.questionId) ?? 0;
                    const cy = row * rowHeight + rowHeight / 2;
                    const { color, opacity } = getColor(d)[0];
                    return (
                        <line
                            key={`survey-event-${i}`}
                            x1={x}
                            y1={cy - markHeight / 2}
                            x2={x}
                            y2={cy + markHeight / 2}
                            stroke={color}
                            strokeOpacity={opacity}
                            strokeWidth={2}
                        />
                    );
                })}
            </>
        );
    };
