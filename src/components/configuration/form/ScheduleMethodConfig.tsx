'use client'

import { Button, Label, Select, TextInput, Checkbox } from "flowbite-react";
import { ScheduleMethod } from "@/types/survey";
import { millisecondsToTimeString, timeStringToMilliseconds } from "@/utils/date";
import useSurveyScheduleState from "@/hooks/configuration/useSurveyScheduleState";

interface ScheduleMethodConfigProps {
    surveyIndex: number;
    scheduleMethod: ScheduleMethod;
}

const ScheduleMethodConfig: React.FC<ScheduleMethodConfigProps> = ({ surveyIndex, scheduleMethod }) => {
    const { methodType, esmConfig, fixedTimes, setMethodType, updateEsmConfig, addFixedTime, removeFixedTime, updateFixedTime } = useSurveyScheduleState(surveyIndex, scheduleMethod);

    return (<>
        <div className="flex flex-row gap-4 items-center">
            <Label htmlFor="schedule-method-type" className="block text-sm font-medium text-gray-900">
                Schedule Method
            </Label>
            <Select
                id="schedule-method-type"
                value={methodType}
                onChange={(e) => setMethodType(e.target.value as 'none' | 'esm' | 'fixed')}
                className="w-full max-w-xs"
            >
                <option value="none">None</option>
                <option value="esm">ESM (Experience Sampling Method)</option>
                <option value="fixed">Fixed Times</option>
            </Select>
        </div>
        {methodType !== 'none' && <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            {methodType === 'esm' && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="min-interval" className="block text-sm font-medium text-gray-900 w-42">
                            Min Interval (minutes)
                        </Label>
                        <TextInput
                            id="min-interval"
                            type="number"
                            sizing="sm"
                            value={esmConfig.minInterval}
                            onChange={(e) => updateEsmConfig({ minInterval: Number(e.target.value) })}
                            className="w-full max-w-20"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="max-interval" className="block text-sm font-medium text-gray-900 w-42">
                            Max Interval (minutes)
                        </Label>
                        <TextInput
                            id="max-interval"
                            type="number"
                            sizing="sm"
                            value={esmConfig.maxInterval}
                            onChange={(e) => updateEsmConfig({ maxInterval: Number(e.target.value) })}
                            className="w-full max-w-20"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="num-survey" className="block text-sm font-medium text-gray-900 w-42">
                            Number of Surveys
                        </Label>
                        <TextInput
                            id="num-survey"
                            type="number"
                            sizing="sm"
                            value={esmConfig.numSurvey}
                            onChange={(e) => updateEsmConfig({ numSurvey: Number(e.target.value) })}
                            className="w-full max-w-20"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="num-survey" className="block text-sm font-medium text-gray-900 w-42">
                            Start of Day
                        </Label>
                        <TextInput
                            id="start-of-day"
                            type="time"
                            sizing="sm"
                            value={millisecondsToTimeString(esmConfig.startOfDay)}
                            onChange={(e) => updateEsmConfig({ startOfDay: timeStringToMilliseconds(e.target.value) })}
                            className="w-full max-w-32"
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <Label htmlFor="end-of-day" className="block text-sm font-medium text-gray-900 w-42">
                            End of Day
                        </Label>
                        <TextInput
                            id="end-of-day"
                            type="time"
                            sizing="sm"
                            value={millisecondsToTimeString(esmConfig.endOfDay)}
                            onChange={(e) => updateEsmConfig({ endOfDay: timeStringToMilliseconds(e.target.value) })}
                            className="w-full max-w-32"
                        />
                        {esmConfig.endOfDay >= 86400 * 1000 && <span className="text-blue-500 text-sm">Next Day</span>}
                    </div>
                </div>
            )}

            {methodType === 'fixed' && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4 items-center">
                        <Label className="block font-medium text-gray-900">
                            Times of Day
                        </Label>
                    </div>
                    <div className="flex flex-col gap-2">
                        {fixedTimes.map((time, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <Label htmlFor={`fixed-time-${index}`} className="block text-sm text-gray-800">Next Day</Label>
                                <Checkbox
                                    id={`fixed-time-${index}`}
                                    checked={time >= 86400 * 1000}
                                    onChange={() => updateFixedTime(index, time + (time >= 86400 * 1000 ? - 86400 * 1000 : 86400 * 1000))}
                                />
                                <TextInput
                                    type="time"
                                    sizing="sm"
                                    value={millisecondsToTimeString(time)}
                                    onChange={(e) => updateFixedTime(index, timeStringToMilliseconds(e.target.value))}
                                    className="w-42 ml-1 mr-2"
                                />
                                <span className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => removeFixedTime(index)}></span>
                            </div>
                        ))}
                        <Button
                            color="gray"
                            size="sm"
                            onClick={addFixedTime}
                            className="w-full"
                        >
                            <span className="icon-[tabler--plus] mr-2"></span> Add Time
                        </Button>
                    </div>
                </div>
            )}
        </div>}
    </>);
};

export default ScheduleMethodConfig;
