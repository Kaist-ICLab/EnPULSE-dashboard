"use client"
import useUserDailyStat, { UserDailyStat } from "@/hooks/useUserDailyStat";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import Loading from "@/components/Loading";

const getLevelColor = (level: number): string => {
    const levels = [
        "bg-blue-100",
        "bg-blue-200",
        "bg-blue-300",
        "bg-blue-400",
        "bg-blue-500",
    ];
    return levels[Math.max(0, Math.min(4, level))]; // 0~4 범위 고정
}

const Timeline: React.FC<{ values: number[] }> = ({ values }) => {
    if (values.length !== 8) {
        throw new Error(`Timeline length must be 8. Received: ${values.length}`);
    }

    return (
        <div className="flex gap-0.5 justify-center items-center">
            {values.map((level, i) => (
                <div
                    key={i}
                    className={`w-3 h-[30px] ${getLevelColor(level)}`}
                />
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
                    style={{ width: `${percentage}%` }}/>
            </div>
            <span className="text-sm font-medium text-gray-900">
                {displayValue}
            </span>
        </div>
    );
}



const cellStyle = "p-2 border-r border-gray-200"
const rowStyle = "border-b border-l border-gray-200"

const UserRow: React.FC<{
    row: UserDailyStat;
    // columns: string[];
}> = ({ row }) => {
    return (
        <tr className="border-b hover:bg-gray-50 border-gray-200 border-l text-sm">
            <td className={cellStyle}>
                <input type="checkbox" />
            </td>
            <td className={cellStyle}>{row.email}</td>
            <td className={cellStyle}>{row.contacts} Contacts</td>
            {Object.entries(row.columns).map(([key, metric]) => (
                [<td key={`${key}-dailycount`} className={cellStyle}>
                    <DailyCount value={metric.dailyCount} max={1000} />
                </td>,
                <td key={`${key}-timeline`} className={cellStyle}>
                    <Timeline values={metric.timeline} />
                </td>]
            ))}
        </tr>
    );
}

const UserDailyStatTable: React.FC = () => {
    const { data, columns, loading } = useUserDailyStat();
    const n_row = 5;
    const current_page = 1;

    useEffect(() => {
        console.log(columns);
    }, [data, columns])

    return (
        <div className="bg-white rounded-xl shadow-md p-3 w-full overflow-hidden flex flex-col items-center justify-center">
            {loading ?
                <Loading /> : <>
                    <div className="flex items-center justify-between px-2 py-3 w-full">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-semibold">Daily Overview</h2>
                            <input type="date" className="border border-gray-200 bg-gray-50 text-gray-500 rounded px-4 py-3 text-sm" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-3 py-2 flex flex-row gap-1 text-base font-medium">
                                <Icon className="w-5 h-5" icon="material-symbols:send" />
                                <span>Send</span>
                            </button>
                            <button className="text-gray-500">
                                <Icon className="w-9 h-9" icon="mingcute:question-fill" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="table-fixed w-fit">
                            <colgroup>
                                <col className="w-[60px]" />
                                <col className="w-[200px]" />
                                <col className="w-[200px]" />
                                {columns.map((key) => ([
                                    <col key={`${key}-col-dailycount`} className="w-[160px]" />,
                                    <col key={`${key}-col-timeline`} className="w-[160px]" />
                                ]))}
                            </colgroup>
                            <thead className="uppercase text-gray-500 border-t border-gray-200 bg-gray-50 text-xs">
                                <tr className={[rowStyle, 'h-[25px]'].join(' ')}>
                                    <th className={[cellStyle, 'text-left'].join(' ')} rowSpan={2}>
                                        <input type="checkbox" disabled />
                                    </th>
                                    <th className={[cellStyle, 'text-left'].join(' ')} rowSpan={2}>Email / UID</th>
                                    <th className={[cellStyle, 'text-left'].join(' ')} rowSpan={2}>Contacts</th>
                                    {columns.map((key) => (
                                        <th key={`${key}-th`} className={['py-0', cellStyle, 'text-center'].join(' ')} colSpan={2}>{key.replace(/_/g, " ")}</th>
                                    ))}
                                </tr>
                                <tr className={[rowStyle, 'h-[25px]'].join(' ')}>
                                    {columns.map((key) => ([
                                        <th key={`${key}-th-dailycount`} className={['py-0', cellStyle, 'text-center'].join(' ')}>DAILY COUNT</th>,
                                        <th key={`${key}-th-timeline`} className={['py-0', cellStyle, 'text-center'].join(' ')}>DAILY TIMELINE</th>
                                    ]))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row) => (
                                    <UserRow key={`row-${row.id}`} row={row} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between px-2 py-3 w-full">
                        <div className="flex items-center gap-4">
                            <span>Rows per page:</span>
                            <button className="flex items-center">
                                {n_row}
                                <Icon className="w-9 h-9" icon="material-symbols-light:arrow-drop-down" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-400">
                                <Icon className="w-9 h-9" icon="si:chevron-left-fill" />
                            </button>
                            <span className="text-base text-gray-900">Page {current_page} of many</span>
                            <button className="text-gray-700">
                                <Icon className="w-9 h-9" icon="material-symbols:chevron-right-rounded" />
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default UserDailyStatTable