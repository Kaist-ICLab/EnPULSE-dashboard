import { Checkbox, Tooltip } from "flowbite-react";
import DailyStatTableCell from "./DailyStatTableCell";
import React from "react";

const getLevelColor = (level: number, max: number): string => {
    const levels = [
        "bg-blue-100",
        "bg-blue-200",
        "bg-blue-300",
        "bg-blue-400",
        "bg-blue-500",
    ];

    return levels[Math.max(0, Math.min(4, Math.floor(level / max * 5)))];
}

// TODO: Tooltip is very laggy when there are many of them... how to optimize?
const Timeline: React.FC<{ values: number[], max: number }> = ({ values, max }) => {
    return (
        <div className="flex gap-0.5 justify-center items-center">
            {values.map((level, i) => (
                level > 0 ? (
                    <Tooltip key={i} content={`${level}`} trigger="hover">
                        <div
                            className={`w-[9px] h-[30px] ${getLevelColor(level, max)}`}
                        />
                    </Tooltip>
                ) : (<div key={i} className="w-[9px] h-[30px] bg-gray-100" />)
            ))}
        </div>
    );
}

const DailyCount: React.FC<{
    value: number;
    max: number;
}> = ({ value, max }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const displayValue =
        value >= 1_000_000
            ? `${(value / 1_000_000).toFixed(1)}M`
            : value >= 1_000
                ? `${Math.round(value / 1_000)}K`
                : `${value}`;

    return (
        <div className="flex items-center gap-1">
            <div className="relative h-1 w-22 bg-blue-100 rounded-full ">
                <div className={`absolute left-0 top-0 h-full bg-blue-500 rounded-full`}
                    style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-sm font-medium text-gray-900">
                {displayValue}
            </span>
        </div>
    );
}

const DailyStatTableRow: React.FC<{
    pid: number;
    contacts: number;
    tables: { table_id: number, totalCount: number, counts: number[] }[];
    maxValue: Map<number, number>;
    isSelected: boolean;
    toggleChecked: () => void;
}> = ({ pid, contacts, tables, maxValue, isSelected = false, toggleChecked }) => {
    return (
        <tr className={`border-b border-gray-200 border-l text-sm ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`} onClick={toggleChecked}>
            <DailyStatTableCell>
                <Checkbox checked={isSelected} onChange={toggleChecked} />
            </DailyStatTableCell>
            <DailyStatTableCell>P{pid}</DailyStatTableCell>
            <DailyStatTableCell>{contacts} Contacts</DailyStatTableCell>
            {tables.map((table) => (
                [<DailyStatTableCell key={`${table.table_id}-dailycount`}>
                    <Tooltip content={`${table.totalCount} ${maxValue.get(table.table_id) ? ` / ${maxValue.get(table.table_id)}` : ''}`}>
                        <DailyCount value={table.totalCount} max={maxValue.get(table.table_id) ?? 0} />
                    </Tooltip>
                </DailyStatTableCell>,
                <DailyStatTableCell key={`${table.table_id}-timeline`}>
                    <Timeline values={table.counts} max={maxValue.get(table.table_id) ?? 0 / table.counts.length} />
                </DailyStatTableCell>]
            ))}
        </tr>
    );
}

export default React.memo(DailyStatTableRow)