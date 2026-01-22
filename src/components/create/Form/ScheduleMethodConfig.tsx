'use client'

import { Button, Label, Select, TextInput } from "flowbite-react";
import { ScheduleMethod, ESM } from "@/types/survey";
import { useState, useEffect, useRef } from "react";

interface ScheduleMethodConfigProps {
    scheduleMethod: ScheduleMethod;
    onScheduleMethodChange: (scheduleMethod: ScheduleMethod) => void;
}

const ScheduleMethodConfig: React.FC<ScheduleMethodConfigProps> = ({ scheduleMethod, onScheduleMethodChange }) => {
    const [methodType, setMethodType] = useState<'none' | 'esm' | 'fixed'>(() => {
        if (!scheduleMethod) return 'none';
        if ('minInterval' in scheduleMethod) return 'esm';
        if ('timeOfDay' in scheduleMethod) return 'fixed';
        return 'none';
    });

    const [esmConfig, setEsmConfig] = useState<ESM>(() => {
        if (scheduleMethod && 'minInterval' in scheduleMethod) {
            return scheduleMethod;
        }
        return { minInterval: 60, maxInterval: 120, numSurvey: 5 };
    });

    const [fixedTimes, setFixedTimes] = useState<string[]>(() => {
        if (scheduleMethod && 'timeOfDay' in scheduleMethod) {
            return scheduleMethod.timeOfDay || [];
        }
        return [];
    });

    const onScheduleMethodChangeRef = useRef(onScheduleMethodChange);
    const prevMethodTypeRef = useRef(methodType);
    const prevEsmConfigRef = useRef(esmConfig);
    const prevFixedTimesRef = useRef(fixedTimes);

    // Update ref when callback changes
    useEffect(() => {
        onScheduleMethodChangeRef.current = onScheduleMethodChange;
    }, [onScheduleMethodChange]);

    useEffect(() => {
        const methodTypeChanged = prevMethodTypeRef.current !== methodType;
        const esmConfigChanged = JSON.stringify(prevEsmConfigRef.current) !== JSON.stringify(esmConfig);
        const fixedTimesChanged = JSON.stringify(prevFixedTimesRef.current) !== JSON.stringify(fixedTimes);

        if (methodTypeChanged || esmConfigChanged || fixedTimesChanged) {
            let newScheduleMethod: ScheduleMethod = null;

            if (methodType === 'esm') {
                newScheduleMethod = esmConfig;
            } else if (methodType === 'fixed') {
                newScheduleMethod = { timeOfDay: fixedTimes };
            }

            // Only call if the value actually changed
            const currentScheduleMethod = scheduleMethod;
            const scheduleMethodChanged = JSON.stringify(currentScheduleMethod) !== JSON.stringify(newScheduleMethod);

            if (scheduleMethodChanged) {
                onScheduleMethodChangeRef.current(newScheduleMethod);
            }

            prevMethodTypeRef.current = methodType;
            prevEsmConfigRef.current = esmConfig;
            prevFixedTimesRef.current = fixedTimes;
        }
    }, [methodType, esmConfig, fixedTimes, scheduleMethod]);

    const addFixedTime = () => {
        setFixedTimes([...fixedTimes, '09:00']);
    };

    const removeFixedTime = (index: number) => {
        setFixedTimes(fixedTimes.filter((_, i) => i !== index));
    };

    const updateFixedTime = (index: number, time: string) => {
        const newTimes = [...fixedTimes];
        newTimes[index] = time;
        setFixedTimes(newTimes);
    };

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
                            onChange={(e) => setEsmConfig({ ...esmConfig, minInterval: Number(e.target.value) })}
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
                            onChange={(e) => setEsmConfig({ ...esmConfig, maxInterval: Number(e.target.value) })}
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
                            onChange={(e) => setEsmConfig({ ...esmConfig, numSurvey: Number(e.target.value) })}
                            className="w-full max-w-20"
                        />
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
                                <TextInput
                                    type="time"
                                    sizing="sm"
                                    value={time}
                                    onChange={(e) => updateFixedTime(index, e.target.value)}
                                    className="w-42"
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
