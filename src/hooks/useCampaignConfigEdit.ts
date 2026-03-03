import { CampaignTable, CampaignTableField, FieldRole, FieldType, RemovedEntries, FetchedCampaign } from "@/types/campaign";
import { AnswerType, ScheduleMethod, Survey, SurveyQuestion, SurveyQuestionOption, SurveyQuestionTrigger, Expression } from "@/types/survey";
import { create } from "zustand";
import { temporal } from "zundo"
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/date";
import { debounce } from "throttle-debounce"

export interface ExportedCampaignConfig {
    tables: CampaignTable[];
    surveys: Survey[];
}

export interface CampaignConfigEditState extends ExportedCampaignConfig {
    campaignId: number;
    campaignPassword: string;
    campaignName: string;
    campaignDescription: string;
    campaignStartTime: string;
    campaignEndTime: string;
    removedEntries: RemovedEntries;

    // Campaign basic information
    setCampaignName: (name: string) => void;
    setCampaignDescription: (description: string) => void;
    setCampaignPassword: (password: string) => void;
    setCampaignStartTime: (startTime: string) => void;
    setCampaignEndTime: (endTime: string) => void;

    // Passive sensing
    setDailyCountMax: (index: number, value: number) => void;
    addTable: (table: CampaignTable) => void;
    removeTable: (index: number) => void;
    addField: (tableIndex: number, field: CampaignTableField) => void;
    removeField: (tableIndex: number, fieldIdx: number) => void;
    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => void;


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
    setCampaign: (campaign: FetchedCampaign) => void;
    setCampaignUsingImportedConfig: (config: ExportedCampaignConfig) => void;
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

function getValueType(answerType: AnswerType, expression: Expression) {
    switch (answerType) {
        case 'text':
            return expression.op === 'Empty' ? null : 'string';
        case 'number':
        case 'radio':
            return 'number';
        case 'checkbox':
            return expression.op === 'Contains' ? 'number' : 'array';
        default:
            return null;
    }
}

function checkExpressionValidity(prevAnswerType: AnswerType, prevExpression: Expression | null | undefined, answerType: AnswerType, expression: Expression | null | undefined): Expression | null | undefined {
    if (!prevExpression || !expression) return expression;

    if (answerType === 'text' && !['Empty', 'Equal', 'NotEqual'].includes(expression.op)) {
        return { op: 'Equal', value: '' } as Expression;
    }
    if ((answerType === 'number' || answerType === 'radio') && !['Equal', 'NotEqual', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual'].includes(expression.op)) {
        return { op: 'Equal', value: 0 } as Expression;
    }
    if (answerType === 'checkbox' && !['Equal', 'NotEqual', 'Contains'].includes(expression.op)) {
        return { op: 'Equal', value: [] } as Expression;
    }

    // Then check if the value type is still valid
    const prevValueType = getValueType(prevAnswerType, prevExpression);
    const newValueType = getValueType(answerType, expression);
    if (newValueType !== prevValueType) {
        return { op: expression.op, value: newValueType === 'number' ? 0 : newValueType === 'string' ? '' : [0] } as Expression;
    }

    return expression;
}

const useCampaignConfigEdit = create<CampaignConfigEditState>()(temporal((set) => ({
    campaignId: -1,
    campaignName: "",
    campaignDescription: "",
    campaignPassword: "",
    campaignStartTime: dayjs().format(DATE_FORMAT),
    campaignEndTime: dayjs().add(1, 'day').format(DATE_FORMAT),
    tables: [],
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

    setCampaignDescription: (description: string) => {
        set({ campaignDescription: description });
    },

    setCampaignPassword: (password: string) => {
        set({ campaignPassword: password });
    },

    setCampaignStartTime: (startTime: string) => {
        const formattedStartTime = dayjs(startTime).format(DATE_FORMAT);
        set({ campaignStartTime: formattedStartTime });
    },

    setCampaignEndTime: (endTime: string) => {
        const formattedEndTime = dayjs(endTime).format(DATE_FORMAT);
        set({ campaignEndTime: formattedEndTime });
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

            const prevAnswerType = arr[idx].answer_type;
            const prevTriggers = structuredClone(arr[idx].survey_question_trigger);
            arr[idx] = { ...arr[idx], ...updates };

            prevTriggers.forEach((pt, idx) => {
                const safeExpression = checkExpressionValidity(prevAnswerType, pt.expression as Expression, arr[idx].answer_type, arr[idx].survey_question_trigger[idx].expression as Expression);
                arr[idx].survey_question_trigger[idx].expression = safeExpression;
            })
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
                expression: { op: 'Equal', value: question.answer_type in ['radio', 'checkbox'] && question.survey_question_option.length > 0 ? 0 : '' } as Expression,
                survey_question: [],
            };

            switch (question.answer_type) {
                case 'checkbox':
                    newTrigger.expression = { op: 'Equal', value: [] }
                    break;
                case 'text':
                    newTrigger.expression = { op: 'Equal', value: '' }
                    break;
                default:
                    newTrigger.expression = { op: 'Equal', value: 0 }
                    break;
            }

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
            campaignDescription: "",
            campaignPassword: "",
            campaignStartTime: dayjs().format(DATE_FORMAT),
            campaignEndTime: dayjs().add(1, 'day').format(DATE_FORMAT),
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
            surveys: [],
        });
    },

    setCampaign: (campaign: FetchedCampaign) => {
        set({
            campaignId: campaign.id,
            campaignName: campaign.name,
            campaignDescription: campaign.description,
            campaignPassword: "",
            campaignStartTime: campaign.start_time,
            campaignEndTime: campaign.end_time,
            tables: campaign.campaign_table,
            surveys: campaign.survey,
            removedEntries: {
                table: [],
                field: [],
                mapping: [],
                survey: [],
                question: [],
                option: [],
                trigger: [],
            },
        });
    },

    setCampaignUsingImportedConfig: (config: ExportedCampaignConfig) => {
        set((state) => {
            const removedEntries = structuredClone(state.removedEntries);
            const walkQuestions = (questions: SurveyQuestion[]) => {
                questions.forEach((q) => {
                    removedEntries.question.push(q.id ?? -1);
                    q.survey_question_option.forEach((o) => {
                        removedEntries.option.push(o.id ?? -1);
                    });
                    q.survey_question_trigger.forEach((tr) => {
                        removedEntries.trigger.push(tr.id ?? -1);
                        walkQuestions(tr.survey_question);
                    });
                });
            };

            state.surveys.forEach((s) => {
                removedEntries.survey.push(s.id ?? -1);
                walkQuestions(s.survey_question);
            });

            state.tables.forEach((table) => {
                removedEntries.table.push(table.id ?? -1);
                table.campaign_table_field.forEach((field) => {
                    removedEntries.field.push(field.id ?? -1);
                    field.campaign_table_field_mapping.forEach((mapping) => {
                        removedEntries.mapping.push(mapping.id ?? -1);
                    });
                });
            });

            return {
                ...state,
                tables: config.tables,
                surveys: config.surveys,
                removedEntries,
            }
        });
    },
}),
    {
        // onSave: (state) => {
        //     console.log('onSave', state);
        // },
        handleSet: (handleSet) =>
            debounce<typeof handleSet>(300, (state) => {
                handleSet(state);
            }, { atBegin: true })
    }
));

export default useCampaignConfigEdit;
