import { CampaignTable, CampaignTableField, FieldRole, FieldType, RemovedEntries } from "@/types/campaign";
import { ScheduleMethod, Survey, SurveyQuestion, SurveyQuestionOption, SurveyQuestionTrigger, Expression } from "@/types/survey";
import { create } from "zustand";

interface PassiveSensingConfig {
    startTime: number; // milliseconds since midnight
    endTime: number; // milliseconds since midnight
}

interface CampaignConfigEditState {
    campaignId: number;
    campaignName: string;
    tables: CampaignTable[];
    passiveSensingConfig: PassiveSensingConfig;
    surveys: Survey[];
    removedEntries: RemovedEntries;

    // Campaign basic information
    setCampaignName: (name: string) => void;

    // Passive sensing
    setDailyCountMax: (index: number, value: number) => void;
    addTable: (table: CampaignTable) => void;
    removeTable: (index: number) => void;
    addField: (tableIndex: number, field: CampaignTableField) => void;
    removeField: (tableIndex: number, fieldIdx: number) => void;
    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => void;
    setPassiveSensingStartTime: (timeMs: number) => void;
    setPassiveSensingEndTime: (timeMs: number) => void;

    // Active sensing
    addSurvey: () => void;
    removeSurvey: (index: number) => void;
    updateSurveyTitle: (index: number, title: string) => void;
    updateSurveyDescription: (index: number, description: string) => void;
    updateSurveyScheduleMethod: (index: number, scheduleMethod: ScheduleMethod) => void;

    addSurveyQuestion: (surveyIndex: number, questionPath: number[], triggerIndex?: number) => void;
    /**
     * Update/remove/reorder questions at any nesting level using a "question path".
     * Path format:
     * - Top-level question: [questionIndex]
     * - Child question under trigger: [questionIndex, triggerIndex, childQuestionIndex]
     * - Deeper nesting repeats pairs: [q, trigger, childQ, trigger2, grandchildQ, ...]
     */
    removeSurveyQuestion: (surveyIndex: number, questionPath: number[]) => void;
    updateSurveyQuestion: (surveyIndex: number, questionPath: number[], updates: Partial<SurveyQuestion>) => void;
    reorderSurveyQuestion: (surveyIndex: number, questionPath: number[], direction: 'up' | 'down') => void;

    addSurveyQuestionOption: (surveyIndex: number, questionPath: number[]) => void;
    removeSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number) => void;
    updateSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, updates: Partial<SurveyQuestionOption>) => void;
    reorderSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, direction: 'up' | 'down') => void;

    addSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[]) => void;
    removeSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number) => void;
    updateSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number, updates: Partial<SurveyQuestionTrigger>) => void;
    updateSurveyQuestionTriggerExpression: (surveyIndex: number, questionPath: number[], triggerIndex: number, expression: Expression) => void;
    reset: () => void;
    /**
     * Set store state from a loaded campaign.
     * Keep this type shallow to avoid TS "type instantiation is excessively deep" on recursive survey types.
     */
    setCampaign: (campaign: {
        id: number;
        name: string;
        campaign_table: CampaignTable[];
        start_time_of_day: number;
        end_time_of_day: number;
        survey: Survey[];
    }) => void;
}

/**
 * Resolve a question (at any nesting level) from a survey by a questionPath.
 * Path format:
 * - Top-level question: [questionIndex]
 * - Child question under trigger: [questionIndex, triggerIndex, childQuestionIndex]
 * - Deeper nesting repeats pairs: [q, trigger, childQ, trigger2, grandchildQ, ...]
 */
function getQuestionFromPath(survey: Survey, questionPath: number[]): SurveyQuestion | undefined {
    if (!questionPath.length) return undefined;
    let current: SurveyQuestion | undefined = survey.survey_question?.[questionPath[0]];
    for (let i = 1; i < questionPath.length; i += 2) {
        const triggerIndex = questionPath[i];
        const childQuestionIndex = questionPath[i + 1];
        current = current?.survey_question_trigger?.[triggerIndex]?.survey_question?.[childQuestionIndex];
    }
    return current;
}

