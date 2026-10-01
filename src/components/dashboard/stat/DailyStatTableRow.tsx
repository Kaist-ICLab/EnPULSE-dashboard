import { Tooltip } from "flowbite-react";
import DailyStatTableCell from "./DailyStatTableCell";
import React from "react";
import { DailyStatColumn } from "@/hooks/chart/useUserDailyStat";
import { UserDailyStatData } from "@/types/dashboard";

const getLevelColor = (level: number, max: number): string => {
  const levels = ["bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500"];

  return levels[Math.max(0, Math.min(4, Math.floor((level / max) * 5)))];
};

const Timeline: React.FC<{ values: number[]; max: number }> = ({ values, max }) => {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {values.map((level, i) =>
        level > 0 ? (
          <Tooltip key={i} content={`${level}`} trigger="hover">
            <div className={`h-6 w-2 ${getLevelColor(level, max)}`} />
          </Tooltip>
        ) : (
          <div key={i} className="h-6 w-2 bg-gray-100" />
        ),
      )}
    </div>
  );
};

const DailyCount: React.FC<{
  value: number;
  max: number;
}> = ({ value, max }) => {
  // max is 0 when the whole column has no data. 0 / 0 would give a "NaN%" width,
  // which the browser ignores, leaving the bar from the previous view on screen.
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const displayValue =
    value >= 1_000_000
      ? `${(value / 1_000_000).toFixed(1)}M`
      : value >= 1_000
        ? `${Math.round(value / 1_000)}K`
        : `${value}`;

  return (
    <div className="flex h-6 items-center gap-1">
      <div className="relative h-1 w-20 rounded-full bg-blue-100">
        <div className={`absolute top-0 left-0 h-full rounded-full bg-blue-500`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-medium text-gray-900">{displayValue}</span>
    </div>
  );
};

const DailyStatTableRow: React.FC<{
  row: DailyStatColumn;
  data: UserDailyStatData[];
  maxDailyCount: Map<string, number>;
  maxSlotCount: Map<string, number>;
  displayMode: "count" | "timeline";
}> = ({ row, data, maxDailyCount, maxSlotCount, displayMode }) => {
  const key = `${row.kind}-${row.id}`;
  const max = (displayMode === "count" ? maxDailyCount : maxSlotCount).get(key) ?? 0;

  return (
    <tr className="border-b border-l border-gray-200 text-sm hover:bg-gray-50">
      <DailyStatTableCell className="text-left">
        <span className="block truncate font-medium text-gray-900" title={row.name}>
          {row.name}
        </span>
      </DailyStatTableCell>
      {data.map((participant) => {
        const entry =
          row.kind === "sensor"
            ? participant.tables.find((t) => t.table_id === row.id)
            : participant.surveys.find((s) => s.survey_id === row.id);
        const totalCount = entry?.totalCount ?? 0;
        const counts = entry?.counts ?? [];

        return (
          <DailyStatTableCell key={`${key}-${participant.uuid}`}>
            {displayMode === "count" ? (
              <Tooltip content={`${totalCount}${max ? ` / ${max}` : ""}`}>
                <DailyCount value={totalCount} max={max} />
              </Tooltip>
            ) : (
              <Timeline values={counts} max={max} />
            )}
          </DailyStatTableCell>
        );
      })}
    </tr>
  );
};

export default DailyStatTableRow;
