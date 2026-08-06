'use client'

import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import IconButton from "@/components/common/IconButton";
import SwitchingTextInput from "@/components/common/SwitchingTextInput";
import {
    TIMING_SCHEDULE_KIND_LABEL,
    TimingScheduleEntry,
    TimingScheduleEntryFieldUpdate,
    TimingScheduleFixed,
    TimingScheduleKind,
} from "@/types/timingSchedule";
import {
    millisecondsToMinutes,
    millisecondsToTimeString,
    minutesToMilliseconds,
    timeStringToMilliseconds,
} from "@/utils/date";

interface TimingScheduleEntryCardProps {
    entry: TimingScheduleEntry;
    index: number;
    onUpdate: (updates: TimingScheduleEntryFieldUpdate) => void;
    onKindChange: (kind: TimingScheduleKind) => void;
    onRemove: () => void;
    nameError?: string;
}

const TimingScheduleEntryCard: React.FC<TimingScheduleEntryCardProps> = ({ entry, index, onUpdate, onKindChange, onRemove, nameError }) => {
    return (
        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-row items-center gap-2">
                <IconButton
                    onClick={onRemove}
                    hoverColor="red"
                    size="lg"
                    className="icon-[humbleicons--times]"
                />
                <SwitchingTextInput
                    id={`timing-schedule-name-${index}`}
                    value={entry.value}
                    onChange={(value) => onUpdate({ value })}
                    className="font-semibold max-w-xs"
                />
                <Select
                    id={`timing-schedule-kind-${index}`}
                    sizing="sm"
                    value={entry.kind}
                    onChange={(e) => onKindChange(e.target.value as TimingScheduleKind)}
                    className="w-full max-w-xs"
                >
                    {(Object.keys(TIMING_SCHEDULE_KIND_LABEL) as TimingScheduleKind[]).map((kind) => (
                        <option key={kind} value={kind}>{TIMING_SCHEDULE_KIND_LABEL[kind]}</option>
                    ))}
                </Select>
            </div>
            {nameError && <p className="text-sm text-red-600">{nameError}</p>}

            {entry.kind === "esm" && (
                <div className="flex flex-col gap-4 pl-2">
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor={`min-interval-${index}`} className="block text-sm font-medium text-gray-900 w-42">
                            Min Interval (minutes)
                        </Label>
                        <TextInput
                            id={`min-interval-${index}`}
                            type="number"
                            sizing="sm"
                            value={millisecondsToMinutes(entry.minInterval)}
                            onChange={(e) => onUpdate({ minInterval: minutesToMilliseconds(Number(e.target.value)) })}
                            className="w-full max-w-20"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor={`max-interval-${index}`} className="block text-sm font-medium text-gray-900 w-42">
                            Max Interval (minutes)
                        </Label>
                        <TextInput
                            id={`max-interval-${index}`}
                            type="number"
                            sizing="sm"
                            value={millisecondsToMinutes(entry.maxInterval)}
                            onChange={(e) => onUpdate({ maxInterval: minutesToMilliseconds(Number(e.target.value)) })}
                            className="w-full max-w-20"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor={`num-survey-${index}`} className="block text-sm font-medium text-gray-900 w-42">
                            Number of Surveys
                        </Label>
                        <TextInput
                            id={`num-survey-${index}`}
                            type="number"
                            sizing="sm"
                            value={entry.numSurvey}
                            onChange={(e) => onUpdate({ numSurvey: Number(e.target.value) })}
                            className="w-full max-w-20"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor={`start-of-day-${index}`} className="block text-sm font-medium text-gray-900 w-42">
                            Start of Day
                        </Label>
                        <TextInput
                            id={`start-of-day-${index}`}
                            type="time"
                            sizing="sm"
                            value={millisecondsToTimeString(entry.startOfDay)}
                            onChange={(e) => onUpdate({ startOfDay: timeStringToMilliseconds(e.target.value) })}
                            className="w-full max-w-32"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor={`end-of-day-${index}`} className="block text-sm font-medium text-gray-900 w-42">
                            End of Day
                        </Label>
                        <TextInput
                            id={`end-of-day-${index}`}
                            type="time"
                            sizing="sm"
                            value={millisecondsToTimeString(entry.endOfDay)}
                            onChange={(e) => onUpdate({ endOfDay: timeStringToMilliseconds(e.target.value) })}
                            className="w-full max-w-32"
                        />
                        {entry.endOfDay >= 86400 * 1000 && <span className="text-blue-500 text-sm">Next Day</span>}
                    </div>
                </div>
            )}

            {entry.kind === "fixed" && (
                <FixedTimesEditor entry={entry} onUpdate={onUpdate} index={index} />
            )}

            {entry.kind === "manual" && (
                <p className="text-sm text-gray-500 italic pl-2">
                    No automatic firing — a trigger referencing this schedule will never gate on it unless fired some other way.
                </p>
            )}
        </div>
    );
};

const FixedTimesEditor: React.FC<{
    entry: TimingScheduleFixed;
    index: number;
    onUpdate: (updates: TimingScheduleEntryFieldUpdate) => void;
}> = ({ entry, index, onUpdate }) => {
    const times = entry.timeOfDay;

    const addTime = () => onUpdate({ timeOfDay: [...times, 9 * 3600 * 1000] });
    const removeTime = (i: number) => onUpdate({ timeOfDay: times.filter((_, j) => j !== i) });
    const updateTime = (i: number, time: number) => onUpdate({ timeOfDay: times.map((t, j) => (j === i ? time : t)) });

    return (
        <div className="flex flex-col gap-2 pl-2">
            <Label className="block font-medium text-gray-900">Times of Day</Label>
            {times.map((time, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <Label htmlFor={`fixed-time-${index}-${i}`} className="block text-sm text-gray-800">Next Day</Label>
                    <Checkbox
                        id={`fixed-time-${index}-${i}`}
                        checked={time >= 86400 * 1000}
                        onChange={() => updateTime(i, time + (time >= 86400 * 1000 ? -86400 * 1000 : 86400 * 1000))}
                    />
                    <TextInput
                        type="time"
                        sizing="sm"
                        value={millisecondsToTimeString(time)}
                        onChange={(e) => updateTime(i, timeStringToMilliseconds(e.target.value))}
                        className="w-42 ml-1 mr-2"
                    />
                    <span className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => removeTime(i)}></span>
                </div>
            ))}
            <Button color="gray" size="sm" onClick={addTime} className="w-full">
                <span className="icon-[tabler--plus] mr-2"></span> Add Time
            </Button>
        </div>
    );
};

export default TimingScheduleEntryCard;
