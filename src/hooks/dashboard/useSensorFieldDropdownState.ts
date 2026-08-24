import { useMemo, useState, useCallback } from "react";
import { CampaignTableField, FetchedCampaignTable } from "@/types/campaign";
import { DeepRequired } from "@/utils/type";
import { FetchedSurvey, FetchedSurveyQuestion } from "@/types/survey";

const useSensorFieldDropdownState = (
  selectedFieldIds: number[],
  campaignTables: Map<number, FetchedCampaignTable>,
  campaignTableFields: Map<number, DeepRequired<CampaignTableField>>,
  setSelectedFieldIds: (fieldIds: number[]) => void,
  isMultipleSelection: boolean,
  selectedQuestionIds: number[],
  surveys: FetchedSurvey[],
  flatQuestions: Map<number, FetchedSurveyQuestion>,
  setSelectedQuestionIds: (questionIds: number[]) => void,
) => {
  // Left-column selection: either a sensor table or a survey, but not both.
  const [selectedSensor, _setSelectedSensor] = useState(-1);
  const [selectedSurvey, _setSelectedSurvey] = useState(-1);

  const setSelectedSensor = useCallback((tableId: number) => {
    _setSelectedSensor(tableId);
    if (tableId !== -1) _setSelectedSurvey(-1);
  }, []);
  const setSelectedSurvey = useCallback((surveyId: number) => {
    _setSelectedSurvey(surveyId);
    if (surveyId !== -1) _setSelectedSensor(-1);
  }, []);

  const selectedFields = useMemo(
    () => selectedFieldIds.map((id) => campaignTableFields.get(id)).filter((field) => field != undefined),
    [selectedFieldIds, campaignTableFields],
  );
  const selectedQuestions = useMemo(
    () => selectedQuestionIds.map((id) => flatQuestions.get(id)).filter((q) => q != undefined),
    [selectedQuestionIds, flatQuestions],
  );

  const dropdownLabel = useMemo(() => {
    const totalSelected = selectedFieldIds.length + selectedQuestionIds.length;
    if (totalSelected === 0) return "Select Sensor";

    let primaryLabel: string | null = null;
    if (selectedFieldIds.length > 0) {
      const displayedField = campaignTableFields.get(selectedFieldIds[0]);
      if (displayedField !== undefined) {
        const displayName = campaignTables.get(displayedField.campaign_table_id)?.display_name;
        primaryLabel = `${displayName} - ${displayedField.name}`;
      }
    } else if (selectedQuestionIds.length > 0) {
      const q = flatQuestions.get(selectedQuestionIds[0]);
      if (q !== undefined) {
        const survey = surveys.find((s) => s.id === q.survey_id);
        primaryLabel = `${survey?.title ?? "Survey"} - ${q.question}`;
      }
    }

    if (primaryLabel === null) return "Select Sensor";
    if (totalSelected === 1) return primaryLabel;
    return `${primaryLabel} + ${totalSelected - 1} more`;
  }, [selectedFieldIds, selectedQuestionIds, campaignTableFields, campaignTables, flatQuestions, surveys]);

  const isAllFieldsSelected = useMemo(() => {
    return new Map<number, boolean>(
      Array.from(campaignTables.values()).map((table) => {
        const allSelected = table.campaign_table_field.every((field) => selectedFieldIds.includes(field.id));
        return [table.id, allSelected];
      }),
    );
  }, [selectedFieldIds, campaignTables]);

  const selectedCountByTable = useMemo(() => {
    return new Map<number, number>(
      Array.from(campaignTables.values()).map((table) => {
        const selectedCount = table.campaign_table_field.filter((field) => selectedFieldIds.includes(field.id)).length;
        return [table.id, selectedCount];
      }),
    );
  }, [selectedFieldIds, campaignTables]);

  const isAllQuestionsSelected = useMemo(() => {
    return new Map<number, boolean>(
      surveys.map((survey) => {
        const ids = Array.from(flatQuestions.values())
          .filter((q) => q.survey_id === survey.id)
          .map((q) => q.id);
        const allSelected = ids.length > 0 && ids.every((id) => selectedQuestionIds.includes(id));
        return [survey.id, allSelected];
      }),
    );
  }, [selectedQuestionIds, surveys, flatQuestions]);

  const selectedCountBySurvey = useMemo(() => {
    return new Map<number, number>(
      surveys.map((survey) => {
        const ids = Array.from(flatQuestions.values())
          .filter((q) => q.survey_id === survey.id)
          .map((q) => q.id);
        return [survey.id, ids.filter((id) => selectedQuestionIds.includes(id)).length];
      }),
    );
  }, [selectedQuestionIds, surveys, flatQuestions]);

  const toggleFieldSelection = useCallback(
    (fieldId: number) => {
      if (isMultipleSelection) {
        if (selectedFieldIds.includes(fieldId)) {
          setSelectedFieldIds(selectedFieldIds.filter((id) => id !== fieldId));
        } else {
          setSelectedFieldIds([...selectedFieldIds, fieldId]);
        }
      } else {
        if (selectedFieldIds.includes(fieldId)) {
          setSelectedFieldIds([]);
        } else {
          setSelectedFieldIds([fieldId]);
          setSelectedQuestionIds([]);
        }
      }
    },
    [selectedFieldIds, isMultipleSelection, setSelectedFieldIds, setSelectedQuestionIds],
  );

  const toggleQuestionSelection = useCallback(
    (questionId: number) => {
      if (isMultipleSelection) {
        if (selectedQuestionIds.includes(questionId)) {
          setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== questionId));
        } else {
          setSelectedQuestionIds([...selectedQuestionIds, questionId]);
        }
      } else {
        if (selectedQuestionIds.includes(questionId)) {
          setSelectedQuestionIds([]);
        } else {
          setSelectedQuestionIds([questionId]);
          setSelectedFieldIds([]);
        }
      }
    },
    [selectedQuestionIds, isMultipleSelection, setSelectedQuestionIds, setSelectedFieldIds],
  );

  const toggleAllFieldsSelection = useCallback(
    (campaignTableId: number) => {
      const fieldIds = campaignTables.get(campaignTableId)?.campaign_table_field.map((field) => field.id) ?? [];

      if (isAllFieldsSelected.get(campaignTableId) ?? false) {
        setSelectedFieldIds(selectedFieldIds.filter((id) => !fieldIds.includes(id)));
      } else {
        setSelectedFieldIds([...selectedFieldIds, ...fieldIds]);
      }
    },
    [selectedFieldIds, isAllFieldsSelected, setSelectedFieldIds, campaignTables],
  );

  const toggleAllQuestionsSelection = useCallback(
    (surveyId: number) => {
      const questionIds = Array.from(flatQuestions.values())
        .filter((q) => q.survey_id === surveyId)
        .map((q) => q.id);

      if (isAllQuestionsSelected.get(surveyId) ?? false) {
        setSelectedQuestionIds(selectedQuestionIds.filter((id) => !questionIds.includes(id)));
      } else {
        setSelectedQuestionIds([...selectedQuestionIds, ...questionIds]);
      }
    },
    [selectedQuestionIds, isAllQuestionsSelected, setSelectedQuestionIds, flatQuestions],
  );

  const isAllSensorsSelected = useMemo(() => {
    return selectedFields.length === campaignTableFields.size;
  }, [selectedFields, campaignTableFields]);

  const toggleAllSensorsSelection = useCallback(() => {
    if (isAllSensorsSelected) {
      setSelectedFieldIds([]);
    } else {
      setSelectedFieldIds(Array.from(campaignTableFields.keys()));
    }
  }, [isAllSensorsSelected, setSelectedFieldIds, campaignTableFields]);

  return {
    selectedFields,
    selectedQuestions,
    selectedSensor,
    setSelectedSensor,
    selectedSurvey,
    setSelectedSurvey,
    dropdownLabel,
    isAllFieldsSelected,
    isAllQuestionsSelected,
    isAllSensorsSelected,
    toggleFieldSelection,
    toggleQuestionSelection,
    toggleAllFieldsSelection,
    toggleAllQuestionsSelection,
    toggleAllSensorsSelection,
    selectedCountByTable,
    selectedCountBySurvey,
  };
};

export default useSensorFieldDropdownState;
