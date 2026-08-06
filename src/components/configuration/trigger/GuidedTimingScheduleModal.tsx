'use client'

import { useMemo, useState } from "react";
import { Button, Label, Select } from "flowbite-react";
import { Modal } from "@/components/common/Modal";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import useTimingScheduleState from "@/hooks/configuration/useTimingScheduleState";
import { DeviceType } from "@/types/survey";
import { defaultAction } from "@/types/trigger";
import {
    TimingScheduleEntry,
    defaultTimingScheduleEntry,
    isTimingScheduleEntryComplete,
    nextDefaultScheduleName,
} from "@/types/timingSchedule";
import TimingScheduleEntryCard from "@/components/configuration/form/TimingScheduleEntryCard";

type ScheduleMode = "existing" | "new";

const GuidedTimingScheduleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { surveys, addTriggerWithConditionAndAction } = useCampaignConfigEdit((state) => state);
    const { entries, addEntry } = useTimingScheduleState();
    const existingValues = useMemo(() => entries.map((e) => e.value), [entries]);

    const [surveyIndex, setSurveyIndex] = useState<number | null>(surveys.length > 0 ? 0 : null);
    const [mode, setMode] = useState<ScheduleMode>(existingValues.length > 0 ? "existing" : "new");
    const [selectedExistingValue, setSelectedExistingValue] = useState(existingValues[0] ?? "");
    const [draftEntry, setDraftEntry] = useState<TimingScheduleEntry>(() =>
        defaultTimingScheduleEntry("esm", nextDefaultScheduleName(existingValues))
    );

    const draftNameTaken = mode === "new" && existingValues.includes(draftEntry.value.trim());
    const canConfirm = surveyIndex !== null && (
        mode === "existing"
            ? selectedExistingValue.length > 0
            : isTimingScheduleEntryComplete(draftEntry) && !draftNameTaken
    );

    const handleConfirm = () => {
        if (!canConfirm || surveyIndex === null) return;
        const survey = surveys[surveyIndex];
        const chosenValue = mode === "existing" ? selectedExistingValue : draftEntry.value.trim();

        if (mode === "new") addEntry({ ...draftEntry, value: chosenValue });

        const action = { ...defaultAction(survey.device_type === DeviceType.Watch ? "watch_ema" : "ema"), surveyIndex };
        addTriggerWithConditionAndAction(
            `Auto: ${survey.title || "Survey"} — ${chosenValue}`,
            { type: "detection", sensor: "timing", value: chosenValue },
            action
        );
        onClose();
    };

    return (
        <Modal title="When should this survey fire?" onClose={onClose} className="w-full max-w-lg">
            <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                    <Label htmlFor="guided-survey-select" className="text-sm font-medium text-gray-900 w-24 shrink-0">
                        Survey
                    </Label>
                    {surveys.length === 0 ? (
                        <span className="text-sm text-gray-500 italic">No surveys exist yet — add one under Active Sensing first.</span>
                    ) : (
                        <Select
                            id="guided-survey-select"
                            sizing="sm"
                            value={surveyIndex ?? ""}
                            onChange={(e) => setSurveyIndex(Number(e.target.value))}
                            className="w-full"
                        >
                            {surveys.map((s, i) => (
                                <option key={i} value={i}>{s.title || `Survey ${i + 1}`}</option>
                            ))}
                        </Select>
                    )}
                </div>

                <div className="flex flex-row gap-2">
                    <button
                        type="button"
                        onClick={() => setMode("existing")}
                        disabled={existingValues.length === 0}
                        className={`flex-1 text-sm font-semibold px-3 py-1.5 rounded-md ${mode === "existing" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                        Use Existing Schedule
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("new")}
                        className={`flex-1 text-sm font-semibold px-3 py-1.5 rounded-md ${mode === "new" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        Create New Schedule
                    </button>
                </div>

                {mode === "existing" ? (
                    existingValues.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No timing schedules exist yet — switch to &quot;Create New Schedule&quot;.</p>
                    ) : (
                        <Select
                            sizing="sm"
                            value={selectedExistingValue}
                            onChange={(e) => setSelectedExistingValue(e.target.value)}
                        >
                            {existingValues.map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </Select>
                    )
                ) : (
                    <TimingScheduleEntryCard
                        entry={draftEntry}
                        index={0}
                        onUpdate={(updates) => setDraftEntry((prev) => ({ ...prev, ...updates } as TimingScheduleEntry))}
                        onKindChange={(kind) => setDraftEntry(defaultTimingScheduleEntry(kind, draftEntry.value))}
                        onRemove={() => setDraftEntry(defaultTimingScheduleEntry("esm", nextDefaultScheduleName(existingValues)))}
                        nameError={draftNameTaken ? "A schedule with this name already exists" : undefined}
                    />
                )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                <Button color="gray" onClick={onClose}>Cancel</Button>
                <Button color="blue" disabled={!canConfirm} onClick={handleConfirm}>Confirm</Button>
            </div>
        </Modal>
    );
};

export default GuidedTimingScheduleModal;
