"use client"
import { useDailyStatTableCheckedState } from "@/hooks/chart/useDailyStatTableCheckedState";
import useUserDailyStat from "@/hooks/chart/useUserDailyStat";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { ComparisonType } from "@/types/dashboard";
import { Button, Checkbox, Select, Spinner, Tooltip } from "flowbite-react";
import Link from "next/link";
import React from "react";
import DailyStatTableHeader from "./DailyStatTableHeader";
import DailyStatTableRow from "./DailyStatTableRow";

const ChartTooltipContent: React.FC = () => {
    return (
        <>
            <p>Daily count: # of data collected in a day. </p>
            <p className="mb-1">Timeline: # of data collected in a 3 hour window.</p>
            <p>Hover over the components to see the details!</p>
        </>
    )
}

const DailyOverviewTable: React.FC = () => {
    const { campaignParticipants } = useCampaignStore((state) => state);
    const { updateComparisonParams, updateSelectedSection } = useSectionParamStore((state) => state);

    const { data, loading, maxDailyCount, columns, page, rowsPerPage, totalPage, setPage, setRowsPerPage } = useUserDailyStat(5);
    const { checkCount, isAllChecked, toggleChecked, checkedState, toggleAllChecked } = useDailyStatTableCheckedState(data);

    return (
        <div className="bg-white rounded-xl shadow-md p-3 w-full">
            <div className="flex items-center justify-between px-2 py-3 h-16 w-full">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Daily Overview</h2>
                </div>
                <div className="flex items-center gap-3">
                    {
                        checkCount == 1 && (
                            <Link href={`./dashboard/#timeline-overview-comparison-chart`}>
                                <Button
                                    color="blue" size="sm" className="flex flex-row gap-1 text-base px-3"
                                    onClick={() => {
                                        updateComparisonParams(ComparisonType.Sensors, { uuid: [data[checkedState.findIndex((state) => state)].uuid] })
                                        updateSelectedSection(ComparisonType.Sensors)
                                    }}
                                >
                                    <span>Timeline Overview</span>
                                </Button>
                            </Link>
                        )
                    }
                    <Tooltip content={<ChartTooltipContent />} trigger="click">
                        <button className="text-gray-500">
                            <span className="mt-1 w-6 h-6 icon-[mingcute--question-fill]"></span>
                        </button>
                    </Tooltip>

                </div>
            </div>
            <div className="overflow-auto w-full relative">
                {loading && <div className="absolute w-full h-full flex justify-center items-center bg-white/50 backdrop-blur-sm rounded-lg" >
                    <Spinner size="xl" />
                </div>}
                {data.length > 0 ? (
                    <table className="table-fixed w-full max-w-fit">
                        <colgroup>
                            <col className="w-[40px]" />
                            <col className="w-[50px]" />
                            {columns.map((col) => ([
                                <col key={`${col.kind}-${col.id}-col-dailycount`} className="w-[140px]" />,
                                <col key={`${col.kind}-${col.id}-col-timeline`} className="w-[160px]" />
                            ]))}
                        </colgroup>
                        <thead className="uppercase text-gray-500 border-t border-gray-200 bg-gray-50 text-xs">
                            <tr className="border-b border-l border-gray-200 h-[30px]">
                                <DailyStatTableHeader className="text-left" rowSpan={2}>
                                    <Checkbox checked={isAllChecked} onChange={toggleAllChecked} />
                                </DailyStatTableHeader>
                                <DailyStatTableHeader className="text-left" rowSpan={2}>PID</DailyStatTableHeader>
                                {columns.map((col) => (
                                    <DailyStatTableHeader
                                        key={`${col.kind}-${col.id}-th`}
                                        className={`py-0 text-center ${col.kind === 'survey' ? 'border-l-2 border-l-blue-200' : ''}`}
                                        colSpan={2}
                                    >
                                        {col.kind === 'survey' ? <span className="text-blue-600">{col.name}</span> : col.name}
                                    </DailyStatTableHeader>
                                ))}
                            </tr>
                            <tr className="border-b border-l border-gray-200 h-[30px]">
                                {columns.map((col) => ([
                                    <DailyStatTableHeader key={`${col.kind}-${col.id}-th-dailycount`} className="py-0 text-center">DAILY COUNT</DailyStatTableHeader>,
                                    <DailyStatTableHeader key={`${col.kind}-${col.id}-th-timeline`} className="py-0 text-center">DAILY TIMELINE</DailyStatTableHeader>
                                ]))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <DailyStatTableRow
                                    key={`row-${row.uuid}`}
                                    pid={campaignParticipants.get(row.uuid)?.pid ?? 0}
                                    contacts={row.contacts}
                                    columns={columns}
                                    tables={row.tables}
                                    surveys={row.surveys}
                                    maxValue={maxDailyCount}
                                    isSelected={checkedState[index]}
                                    toggleChecked={() => toggleChecked(index)}
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex h-48 justify-center items-center bg-gray-100">
                        <span className=" text-gray-500">No data</span>
                    </div>
                )}


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
                    <button className={`text-gray-700 disabled:text-gray-400 flex items-center enabled:cursor-pointer`} disabled={page == 1} onClick={() => setPage(page - 1)}>
                        <span className="w-6 h-6 icon-[material-symbols-light--chevron-left-rounded]"></span>
                    </button>
                    <span className="text-base text-gray-900">Page {page} of {totalPage}</span>
                    <button className="text-gray-700 disabled:text-gray-400 flex items-center enabled:cursor-pointer" disabled={page == totalPage} onClick={() => setPage(page + 1)}>
                        <span className="w-6 h-6 icon-[material-symbols-light--chevron-right-rounded]"></span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DailyOverviewTable
