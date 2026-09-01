"use client";
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
  );
};

type DisplayMode = "count" | "timeline";

const DisplayModeToggle: React.FC<{
  mode: DisplayMode;
  setMode: (mode: DisplayMode) => void;
}> = ({ mode, setMode }) => {
  return (
    <div className="mr-auto flex items-center rounded-lg border border-gray-300 p-1 text-sm font-medium">
      <button
        className={`cursor-pointer rounded-md px-3 py-1.5 ${mode === "count" ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-700"}`}
        onClick={() => setMode("count")}
      >
        Daily Count
      </button>
      <button
        className={`cursor-pointer rounded-md px-3 py-1.5 ${mode === "timeline" ? "bg-blue-700 text-white" : "text-gray-500 hover:text-gray-700"}`}
        onClick={() => setMode("timeline")}
      >
        Timeline
      </button>
    </div>
  );
};

const DailyOverviewTable: React.FC = () => {
  const { campaign, campaignParticipants, campaignTables } = useCampaignStore((state) => state);
  const { updateComparisonParams, updateSelectedSection } = useSectionParamStore((state) => state);

  const { data, loading, maxDailyCount, columns, page, rowsPerPage, totalPage, setPage, setRowsPerPage } =
    useUserDailyStat(5);
  const { checkCount, isAllChecked, toggleChecked, checkedState, toggleAllChecked } =
    useDailyStatTableCheckedState(data);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("count");

  const flatQuestions = useMemo(() => flattenSurveyQuestions(campaign?.survey ?? []), [campaign?.survey]);
  const allFieldIds = useMemo(
    () => Array.from(campaignTables.values()).flatMap((t) => t.campaign_table_field.map((f) => f.id)),
    [campaignTables],
  );
  const allQuestionIds = useMemo(() => Array.from(flatQuestions.keys()), [flatQuestions]);

  const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>(allFieldIds);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(allQuestionIds);
  const knownFieldIds = useRef(new Set(allFieldIds));
  const knownQuestionIds = useRef(new Set(allQuestionIds));

  useEffect(() => {
    const availableSet = new Set(allFieldIds);
    const newlyAvailable = allFieldIds.filter((id) => !knownFieldIds.current.has(id));
    const stillKnown =
      knownFieldIds.current.size === availableSet.size &&
      newlyAvailable.length === 0 &&
      Array.from(knownFieldIds.current).every((id) => availableSet.has(id));
    if (stillKnown) return;

    knownFieldIds.current = availableSet;
    setSelectedFieldIds((prev) => [...prev.filter((id) => availableSet.has(id)), ...newlyAvailable]);
  }, [allFieldIds]);

  useEffect(() => {
    const availableSet = new Set(allQuestionIds);
    const newlyAvailable = allQuestionIds.filter((id) => !knownQuestionIds.current.has(id));
    const stillKnown =
      knownQuestionIds.current.size === availableSet.size &&
      newlyAvailable.length === 0 &&
      Array.from(knownQuestionIds.current).every((id) => availableSet.has(id));
    if (stillKnown) return;

    knownQuestionIds.current = availableSet;
    setSelectedQuestionIds((prev) => [...prev.filter((id) => availableSet.has(id)), ...newlyAvailable]);
  }, [allQuestionIds]);

  const isRowVisible = useCallback(
    (row: DailyStatColumn) => {
      if (row.kind === "sensor") {
        const fieldIds = campaignTables.get(row.id)?.campaign_table_field.map((f) => f.id) ?? [];
        return fieldIds.some((id) => selectedFieldIds.includes(id));
      } else {
        return Array.from(flatQuestions.values()).some(
          (q) => q.survey_id === row.id && selectedQuestionIds.includes(q.id),
        );
      }
    },
    [selectedFieldIds, selectedQuestionIds, campaignTables, flatQuestions],
  );

  const visibleRows = useMemo(() => columns.filter(isRowVisible), [columns, isRowVisible]);

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Daily Overview</h2>
          <Tooltip content={<ChartTooltipContent />} trigger="hover">
            <button className="h-6 text-gray-500">
              <span className="icon-[mingcute--question-fill] mt-2 h-6 w-6"></span>
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
          />
        </div>
      </div>
      <div
        className={`my-4 flex h-10 flex-row items-center justify-between rounded-lg px-3 text-gray-700 ${checkCount === 0 ? "bg-gray-100" : "bg-blue-100"}`}
      >
        {checkCount > 0 ? (
          <>
            {checkCount == 1 ? "Participant" : `${checkCount} Participants`} selected
            <Link href={`./dashboard/#timeline-overview-comparison-chart`}>
              <Button
                color="blue"
                size="2xs"
                className="flex flex-row gap-1 px-2.5 py-1 text-base"
                onClick={() => {
                  updateComparisonParams(ComparisonType.Sensors, {
                    uuid: [data[checkedState.findIndex((state) => state)].uuid],
                  });
                  updateSelectedSection(ComparisonType.Sensors);
                }}
              >
                <span className="text-sm">Timeline Overview</span>
              </Button>
            </Link>
          </>
        ) : (
          <span>No participant selected</span>
        )}
      </div>
      <div className="relative w-full overflow-auto">
        {loading && (
          <div className="absolute flex h-full w-full items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm">
            <Spinner size="xl" />
          </div>
        )}
        {data.length === 0 ? (
          <div className="flex h-48 items-center justify-center bg-gray-100">
            <span className="text-gray-500">No data</span>
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 bg-gray-100">
            <span className="font-medium text-gray-500">Select at least one sensor to view data</span>
          </div>
        ) : (
          <table className="w-full max-w-fit table-fixed">
            <colgroup>
              <col className="w-56" />
              {data.map((row) => (
                <col key={`${row.uuid}-col`} className="w-32" />
              ))}
            </colgroup>
            <thead className="border-t border-gray-200 bg-gray-50 text-sm text-gray-500 uppercase">
              <tr className="h-7.5 border-b border-l border-gray-200">
                <DailyStatTableHeader className="text-left">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={isAllChecked} onChange={toggleAllChecked} />
                    <span>PID</span>
                  </div>
                </DailyStatTableHeader>
                {data.map((row, index) => (
                  <DailyStatTableHeader key={`${row.uuid}-th`} className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Checkbox checked={checkedState[index] ?? false} onChange={() => toggleChecked(index)} />
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
      <div className="flex w-full items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <span>Participants per page:</span>
          <Select
            value={rowsPerPage.toString()}
            className="w-20"
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            {[5, 10, 15].map((v, i) => (
              <option key={`rows-per-page-${i}`} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`flex items-center text-gray-700 enabled:cursor-pointer disabled:text-gray-400`}
            disabled={page == 1}
            onClick={() => setPage(page - 1)}
          >
            <span className="icon-[material-symbols-light--chevron-left-rounded] h-6 w-6"></span>
          </button>
          <span className="text-base text-gray-900">
            Page {page} of {totalPage}
          </span>
          <button
            className="flex items-center text-gray-700 enabled:cursor-pointer disabled:text-gray-400"
            disabled={page == totalPage}
            onClick={() => setPage(page + 1)}
          >
            <span className="icon-[material-symbols-light--chevron-right-rounded] h-6 w-6"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyOverviewTable;
