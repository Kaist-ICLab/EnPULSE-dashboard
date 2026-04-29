import { DeviceType, Survey, SurveyQuestion } from "@/types/survey";
import { useCallback, useMemo, useState } from "react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";

export function useSurveyCardState(survey: Survey, surveyIndex: number) {
    const { updateSurveyDeviceType } = useCampaignConfigEdit((state) => state);
    const [pendingDeviceType, setPendingDeviceType] = useState<DeviceType | null>(null);
    const currentDeviceType = (survey.device_type ?? DeviceType.Phone) as DeviceType;

    const collectQuestionsWithTriggers = (questions: SurveyQuestion[]): SurveyQuestion[] => {
        const affected: SurveyQuestion[] = [];
        const walk = (qs: SurveyQuestion[]) => {
            for (const q of qs) {
                const triggers = q.survey_question_trigger ?? [];
                if (triggers.length > 0) affected.push(q);
                for (const trigger of triggers) {
                    walk(trigger.survey_question ?? []);
                }
            }
        };
        walk(questions);
        return affected;
    };

    const _countNestedQuestions = useCallback((questions: SurveyQuestion[]): number => {
        let count = questions.length;
        for (const q of questions) {
            for (const t of q.survey_question_trigger ?? []) {
                count += _countNestedQuestions(t.survey_question ?? []);
            }
        }

        return count;
    }, []);

    const nestedQuestionCount = useMemo(() => _countNestedQuestions(survey.survey_question ?? []), [survey.survey_question, _countNestedQuestions]);

    const affectedQuestions = pendingDeviceType === DeviceType.Watch
        ? collectQuestionsWithTriggers(survey.survey_question ?? [])
        : [];

    const handleDeviceTypeChange = (nextDeviceType: DeviceType) => {
        if (nextDeviceType === currentDeviceType) return;

        // Only Phone→Watch needs confirmation: triggers will be flattened.
        // Watch→Phone is a no-op for question types now that binary/numberscale
        // are cross-device.
        const affected = nextDeviceType === DeviceType.Watch
            ? collectQuestionsWithTriggers(survey.survey_question ?? [])
            : [];

        if (affected.length > 0) {
            setPendingDeviceType(nextDeviceType);
            return;
        }
        updateSurveyDeviceType(surveyIndex, nextDeviceType);
    };

    const confirmDeviceTypeChange = () => {
        if (pendingDeviceType === null) return;
        updateSurveyDeviceType(surveyIndex, pendingDeviceType);
        setPendingDeviceType(null);
    };

    const cancelDeviceTypeChange = () => setPendingDeviceType(null);

    return {
        pendingDeviceType,
        nestedQuestionCount,
        affectedQuestions,
        handleDeviceTypeChange,
        confirmDeviceTypeChange,
        cancelDeviceTypeChange,
    };
}