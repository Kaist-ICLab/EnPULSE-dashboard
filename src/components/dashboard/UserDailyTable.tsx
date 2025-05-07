"use client"
import useUserDailyStat, { UserDailyStat } from "@/hooks/charts/useUserDailyStat";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Select, Spinner, Tooltip } from "flowbite-react";
import { useDailyStatTableCheckedState } from "@/hooks/charts/useDailyStatTableCheckedState";
import { usePaging } from "@/hooks/legacy/usePaging";
import useFormatConfig from "@/hooks/legacy/useFormatConfig";
import Link from "next/link";

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
                <Tooltip key={i} content={`${level}`} trigger="hover">
                    <div
                        className={`w-3 h-[30px] ${getLevelColor(level)}`}
                    />
                </Tooltip>
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



const cellStyle = "p-2 border-r border-gray-200"
const rowStyle = "border-b border-l border-gray-200"

const UserRow: React.FC<{
    row: UserDailyStat;
    max: { [key: string]: number };
    isSelected: boolean;
    toggleChecked: () => void;
}> = ({ row, max, isSelected = false, toggleChecked }) => {
    return (
        <tr className="border-b hover:bg-gray-50 border-gray-200 border-l text-sm" onClick={toggleChecked}>
            <td className={cellStyle}>
                <input type="checkbox" className="w-4 h-4" checked={isSelected} onChange={toggleChecked} />
            </td>
            <td className={cellStyle}>{row.email}</td>
            <td className={cellStyle}>{row.contacts} Contacts</td>
            {Object.entries(row.columns).map(([key, metric]) => (
                [<td key={`${key}-dailycount`} className={cellStyle}>
                    <Tooltip content={`${metric.dailyCount} / ${max[key]}`}>
                        <DailyCount value={metric.dailyCount} max={max[key]} />
                    </Tooltip>
                </td>,
                <td key={`${key}-timeline`} className={cellStyle}>
                    <Timeline values={metric.timeline} />
                </td>]
            ))}
        </tr>
    );
}

const ChartTooltipContent: React.FC = () => {
    return (
        <>
            <p>Daily count: # of data collected in a day. </p>
            <p className="mb-1">Timeline: # of data collected in a 3 hour window.</p>
            <p>Hover over the components to see the details!</p>
        </>

    )
}

const UserDailyStatTable: React.FC<{
    syncTime: Date | null,
    setUserId: (userId: string) => void;
    openMessageModal: (sendTo: string) => void;
}> = ({ syncTime, setUserId, openMessageModal }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [date, setDate] = useState(new Date())
    const [tableHeight, setTableHeight] = useState(500)

    const { page, rowsPerPage, totalPage, changePageBy, setRowsPerPage, setTotalPage } = usePaging(5)
    const { loading: configLoading, formatConfig } = useFormatConfig();
    const { data, loading: statLoading, columns, maxDailyCount } = useUserDailyStat(date, page, rowsPerPage, setTotalPage, syncTime);
    const { checkCount, isAllChecked, toggleChecked, checkedState, toggleAllChecked } = useDailyStatTableCheckedState(data);

    const loading = statLoading || configLoading;
    const dailyCountThreshold = useMemo(() => {
        const result: { [key: string]: number } = {};
        Object.entries(formatConfig).forEach(([sensorName, config]) => (
            result[sensorName] = config.thresholdMode == 'max' ? maxDailyCount[sensorName] : config.threshold
        ))
        return result;
    }, [formatConfig, maxDailyCount])

    useEffect(() => {
        if (ref.current && !loading) {
            setTableHeight(ref.current.clientHeight)
        }
    }, [ref, loading])

    return (
        <div className="bg-white rounded-xl shadow-md p-3 w-full overflow-hidden flex flex-col items-center justify-center">
            <div className="flex items-center justify-between px-2 py-3 w-full">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Daily Overview</h2>
                    <input
                        type="date"
                        className="border border-gray-200 bg-gray-50 text-gray-500 rounded px-4 py-3 text-sm"
                        value={date.toISOString().split('T')[0]}
                        onChange={(e) => { changePageBy(-page); setDate(new Date(e.target.value)) }}
                    />
                </div>
                <div className="flex items-center gap-3">
                    {
                        checkCount == 1 && (
                            <Link href={`./dashboard/#timeline-overview-comparison-chart`}>
                                <Button color="blue" size="md" className="flex flex-row gap-1 text-base px-3" onClick={() => setUserId(data[checkedState.findIndex((state) => state)].uuid)}>
                                    <span>Timeline Overview</span>
                                </Button>
                            </Link>
                        )
                    }
                    {
                        checkCount >= 1 && (
                            <Button color="blue" size="md" className="flex flex-row gap-1 text-base px-3" onClick={() => openMessageModal(data.filter((_, i) => checkedState[i]).map(v => v.email).join(', '))}>
                                <span className="w-5 h-5 mt-0.5 icon-[material-symbols--send]"></span>
                                <span>Send</span>
                            </Button>
                        )
                    }
                    <Tooltip content={<ChartTooltipContent />} trigger="click">
                        <button className="text-gray-500">
                            <span className="mt-1 w-6 h-6 icon-[mingcute--question-fill]"></span>
                        </button>
                    </Tooltip>

                </div>
            </div>
            <div className="overflow-x-auto w-full" ref={ref}>
                {loading ? (
                    <div className="flex justify-center items-center" style={{ minHeight: `${tableHeight}px` }}  >
                        <Spinner size="xl" />
                    </div>
                ) : (<table className="table-fixed w-fit" >
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
                                <input className="w-4 h-4" type="checkbox" checked={isAllChecked} onChange={toggleAllChecked} />
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
                        {data.map((row, index) => (
                            <UserRow key={`row-${row.uuid}`} row={row} max={dailyCountThreshold} isSelected={checkedState[index]} toggleChecked={() => toggleChecked(index)} />
                        ))}
                    </tbody>
                </table>)}
            </div>
            <div className="flex items-center justify-between px-2 py-3 w-full">
                <div className="flex items-center gap-4">
                    <span>Rows per page:</span>
                    <Select value={rowsPerPage.toString()} className="w-20" onChange={(e) => setRowsPerPage(parseInt(e.target.value))}>
                        {
                            [5, 10, 15].map((v, i) => (
                                <option key={`rows-per-page-${i}`} value={v}>{v}</option>
                            ))
                        }
                    </Select>
                </div>
                <div className="flex items-center gap-3">
                    <button className={`text-gray-700 disabled:text-gray-400 flex items-center enabled:cursor-pointer`} disabled={page == 1} onClick={() => changePageBy(-1)}>
                        <span className="w-6 h-6 icon-[material-symbols-light--chevron-left-rounded]"></span>
                    </button>
                    <span className="text-base text-gray-900">Page {page} of {totalPage}</span>
                    <button className="text-gray-700 disabled:text-gray-400 flex items-center enabled:cursor-pointer" disabled={page == totalPage} onClick={() => changePageBy(1)}>
                        <span className="w-6 h-6 icon-[material-symbols-light--chevron-right-rounded]"></span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDailyStatTable