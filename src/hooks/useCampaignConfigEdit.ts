import { CampaignTable, CampaignTableField, FetchedCampaign, FieldRole, FieldType, RemovedEntries } from "@/types/campaign";
import { AnswerType, Expression, OperatorType, ScheduleMethod, Survey, SurveyQuestion, SurveyQuestionOption, SurveyQuestionTrigger } from "@/types/survey";
import { DATE_FORMAT } from "@/utils/date";
import dayjs from "dayjs";
import { WritableDraft } from "immer";
import { debounce } from "throttle-debounce";
import { temporal } from "zundo";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
    updateTableName: (index: number, name: string) => void;
    updateTableDescription: (index: number, description: string) => void;
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

    /**
     * Update/remove/reorder questions at any nesting level using a "question path".
     * Path format:
     * - Top-level question: [questionIndex]
     * - Child question under trigger: [questionIndex, triggerIndex, childQuestionIndex]
     * - Deeper nesting repeats pairs: [q, trigger, childQ, trigger2, grandchildQ, ...]
     */
    addSurveyQuestion: (surveyIndex: number, questionPath: number[], triggerIndex?: number) => void;
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
 * Resolve the array that contains the target question + its index within that array.
 * Accepts both plain `Survey` objects and Immer drafts, so it only relies
 * on the `survey_question` field being present.
 *
 * Useful for remove/reorder without needing parent pointers.
 */
function getQuestionArrayAndIndexFromPath(
    survey: WritableDraft<{ survey_question: SurveyQuestion[] }>,
    questionPath: number[]
): { arr: WritableDraft<SurveyQuestion[]> | undefined; idx: number } {
    if (!questionPath.length) return { arr: survey.survey_question, idx: -1 }

    let arr = survey.survey_question;
    let idx = questionPath[0];
    let current = arr?.[idx];

    for (let i = 1; i < questionPath.length; i += 2) {
        const triggerIndex = questionPath[i];
        const childIndex = questionPath[i + 1];
        const trigger = current.survey_question_trigger?.[triggerIndex];

        arr = trigger?.survey_question
        idx = childIndex;
        current = arr[idx];
    }

    return { arr, idx };
}

/**
 * Resolve a question (at any nesting level) from a survey by a questionPath.
 * Accepts both plain `Survey` objects and Immer drafts, so it only relies
 * on the `survey_question` field being present.
 *
 * Path format:
 * - Top-level question: [questionIndex]
 * - Child question under trigger: [questionIndex, triggerIndex, childQuestionIndex]
 * - Deeper nesting repeats pairs: [q, trigger, childQ, trigger2, grandchildQ, ...]
 */
function getQuestionFromPath(
    survey: WritableDraft<{ survey_question: SurveyQuestion[] }>,
    questionPath: number[]
): SurveyQuestion | undefined {
    const { arr, idx } = getQuestionArrayAndIndexFromPath(survey, questionPath);
    if (!arr) return undefined;
    return arr[idx];
}

function getTriggerFromPath(
    survey: WritableDraft<{ survey_question: SurveyQuestion[] }>,
    questionPath: number[],
    triggerIndex: number
): WritableDraft<SurveyQuestionTrigger> | undefined {
    const question = getQuestionFromPath(survey, questionPath);
    if (!question) return undefined;
    return question.survey_question_trigger?.[triggerIndex];
}

function getValueType(answerType: AnswerType, op: OperatorType) {
    switch (answerType) {
        case 'text':
            return op === 'Empty' ? null : 'string';
        case 'number':
        case 'radio':
            return 'number';
        case 'checkbox':
            return op === 'Contains' ? 'number' : 'array';
        default:
            return null;
    }
}

function checkExpressionValidity(prevAnswerType: AnswerType, answerType: AnswerType, expression: Expression | null | undefined): Expression | null | undefined {
    if (!expression) return expression;

    // If the operator type is not valid, return the default value
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
    const prevValueType = getValueType(prevAnswerType, expression.op);
    const newValueType = getValueType(answerType, expression.op);
    if (newValueType !== prevValueType) {
        return { op: expression.op, value: newValueType === 'number' ? 0 : newValueType === 'string' ? '' : [0] } as Expression;
    }

    return expression;
}

