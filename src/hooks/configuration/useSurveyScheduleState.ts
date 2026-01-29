import { useState, useEffect } from "react";
import { ScheduleMethod, ESM } from "@/types/survey";
import useCampaignConfigEdit from "../useCampaignConfigEdit";

function useSurveyScheduleState(surveyIndex: number, initialScheduleMethod: ScheduleMethod | null) {
    const { updateSurveyScheduleMethod } = useCampaignConfigEdit();
    const [methodType, setMethodType] = useState<'none' | 'esm' | 'fixed'>(() => {
        if (!initialScheduleMethod) return 'none';
        if ('minInterval' in initialScheduleMethod) return 'esm';
        if ('timeOfDay' in initialScheduleMethod) return 'fixed';
        return 'none';
    });

    const [esmConfig, setEsmConfig] = useState<ESM>(() => {
        if (initialScheduleMethod && 'minInterval' in initialScheduleMethod && 'maxInterval' in initialScheduleMethod && 'numSurvey' in initialScheduleMethod && 'startOfDay' in initialScheduleMethod && 'endOfDay' in initialScheduleMethod) return initialScheduleMethod as ESM;
        return { minInterval: 60, maxInterval: 120, numSurvey: 5, startOfDay: 0, endOfDay: 86400 * 1000 };
    });

    const [fixedTimes, setFixedTimes] = useState<string[]>(() => {
        if (initialScheduleMethod && 'timeOfDay' in initialScheduleMethod) {
            return initialScheduleMethod.timeOfDay || [];
        }
        return [];
    });

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

    const updateEsmConfig = (updates: Partial<ESM>) => {
        const newEsmConfig = { ...esmConfig, ...updates };

        if (updates.startOfDay) {
            if (newEsmConfig.startOfDay >= newEsmConfig.endOfDay) {
                newEsmConfig.endOfDay = newEsmConfig.startOfDay + 1000
            }
        }
        if (updates.endOfDay) {
            if (newEsmConfig.startOfDay >= newEsmConfig.endOfDay) {
                newEsmConfig.startOfDay = newEsmConfig.endOfDay - 1000
            }
        }
        setEsmConfig(newEsmConfig);
    };

    useEffect(() => {
        if (methodType === 'esm') {
            updateSurveyScheduleMethod(surveyIndex, esmConfig);
        } else if (methodType === 'fixed') {
            updateSurveyScheduleMethod(surveyIndex, { timeOfDay: fixedTimes });
        } else {
            updateSurveyScheduleMethod(surveyIndex, null);
        }
    }, [methodType, esmConfig, fixedTimes, updateSurveyScheduleMethod, surveyIndex]);

    return {
        methodType,
        esmConfig,
        fixedTimes,
        setMethodType,
        updateEsmConfig,
        addFixedTime,
        removeFixedTime,
        updateFixedTime,
    };
}

export default useSurveyScheduleState;