"use client";

import { Bar } from "@visx/shape";
import { gray } from "../../../../utils/timelineUtils";
import { TimelinePlotProps, TimelineCategoricalPoint } from "@/types/chart";

export const CategoricalTimelinePlot: React.FC<TimelinePlotProps<TimelineCategoricalPoint>> = ({
  timeScale,
  valueScale,
  barWidth,
  data,
  height,
  getCategoryColor,
}) => {
  return (
    timeScale &&
    valueScale && (
      <>
        {data.map((d) => {
          const x = timeScale(d.timestamp);
          return (
            <g key={`stack-${d.timestamp}`}>
              {d.value.map((cat) => {
                const barHeight = Math.abs(valueScale(0) - valueScale(cat.count));
                const y = valueScale(cat.aggregated);
                return (
                  <Bar
                    key={`cat-${d.timestamp}-${cat.category}`}
                    x={x + barWidth * 0.05}
                    y={y}
                    width={barWidth * 0.9}
                    height={barHeight}
                    fill={getCategoryColor ? getCategoryColor(cat.category) : gray}
                  />
                );
              })}
            </g>
          );
        })}
      </>
    )
  );
};