const useCampaignConfigEdit = create<CampaignConfigEditState>()(temporal(immer((set) => ({
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
        set((state) => {
            state.campaignName = name;
        });
    },

    setCampaignDescription: (description: string) => {
        set((state) => {
            state.campaignDescription = description;
        });
    },

    setCampaignPassword: (password: string) => {
        set((state) => {
            state.campaignPassword = password;
        });
    },

    setCampaignStartTime: (startTime: string) => {
        set((state) => {
            state.campaignStartTime = dayjs(startTime).format(DATE_FORMAT);
        });
    },

    setCampaignEndTime: (endTime: string) => {
        set((state) => {
            state.campaignEndTime = dayjs(endTime).format(DATE_FORMAT);
        });
    },

    setDailyCountMax: (index: number, value: number) => {
        set((state) => {
            state.tables[index].daily_count_max = value;
        });
    },

    addTable: (table: CampaignTable) => {
        set((state) => {
            state.tables.push(table);
        });
    },

    removeTable: (index: number) => {
        set((state) => {
            state.removedEntries.table.push(state.tables[index].id ?? -1);
            state.tables.splice(index, 1);
        });
    },

    updateTableName: (index: number, name: string) => {
        set((state) => {
            state.tables[index].name = name;
        });
    },

    updateTableDescription: (index: number, description: string) => {
        set((state) => {
            state.tables[index].description = description;
        });
    },

    addField: (tableIndex: number, field: CampaignTableField) => {
        set((state) => {
            state.tables[tableIndex].campaign_table_field.push(field);
        });
    },

    removeField: (tableIndex: number, fieldIdx: number) => {
        set((state) => {
            state.removedEntries.field.push(state.tables[tableIndex].campaign_table_field[fieldIdx].id ?? -1);
            state.tables[tableIndex].campaign_table_field.splice(fieldIdx, 1);
        });
    },

    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => {
        set((state) => {
            if (fieldName == 'role') {
                state.tables[tableIndex].campaign_table_field[fieldIdx].field_role = fieldValue as FieldRole;
            } else {
                state.tables[tableIndex].campaign_table_field[fieldIdx].field_type = fieldValue as FieldType;
            }
        });
    },

    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => {
        set((state) => {
            state.removedEntries.mapping.push(...state.tables[tableIndex].campaign_table_field[fieldIdx].campaign_table_field_mapping.map(m => m.id ?? -1));
            state.tables[tableIndex].campaign_table_field[fieldIdx].campaign_table_field_mapping = mapping.map(m => ({ value: m.value, display: m.display, field_id: -1 }));
        });
    },

    addSurvey: () => {
        set((state) => {
            state.surveys.push({
                campaign_id: -1,
                title: `Survey ${state.surveys.length + 1}`,
                description: "",
                schedule_method: null,
                survey_question: [],
            });
        });
    },

    removeSurvey: (index: number) => {
        set((state) => {
            state.removedEntries.survey.push(state.surveys[index].id ?? -1);
            state.surveys.splice(index, 1);
        });
    },

    updateSurveyTitle: (index: number, title: string) => {
        set((state) => {
            state.surveys[index].title = title;
        });
    },

    updateSurveyDescription: (index: number, description: string) => {
        set((state) => {
            state.surveys[index].description = description;
        });
    },

    updateSurveyScheduleMethod: (index: number, scheduleMethod: ScheduleMethod) => {
        set((state) => {
            state.surveys[index].schedule_method = scheduleMethod;
        });
    },

    addSurveyQuestion: (surveyIndex: number, questionPath: number[], triggerIndex?: number) => {
        set((state) => {
            let targetArray;
            if (questionPath.length === 0) {
                targetArray = state.surveys[surveyIndex].survey_question;
            } else {
                targetArray = getTriggerFromPath(state.surveys[surveyIndex], questionPath, triggerIndex!)?.survey_question ?? [];
            }

            targetArray.push({
                survey_id: -1,
                triggered_by: null,
                question: `Question ${(targetArray.length || 0) + 1}`,
                answer_type: 'text',
                is_mandatory: false,
                survey_question_option: [],
                survey_question_trigger: [],
            });
        });
    },

    removeSurveyQuestion: (surveyIndex: number, questionPath: number[]) => {
        set((state) => {
            const { arr, idx } = getQuestionArrayAndIndexFromPath(state.surveys[surveyIndex], questionPath);
            if (!arr) return;

            const removedQuestionId = arr.splice(idx, 1)[0]?.id ?? -1;
            state.removedEntries.question.push(removedQuestionId);
        });
    },

    updateSurveyQuestion: (surveyIndex: number, questionPath: number[], updates: Partial<SurveyQuestion>) => {
        set((state) => {
            const survey = state.surveys[surveyIndex];
            if (!survey) return;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return;

            const prevAnswerType = question.answer_type;

            // Apply updates directly to the draft question
            Object.assign(question, updates);

            // Ensure existing triggers remain valid after answer_type changes
            question.survey_question_trigger?.forEach((trigger) => {
                trigger.expression = checkExpressionValidity(
                    prevAnswerType,
                    question.answer_type,
                    trigger.expression as Expression
                );
            });
        });
    },

    reorderSurveyQuestion: (surveyIndex: number, questionPath: number[], direction: 'up' | 'down') => {
        set((state) => {
            const { arr, idx } = getQuestionArrayAndIndexFromPath(state.surveys[surveyIndex], questionPath);
            if (!arr) return;

            const newIndex = direction === 'up' ? idx - 1 : idx + 1;
            if (newIndex < 0 || newIndex >= arr.length) return;

            [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
        });
    },

    addSurveyQuestionOption: (surveyIndex: number, questionPath: number[]) => {
        set((state) => {
            const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
            if (!question) return;

            question.survey_question_option.push({
                question_id: -1,
                display: `Option ${question.survey_question_option.length + 1}`,
                allow_free_response: false,
            });
        });
    },

    removeSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number) => {
        set((state) => {
            const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
            if (!question) return;

            const removedOptionId = question.survey_question_option.splice(optionIndex, 1)[0].id ?? -1;
            state.removedEntries.option.push(removedOptionId);
        });
    },

    updateSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, updates: Partial<SurveyQuestionOption>) => {
        set((state) => {
            const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
            if (!question) return;

            question.survey_question_option[optionIndex] = { ...question.survey_question_option[optionIndex], ...updates };
        });
    },

    reorderSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, direction: 'up' | 'down') => {
        set((state) => {
            const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
            if (!question) return;

            const options = question.survey_question_option;
            const newIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1;

            if (newIndex < 0 || newIndex >= options.length) {
                return; // Can't move beyond boundaries
            }

            // Swap options
            [options[optionIndex], options[newIndex]] = [options[newIndex], options[optionIndex]];
        });
    },

    addSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[]) => {
        set((state) => {
            const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
            if (!question) return;

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
        });
    },

    removeSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number) => {
        set((state) => {
            const survey = state.surveys[surveyIndex];
            if (!survey || questionPath.length === 0) return;

            const question = getQuestionFromPath(survey, questionPath);
            if (!question) return;
            const removedTriggerId = question.survey_question_trigger?.splice(triggerIndex, 1)[0].id ?? -1;
            state.removedEntries.trigger.push(removedTriggerId);
        });
    },

    updateSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number, updates: Partial<SurveyQuestionTrigger>) => {
        set((state) => {
            const trigger = getTriggerFromPath(state.surveys[surveyIndex], questionPath, triggerIndex);
            if (!trigger) return;
            Object.assign(trigger, updates);
        });
    },

    updateSurveyQuestionTriggerExpression: (surveyIndex: number, questionPath: number[], triggerIndex: number, expression: Expression) => {
        set((state) => {
            const trigger = getTriggerFromPath(state.surveys[surveyIndex], questionPath, triggerIndex);
            if (!trigger) return;
            trigger.expression = expression;
        });
    },

    reset: () => {
        set((state) => {
            state.campaignId = -1;
            state.campaignName = "";
            state.campaignDescription = "";
            state.campaignStartTime = dayjs().format(DATE_FORMAT);
            state.campaignEndTime = dayjs().add(1, 'day').format(DATE_FORMAT);
            state.removedEntries = {
                table: [],
                field: [],
                mapping: [],
                survey: [],
                question: [],
                option: [],
                trigger: [],
            }
            state.tables = [];
            state.surveys = [];
        });
    },

    setCampaign: (campaign: FetchedCampaign) => {
        set((state) => {
            state.campaignId = campaign.id;
            state.campaignName = campaign.name;
            state.campaignDescription = campaign.description;
            state.campaignStartTime = campaign.start_time;
            state.campaignEndTime = campaign.end_time;
            state.tables = campaign.campaign_table;
            state.surveys = campaign.survey;
            state.removedEntries = {
                table: [],
                field: [],
                mapping: [],
                survey: [],
                question: [],
                option: [],
                trigger: [],
            };
        });
    },

    setCampaignUsingImportedConfig: (config: ExportedCampaignConfig) => {
        set((state) => {
            const walkQuestions = (questions: SurveyQuestion[]) => {
                questions.forEach((q) => {
                    state.removedEntries.question.push(q.id ?? -1);
                    q.survey_question_option.forEach((o) => {
                        state.removedEntries.option.push(o.id ?? -1);
                    });
                    q.survey_question_trigger.forEach((tr) => {
                        state.removedEntries.trigger.push(tr.id ?? -1);
                        walkQuestions(tr.survey_question);
                    });
                });
            };

            state.surveys.forEach((s) => {
                state.removedEntries.survey.push(s.id ?? -1);
                walkQuestions(s.survey_question);
            });

            state.tables.forEach((table) => {
                state.removedEntries.table.push(table.id ?? -1);
                table.campaign_table_field.forEach((field) => {
                    state.removedEntries.field.push(field.id ?? -1);
                    field.campaign_table_field_mapping.forEach((mapping) => {
                        state.removedEntries.mapping.push(mapping.id ?? -1);
                    });
                });
            });

            state.tables = config.tables;
            state.surveys = config.surveys;
        });
    },
})),
    {
        handleSet: (handleSet) =>
            debounce<typeof handleSet>(300, (state) => {
                handleSet(state);
            }, { atBegin: true })
    }
));

export default useCampaignConfigEdit;