/**
 * Resolve the array that contains the target question + its index within that array.
 * Useful for remove/reorder without needing parent pointers.
 */
function getQuestionArrayAndIndexFromPath(
    survey: Survey,
    questionPath: number[]
): { arr: SurveyQuestion[]; idx: number } | undefined {
    if (!questionPath.length) return undefined;

    let arr: SurveyQuestion[] = survey.survey_question || [];
    let idx = questionPath[0];
    let current: SurveyQuestion | undefined = arr[idx];

    for (let i = 1; i < questionPath.length; i += 2) {
        const triggerIndex = questionPath[i];
        const childIndex = questionPath[i + 1];
        const trigger = current?.survey_question_trigger?.[triggerIndex];
        arr = trigger?.survey_question || [];
        idx = childIndex;
        current = arr[idx];
    }

    return { arr, idx };
}

const useCampaignConfigEdit = create<CampaignConfigEditState>((set) => ({
    campaignId: -1,
    campaignName: "",
    tables: [],
    passiveSensingConfig: {
        startTime: 0, // 00:00 in milliseconds
        endTime: 23 * 60 * 60 * 1000 + 59 * 60 * 1000, // 23:59 in milliseconds
    },
    surveys: [],
    removedEntries: {
        table: [],
        field: [],
        mapping: [],
        survey: [],
        question: [],
        option: [],
        trigger: [],
    },

    setCampaignName: (name: string) => {
        set({ campaignName: name });
    },

    setDailyCountMax: (index: number, value: number) => {
        set((state) => {
            const newTables = [...state.tables];
            newTables.splice(index, 1, { ...state.tables[index], daily_count_max: value });
            return {
                tables: newTables,
            };
        });
    },

    addTable: (table: CampaignTable) => {
        set((state) => {
            const newTables = [...state.tables, table];
            return {
                tables: newTables,
            };
        });
    },

    removeTable: (index: number) => {
        set((state) => {
            const newTables = [...state.tables];
            const removedTableId = newTables.splice(index, 1)[0].id ?? -1;
            return {
                removedEntries: {
                    ...state.removedEntries,
                    table: [...state.removedEntries.table, removedTableId],
                },
                tables: newTables,
            };
        });
    },

    addField: (tableIndex: number, field: CampaignTableField) => {
        set((state) => {
            const newTables = structuredClone(state.tables);

            newTables[tableIndex].campaign_table_field.push(field);
            return {
                tables: newTables,
            };
        });
    },

    removeField: (tableIndex: number, fieldIdx: number) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const removedFieldId = newTables[tableIndex].campaign_table_field.splice(fieldIdx, 1)[0].id ?? -1;
            return {
                removedEntries: {
                    ...state.removedEntries,
                    field: [...state.removedEntries.field, removedFieldId],
                },
                tables: newTables,
            };
        });
    },

    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const field = newTables[tableIndex].campaign_table_field[fieldIdx];
            if (fieldName == 'role') {
                newTables[tableIndex].campaign_table_field[fieldIdx] = { ...field, field_role: fieldValue as FieldRole };
            } else {
                newTables[tableIndex].campaign_table_field[fieldIdx] = { ...field, field_type: fieldValue as FieldType };
            }
            return {
                tables: newTables,
            };
        });
    },

    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const originalMapping = newTables[tableIndex].campaign_table_field[fieldIdx].campaign_table_field_mapping;
            newTables[tableIndex].campaign_table_field[fieldIdx] = { ...newTables[tableIndex].campaign_table_field[fieldIdx], campaign_table_field_mapping: mapping.map(m => ({ value: m.value, display: m.display, field_id: -1 })) };
            return {
                tables: newTables,
                removedEntries: {
                    ...state.removedEntries,
                    mapping: [...state.removedEntries.mapping, ...originalMapping.map(m => m.id ?? -1)],
                },
            };
        });
    },

    setPassiveSensingStartTime: (timeMs: number) => {
        set((state) => ({
            passiveSensingConfig: {
                ...state.passiveSensingConfig,
                startTime: timeMs,
            }
        }));
    },

    setPassiveSensingEndTime: (timeMs: number) => {
        set((state) => ({
            passiveSensingConfig: {
                ...state.passiveSensingConfig,
                endTime: timeMs,
            }
        }));
    },

    addSurvey: () => {
        set((state) => {
            const newSurvey: Survey = {
                campaign_id: -1,
                title: `Survey ${state.surveys.length + 1}`,
                description: "",
                schedule_method: null,
                survey_question: [],
            };
            return {
                surveys: [...state.surveys, newSurvey]
            };
        });
    },

    removeSurvey: (index: number) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            const removedSurveyId = newSurveys.splice(index, 1)[0].id ?? -1;
            return {
                removedEntries: {
                    ...state.removedEntries,
                    survey: [...state.removedEntries.survey, removedSurveyId],
                },
                surveys: newSurveys,
            };
        });
    },

    updateSurveyTitle: (index: number, title: string) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            newSurveys[index] = { ...newSurveys[index], title };
            return { surveys: newSurveys };
        });
    },

    updateSurveyDescription: (index: number, description: string) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            newSurveys[index] = { ...newSurveys[index], description };
            return { surveys: newSurveys };
        });
    },

    updateSurveyScheduleMethod: (index: number, scheduleMethod: ScheduleMethod) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            newSurveys[index] = { ...newSurveys[index], schedule_method: scheduleMethod };
            return { surveys: newSurveys };
        });
    },

    addSurveyQuestion: (surveyIndex: number, questionPath: number[], triggerIndex?: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey) return state;

            let targetArray: SurveyQuestion[];

            if (questionPath.length == 0) {
                targetArray = survey.survey_question;
            } else {
                const question = getQuestionFromPath(survey, questionPath);
                if (!question) return state;
                const trigger = question.survey_question_trigger[triggerIndex!];
                if (!trigger) return state;

                targetArray = trigger.survey_question;
            }

            const newChildQuestion: SurveyQuestion = {
                survey_id: -1,
                triggered_by: null,
                question: `Question ${(targetArray.length || 0) + 1}`,
                answer_type: 'text',
                is_mandatory: false,
                survey_question_option: [],
                survey_question_trigger: [],
            };
            targetArray.push(newChildQuestion);


            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestion: (surveyIndex: number, questionPath: number[]) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const resolved = getQuestionArrayAndIndexFromPath(survey, questionPath);
            if (!resolved) return state;
            const { arr, idx } = resolved;
            if (idx < 0 || idx >= arr.length) return state;

            const removedQuestionId = arr.splice(idx, 1)[0]?.id ?? -1;
            return {
                removedEntries: {
                    ...state.removedEntries,
                    question: [...state.removedEntries.question, removedQuestionId],
                },
                surveys: newSurveys,
            };
        });
    },

    updateSurveyQuestion: (surveyIndex: number, questionPath: number[], updates: Partial<SurveyQuestion>) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const resolved = getQuestionArrayAndIndexFromPath(survey, questionPath);
            if (!resolved) return state;
            const { arr, idx } = resolved;
            if (idx < 0 || idx >= arr.length) return state;

            arr[idx] = { ...arr[idx], ...updates };
            return { surveys: newSurveys };
        });
    },

    reorderSurveyQuestion: (surveyIndex: number, questionPath: number[], direction: 'up' | 'down') => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const resolved = getQuestionArrayAndIndexFromPath(survey, questionPath);
            if (!resolved) return state;
            const { arr, idx } = resolved;
            if (idx < 0 || idx >= arr.length) return state;

            const newIndex = direction === 'up' ? idx - 1 : idx + 1;
            if (newIndex < 0 || newIndex >= arr.length) return state;

            [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
            return { surveys: newSurveys };
        });
    },

    addSurveyQuestionOption: (surveyIndex: number, questionPath: number[]) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return state;
            if (!question.survey_question_option) question.survey_question_option = [];
            const newOption: SurveyQuestionOption = {
                question_id: -1,
                display: `Option ${question.survey_question_option.length + 1}`,
                allow_free_response: false,
            };
            question.survey_question_option.push(newOption);
            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question || !question.survey_question_option) return state;
            const removedOptionId = question.survey_question_option.splice(optionIndex, 1)[0].id ?? -1;
            question.survey_question_option = question.survey_question_option.filter((_, i) => i !== optionIndex);
            return {
                removedEntries: {
                    ...state.removedEntries,
                    option: [...state.removedEntries.option, removedOptionId],
                },
                surveys: newSurveys,
            };
        });
    },

    updateSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, updates: Partial<SurveyQuestionOption>) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question || !question.survey_question_option) return state;
            question.survey_question_option[optionIndex] = { ...question.survey_question_option[optionIndex], ...updates };
            return { surveys: newSurveys };
        });
    },

    reorderSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, direction: 'up' | 'down') => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question || !question.survey_question_option) return state;
            const options = [...question.survey_question_option];
            const newIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1;

            if (newIndex < 0 || newIndex >= options.length) {
                return state; // Can't move beyond boundaries
            }

            // Swap options
            [options[optionIndex], options[newIndex]] = [options[newIndex], options[optionIndex]];

            question.survey_question_option = options;
            return { surveys: newSurveys };
        });
    },

    addSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[]) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return state;
            const newTrigger: SurveyQuestionTrigger = {
                question_id: -1,
                expression: { op: 'Equal', value: '' } as Expression,
                survey_question: [],
            };
            if (!question.survey_question_trigger) {
                question.survey_question_trigger = [];
            }
            question.survey_question_trigger.push(newTrigger);
            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return state;
            const removedTriggerId = question.survey_question_trigger?.splice(triggerIndex, 1)[0].id ?? -1;
            if (question.survey_question_trigger) {
                question.survey_question_trigger = question.survey_question_trigger.filter((_, i) => i !== triggerIndex);
            }
            return {
                removedEntries: {
                    ...state.removedEntries,
                    trigger: [...state.removedEntries.trigger, removedTriggerId],
                },
                surveys: newSurveys,
            };
        });
    },

    updateSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number, updates: Partial<SurveyQuestionTrigger>) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return state;
            if (question.survey_question_trigger && question.survey_question_trigger[triggerIndex]) {
                question.survey_question_trigger[triggerIndex] = {
                    ...question.survey_question_trigger[triggerIndex],
                    ...updates,
                };
            }
            return { surveys: newSurveys };
        });
    },

    updateSurveyQuestionTriggerExpression: (surveyIndex: number, questionPath: number[], triggerIndex: number, expression: Expression) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const survey = newSurveys[surveyIndex];
            if (!survey || questionPath.length === 0) return state;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return state;
            if (question.survey_question_trigger && question.survey_question_trigger[triggerIndex]) {
                question.survey_question_trigger[triggerIndex].expression = expression;
            }
            return { surveys: newSurveys };
        });
    },



    reset: () => {
        set({
            campaignId: -1,
            campaignName: "",
            removedEntries: {
                table: [],
                field: [],
                mapping: [],
                survey: [],
                question: [],
                option: [],
                trigger: [],
            },
            tables: [],
            passiveSensingConfig: {
                startTime: 0,
                endTime: 23 * 60 * 60 * 1000 + 59 * 60 * 1000,
            },
            surveys: [],
        });
    },

    setCampaign: (campaign: {
        id: number;
        name: string;
        start_time_of_day: number;
        end_time_of_day: number;
        campaign_table: CampaignTable[];
        survey: Survey[];
    }) => {
        set({
            campaignId: campaign.id,
            campaignName: campaign.name,
            tables: campaign.campaign_table,
            passiveSensingConfig: { startTime: campaign.start_time_of_day, endTime: campaign.end_time_of_day },
            surveys: campaign.survey,
        });
    }
}));

export default useCampaignConfigEdit;
