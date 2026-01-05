'use client'

import { SectionType, TimelineCategoricalValue, TimelineNumericalValue } from "@/types/chart";
import NumericalTimelineChart from "./NumericalTimelineChart";
import CategoricalTimelineChart from "./CategoricalTimelineChart";

interface TimelineChartProps {
    sectionType: SectionType;
    chartType: 'categorical' | 'numerical';
    baseTime: number;
    data: { timestamp: number[], value: (TimelineNumericalValue | TimelineCategoricalValue)[] };
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
    height
}) => {
    if (chartType === 'numerical') {
        return (
            <NumericalTimelineChart
                sectionType={sectionType}
                baseTime={baseTime}
                data={data as { timestamp: number[], value: TimelineNumericalValue[] }}
                bucketSize={bucketSize}
                width={width}
                height={height}
            />
        );
    }

    return (
        <CategoricalTimelineChart
            sectionType={sectionType}
            baseTime={baseTime}
            data={data as { timestamp: number[], value: TimelineCategoricalValue[] }}
            bucketSize={bucketSize}
        />
    );
};

export default TimelineChart;
