"use client"
import { useDailyStatTableCheckedState } from "@/hooks/chart/useDailyStatTableCheckedState";
import useUserDailyStat, { DailyStatColumn } from "@/hooks/chart/useUserDailyStat";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { flattenSurveyQuestions } from "@/services/chartService";
import { ComparisonType } from "@/types/dashboard";
import { Button, Checkbox, Select, Spinner, Tooltip } from "flowbite-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DailyStatTableHeader from "./DailyStatTableHeader";
import DailyStatTableRow from "./DailyStatTableRow";
import SensorDropdown from "../SensorDropdown";

const ChartTooltipContent: React.FC = () => {
    return (
        <>
            <p>Daily count: # of data collected in a day. </p>
            <p className="mb-1">Timeline: # of data collected in a 3 hour window.</p>
            <p>Hover over the components to see the details!</p>
        </>
    )
}

type DisplayMode = 'count' | 'timeline';

const DisplayModeToggle: React.FC<{
    mode: DisplayMode;
    setMode: (mode: DisplayMode) => void;
}> = ({ mode, setMode }) => {
    return (
        <div className="flex items-center rounded-lg border border-gray-300 p-1 text-sm font-medium mr-auto">
            <button
                className={`px-3 py-1.5 rounded-md cursor-pointer ${mode === 'count' ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setMode('count')}
            >
                Daily Count
            </button>
            <button
                className={`px-3 py-1.5 rounded-md cursor-pointer ${mode === 'timeline' ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setMode('timeline')}
            >
                Timeline
            </button>
        </div>
    )
}

const DailyOverviewTable: React.FC = () => {
    const { campaign, campaignParticipants, campaignTables } = useCampaignStore((state) => state);
    const { updateComparisonParams, updateSelectedSection } = useSectionParamStore((state) => state);

    const { data, loading, maxDailyCount, columns, page, rowsPerPage, totalPage, setPage, setRowsPerPage } = useUserDailyStat(5);
    const { checkCount, isAllChecked, toggleChecked, checkedState, toggleAllChecked } = useDailyStatTableCheckedState(data);
    const [displayMode, setDisplayMode] = useState<DisplayMode>('count');

    const flatQuestions = useMemo(() => flattenSurveyQuestions(campaign?.survey ?? []), [campaign?.survey]);
    const allFieldIds = useMemo(() => Array.from(campaignTables.values()).flatMap(t => t.campaign_table_field.map(f => f.id)), [campaignTables]);
    const allQuestionIds = useMemo(() => Array.from(flatQuestions.keys()), [flatQuestions]);

    const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>(allFieldIds);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(allQuestionIds);
    const knownFieldIds = useRef(new Set(allFieldIds));
    const knownQuestionIds = useRef(new Set(allQuestionIds));

    useEffect(() => {
        const availableSet = new Set(allFieldIds);
        const newlyAvailable = allFieldIds.filter(id => !knownFieldIds.current.has(id));
        const stillKnown = knownFieldIds.current.size === availableSet.size && newlyAvailable.length === 0
            && Array.from(knownFieldIds.current).every(id => availableSet.has(id));
        if (stillKnown) return;

        knownFieldIds.current = availableSet;
        setSelectedFieldIds((prev) => [...prev.filter(id => availableSet.has(id)), ...newlyAvailable]);
    }, [allFieldIds]);

    useEffect(() => {
        const availableSet = new Set(allQuestionIds);
        const newlyAvailable = allQuestionIds.filter(id => !knownQuestionIds.current.has(id));
        const stillKnown = knownQuestionIds.current.size === availableSet.size && newlyAvailable.length === 0
            && Array.from(knownQuestionIds.current).every(id => availableSet.has(id));
        if (stillKnown) return;

        knownQuestionIds.current = availableSet;
        setSelectedQuestionIds((prev) => [...prev.filter(id => availableSet.has(id)), ...newlyAvailable]);
    }, [allQuestionIds]);

    const isRowVisible = useCallback((row: DailyStatColumn) => {
        if (row.kind === 'sensor') {
            const fieldIds = campaignTables.get(row.id)?.campaign_table_field.map(f => f.id) ?? [];
            return fieldIds.some(id => selectedFieldIds.includes(id));
        } else {
            return Array.from(flatQuestions.values()).some(q => q.survey_id === row.id && selectedQuestionIds.includes(q.id));
        }
    }, [selectedFieldIds, selectedQuestionIds, campaignTables, flatQuestions]);

    const visibleRows = useMemo(() => columns.filter(isRowVisible), [columns, isRowVisible]);

    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-full">
            <div className="flex items-center justify-between w-full ">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Daily Overview</h2>
                    <Tooltip content={<ChartTooltipContent />} trigger="hover">
                        <button className="text-gray-500 h-6">
                            <span className="mt-2 w-6 h-6 icon-[mingcute--question-fill]"></span>
                        </button>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-3">
                    <DisplayModeToggle mode={displayMode} setMode={setDisplayMode} />
                    <SensorDropdown
                        selectedFieldIds={selectedFieldIds}
                        selectedQuestionIds={selectedQuestionIds}
                        setSelectedFieldIds={setSelectedFieldIds}
                        setSelectedQuestionIds={setSelectedQuestionIds}
                        isMultipleSelection
                        showSelectAllSensors
                    />
                </div>
            </div>
            {
                checkCount == 1 ? (
                    <div className="flex flex-row items-center justify-between bg-blue-100 text-gray-700 p-2 my-4 rounded-lg">
                        {checkCount == 1 ? "Participant" : `${checkCount} Participants`} selected
                        <Link href={`./dashboard/#timeline-overview-comparison-chart`}>
                            <Button
                                color="blue" size="2xs" className="flex flex-row gap-1 text-base px-2.5 py-1"
                                onClick={() => {
                                    updateComparisonParams(ComparisonType.Sensors, { uuid: [data[checkedState.findIndex((state) => state)].uuid] })
                                    updateSelectedSection(ComparisonType.Sensors)
                                }}
                            >
                                <span className="text-sm">Timeline Overview</span>
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-row items-center justify-between text-gray-700 bg-gray-100 p-2 mt-2 mb-4 rounded-lg h-11">
                        No participant selected
                    </div>
                )
            }
            <div className="overflow-auto w-full relative">
                {loading && <div className="absolute w-full h-full flex justify-center items-center bg-white/50 backdrop-blur-sm rounded-lg" >
                    <Spinner size="xl" />
                </div>}
                {data.length === 0 ? (
                    <div className="flex h-48 justify-center items-center bg-gray-100">
                        <span className="text-gray-500">No data</span>
                    </div>
                ) : visibleRows.length === 0 ? (
                    <div className="flex flex-col h-48 gap-2 justify-center items-center bg-gray-100">
                        <span className="text-gray-500 font-medium">Select at least one sensor to view data</span>
                    </div>
                ) : (
                    <table className="table-fixed w-full max-w-fit">
                        <colgroup>
                            <col className="w-40" />
                            {data.map((row) => (
                                <col key={`${row.uuid}-col`} className="w-32" />
                            ))}
                        </colgroup>
                        <thead className="uppercase text-gray-500 border-t border-gray-200 bg-gray-50 text-sm">
                            <tr className="border-b border-l border-gray-200 h-7.5">
                                <DailyStatTableHeader className="text-left">
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={isAllChecked} onChange={toggleAllChecked} />
                                        <span>PID</span>
                                    </div>
                                </DailyStatTableHeader>
                                {data.map((row, index) => (
                                    <DailyStatTableHeader key={`${row.uuid}-th`} className="text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Checkbox checked={checkedState[index]} onChange={() => toggleChecked(index)} />
                                            <span>P{campaignParticipants.get(row.uuid)?.pid ?? 0}</span>
                                        </div>
                                    </DailyStatTableHeader>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map((row) => (
                                <DailyStatTableRow
                                    key={`row-${row.kind}-${row.id}`}
                                    row={row}
                                    data={data}
                                    maxValue={maxDailyCount}
                                    displayMode={displayMode}
                                />
                            ))}
                        </tbody>
                    </table>
                )}


            </div>
            <div className="flex items-center justify-between py-3 w-full">
                <div className="flex items-center gap-4">
                    <span>Participants per page:</span>
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
