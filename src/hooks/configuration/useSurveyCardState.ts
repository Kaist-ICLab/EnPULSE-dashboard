import { DeviceType, Survey, SurveyQuestion } from "@/types/survey";
import { useState } from "react";
import useCampaignConfigEdit from "../useCampaignConfigEdit";

export function useSurveyCardState(survey: Survey, surveyIndex: number) {
    const { updateSurveyDeviceType } = useCampaignConfigEdit();
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

    const collectWatchOnlyAnswerTypeQuestions = (questions: SurveyQuestion[]): SurveyQuestion[] => {
        return questions.filter(q => q.answer_type === 'binary' || q.answer_type === 'numberscale');
    };

    const affectedQuestions = pendingDeviceType === DeviceType.Watch
        ? collectQuestionsWithTriggers(survey.survey_question ?? [])
        : pendingDeviceType === DeviceType.Phone
            ? collectWatchOnlyAnswerTypeQuestions(survey.survey_question ?? [])
            : [];

    const handleDeviceTypeChange = (nextDeviceType: DeviceType) => {
        if (nextDeviceType === currentDeviceType) return;

        const affected = nextDeviceType === DeviceType.Watch
            ? collectQuestionsWithTriggers(survey.survey_question ?? [])
            : collectWatchOnlyAnswerTypeQuestions(survey.survey_question ?? []);

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
        affectedQuestions,
        handleDeviceTypeChange,
        confirmDeviceTypeChange,
        cancelDeviceTypeChange,
    };
}