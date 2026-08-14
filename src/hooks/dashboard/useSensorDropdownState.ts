import { useCallback, useMemo } from "react";
import { FetchedCampaignTable } from "@/types/campaign";
import { FetchedSurvey, FetchedSurveyQuestion } from "@/types/survey";

const useSensorDropdownState = (
    selectedFieldIds: number[],
    campaignTables: Map<number, FetchedCampaignTable>,
    setSelectedFieldIds: (fieldIds: number[]) => void,
    selectedQuestionIds: number[],
    surveys: FetchedSurvey[],
    flatQuestions: Map<number, FetchedSurveyQuestion>,
    setSelectedQuestionIds: (questionIds: number[]) => void,
) => {
    const fieldIdsByTable = useMemo(() => {
        return new Map(Array.from(campaignTables.values()).map(table => [table.id, table.campaign_table_field.map(f => f.id)]));
    }, [campaignTables]);

    const questionIdsBySurvey = useMemo(() => {
        const map = new Map<number, number[]>(surveys.map(s => [s.id, []]));
        for (const question of flatQuestions.values()) {
            map.get(question.survey_id)?.push(question.id);
        }
        return map;
    }, [surveys, flatQuestions]);

    const isTableSelected = useCallback((tableId: number) => {
        const fieldIds = fieldIdsByTable.get(tableId) ?? [];
        return fieldIds.length > 0 && fieldIds.every(id => selectedFieldIds.includes(id));
    }, [fieldIdsByTable, selectedFieldIds]);

    const toggleTable = useCallback((tableId: number) => {
        const fieldIds = fieldIdsByTable.get(tableId) ?? [];
        if (isTableSelected(tableId)) {
            setSelectedFieldIds(selectedFieldIds.filter(id => !fieldIds.includes(id)));
        } else {
            setSelectedFieldIds([...new Set([...selectedFieldIds, ...fieldIds])]);
        }
    }, [fieldIdsByTable, isTableSelected, selectedFieldIds, setSelectedFieldIds]);

    const isSurveySelected = useCallback((surveyId: number) => {
        const questionIds = questionIdsBySurvey.get(surveyId) ?? [];
        return questionIds.length > 0 && questionIds.every(id => selectedQuestionIds.includes(id));
    }, [questionIdsBySurvey, selectedQuestionIds]);

    const toggleSurvey = useCallback((surveyId: number) => {
        const questionIds = questionIdsBySurvey.get(surveyId) ?? [];
        if (isSurveySelected(surveyId)) {
            setSelectedQuestionIds(selectedQuestionIds.filter(id => !questionIds.includes(id)));
        } else {
            setSelectedQuestionIds([...new Set([...selectedQuestionIds, ...questionIds])]);
        }
    }, [questionIdsBySurvey, isSurveySelected, selectedQuestionIds, setSelectedQuestionIds]);

    const allFieldIds = useMemo(() => Array.from(fieldIdsByTable.values()).flat(), [fieldIdsByTable]);
    const allQuestionIds = useMemo(() => Array.from(flatQuestions.keys()), [flatQuestions]);

    const isAllSelected = useMemo(() => {
        return (allFieldIds.length + allQuestionIds.length) > 0
            && allFieldIds.every(id => selectedFieldIds.includes(id))
            && allQuestionIds.every(id => selectedQuestionIds.includes(id));
    }, [allFieldIds, allQuestionIds, selectedFieldIds, selectedQuestionIds]);

    const toggleAll = useCallback(() => {
        if (isAllSelected) {
            setSelectedFieldIds([]);
            setSelectedQuestionIds([]);
        } else {
            setSelectedFieldIds(allFieldIds);
            setSelectedQuestionIds(allQuestionIds);
        }
    }, [isAllSelected, allFieldIds, allQuestionIds, setSelectedFieldIds, setSelectedQuestionIds]);

    const dropdownLabel = useMemo(() => {
        const selectedCount = Array.from(campaignTables.keys()).filter(isTableSelected).length
            + surveys.filter(s => isSurveySelected(s.id)).length;
        return selectedCount === 0 ? "Select Sensor" : `${selectedCount} sensor${selectedCount > 1 ? 's' : ''} selected`;
    }, [campaignTables, surveys, isTableSelected, isSurveySelected]);

    return {
        dropdownLabel,
        isTableSelected,
        toggleTable,
        isSurveySelected,
        toggleSurvey,
        isAllSelected,
        toggleAll,
    };
};

export default useSensorDropdownState;
