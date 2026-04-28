import { CampaignTable, CampaignTableField, FetchedCampaign, FieldRole, FieldType, RemovedEntries } from "@/types/campaign";
import { AnswerType, DeviceType, Expression, OperatorType, QuestionConfig, ScheduleMethod, Survey, SurveyQuestion, SurveyQuestionTrigger } from "@/types/survey";
import { CampaignTrigger, TriggerAction, TriggerActionKind, TriggerCondition, defaultAction, defaultDetection } from "@/types/trigger";
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
    campaign_trigger: CampaignTrigger[];
}

export type CampaignConfigEditState = ExportedCampaignConfig & {
    campaignId: number;
    campaignPassword: string;
    campaignName: string;
    campaignDescription: string;
    campaignStartTime: string;
    campaignEndTime: string;
    removedEntries: RemovedEntries;
    questionClipboard: QuestionClipboard | null;
}

type QuestionClipboard = Omit<SurveyQuestion, 'id' | 'survey_id' | 'triggered_by' | 'survey_question_trigger'>;

export type CampaignConfigEditActions = {
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
    updateTableDisplayName: (index: number, displayName: string) => void;
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
    updateSurveyDeviceType: (index: number, deviceType: DeviceType) => void;
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
    setFreeResponseConfig: (surveyIndex: number, questionPath: number[], allowFreeResponse: boolean, freeResponsePrefix: string) => void;
    setSurveyExpireAfterMs: (surveyIndex: number, expireAfterMs: number) => void;
    setNumberScaleRange: (surveyIndex: number, questionPath: number[], min: number, max: number) => void;
    setNumberScaleLabel: (surveyIndex: number, questionPath: number[], minLabel: string, maxLabel: string) => void;
    reorderSurveyQuestion: (surveyIndex: number, questionPath: number[], direction: 'up' | 'down') => void;

    addSurveyQuestionOption: (surveyIndex: number, questionPath: number[]) => void;
    removeSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number) => void;
    updateSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, value: string) => void;
    reorderSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, direction: 'up' | 'down') => void;

    addSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[]) => void;
    removeSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number) => void;
    updateSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[], triggerIndex: number, updates: Partial<SurveyQuestionTrigger>) => void;
    updateSurveyQuestionTriggerExpression: (surveyIndex: number, questionPath: number[], triggerIndex: number, expression: Expression) => void;

    // Question clipboard. `copy` snapshots a question (and its trigger
    // subtree). `paste` REPLACES the question at `targetQuestionPath` with a
    // fresh clone of the clipboard — every id reset to -1 — and queues the
    // replaced question's subtree for deletion on save. Always paste a new
    // entity, never re-parent the live one — that would break the
    // survey_question.triggered_by single-parent FK.
    copySurveyQuestion: (surveyIndex: number, questionPath: number[]) => void;
    pasteSurveyQuestion: (surveyIndex: number, targetQuestionPath: number[]) => void;

    // Sensor-driven campaign triggers (separate from in-survey conditional branching above).
    addTrigger: () => void;
    removeTrigger: (index: number) => void;
    updateTriggerName: (index: number, name: string) => void;
    setTriggerCondition: (index: number, condition: TriggerCondition) => void;
    addTriggerAction: (triggerIndex: number, kind: TriggerActionKind) => void;
    removeTriggerAction: (triggerIndex: number, actionIndex: number) => void;
    updateTriggerAction: (triggerIndex: number, actionIndex: number, action: TriggerAction) => void;

    setCampaignUsingImportedConfig: (config: ExportedCampaignConfig) => void;
}

export type CampaignConfigEditStore = CampaignConfigEditState & CampaignConfigEditActions;

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
        case 'binary':
        case 'numberscale':
            return 'number';
        case 'checkbox':
            return op === 'Contains' ? 'number' : 'array';
        default:
            return null;
    }
}

function checkExpressionValidity(prevAnswerType: AnswerType, answerType: AnswerType, expression: Expression): Expression {
    if (!expression) return expression;

    if (answerType === 'text' && !['Empty', 'Equal', 'NotEqual'].includes(expression.op)) {
        return { op: 'Equal', value: '' } as Expression;
    }
    if ((answerType === 'number' || answerType === 'radio' || answerType === 'numberscale') && !['Equal', 'NotEqual', 'GreaterThan', 'GreaterThanOrEqual', 'LessThan', 'LessThanOrEqual'].includes(expression.op)) {
        return { op: 'Equal', value: 0 } as Expression;
    }
    if (answerType === 'binary' && !['Equal', 'NotEqual'].includes(expression.op)) {
        return { op: 'Equal', value: 0 } as Expression;
    }
    if (answerType === 'checkbox' && !['Equal', 'NotEqual', 'Contains'].includes(expression.op)) {
        return { op: 'Equal', value: [] } as Expression;
    }

    const prevValueType = getValueType(prevAnswerType, expression.op);
    const newValueType = getValueType(answerType, expression.op);
    if (newValueType !== prevValueType) {
        return { op: expression.op, value: newValueType === 'number' ? 0 : newValueType === 'string' ? '' : [0] } as Expression;
    }

    return expression;
}

function emptyRemovedEntries(): RemovedEntries {
    return {
        table: [],
        field: [],
        mapping: [],
        survey: [],
        question: [],
        trigger: [],
        campaign_trigger: [],
    };
}

// Read options from a question's config, when the answer_type carries them
// (radio/checkbox). Returns undefined for types that don't have options.
function configOptions(q: SurveyQuestion): string[] | undefined {
    const cfg = q.config as { options?: string[] } | null | undefined;
    return cfg?.options;
}

// Build a fresh QuestionConfig for a given answer_type when the user toggles
// type. Drops fields that don't apply and seeds defaults for types that need
// them.
function defaultConfigForType(answerType: AnswerType): QuestionConfig {
    if (answerType === 'radio' || answerType === 'checkbox') {
        return { options: [], allowFreeResponse: false, freeResponsePrefix: '' };
    }
    if (answerType === 'numberscale') {
        return { min: 0, max: 10, minLabel: '', maxLabel: '' };
    }
    return {};
}

function getDefaultState(): CampaignConfigEditState {
    return {
        campaignId: -1,
        campaignName: "",
        campaignDescription: "",
        campaignPassword: "",
        campaignStartTime: dayjs().format(DATE_FORMAT),
        campaignEndTime: dayjs().add(1, 'day').format(DATE_FORMAT),
        tables: [],
        surveys: [],
        campaign_trigger: [],
        removedEntries: emptyRemovedEntries(),
        questionClipboard: null,
    };
}

function getStateFromCampaign(campaign: FetchedCampaign): CampaignConfigEditState {
    return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        campaignDescription: campaign.description,
        campaignStartTime: campaign.start_time,
        campaignEndTime: campaign.end_time,
        campaignPassword: "",
        tables: campaign.campaign_table,
        surveys: campaign.survey,
        campaign_trigger: campaign.campaign_trigger,
        removedEntries: emptyRemovedEntries(),
        questionClipboard: null,
    };
}


function cloneQuestionAsNew(q: QuestionClipboard): QuestionClipboard {
    return {
        answer_type: q.answer_type,
        config: q.config,
        question: q.question,
        is_mandatory: q.is_mandatory,
    };
}

export const createCampaignConfigEditStore = (
    campaign?: FetchedCampaign,
) => {
    const initialState = campaign ? getStateFromCampaign(campaign) : getDefaultState();

    return create<CampaignConfigEditStore>()(temporal(immer((set) => ({
        ...initialState,

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

        updateTableDisplayName: (index: number, displayName: string) => {
            set((state) => {
                state.tables[index].display_name = displayName;
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
                    device_type: DeviceType.Phone,
                    schedule_method: null,
                    survey_question: [],
                });
            });
        },

        removeSurvey: (index: number) => {
            set((state) => {
                state.removedEntries.survey.push(state.surveys[index].id ?? -1);
                state.surveys.splice(index, 1);

                // Keep trigger surveyIndex references consistent with the new array.
                state.campaign_trigger.forEach((t) => {
                    t.actions.forEach((a) => {
                        if (a.kind === 'broadcast') return;
                        if (a.surveyIndex === index) a.surveyIndex = -1;
                        else if (a.surveyIndex > index) a.surveyIndex -= 1;
                    });
                });
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

        updateSurveyDeviceType: (index: number, deviceType: DeviceType) => {
            set((state) => {
                const survey = state.surveys[index];
                if (!survey) return;
                if (survey.device_type === deviceType) return;

                if (deviceType === DeviceType.Watch) {
                    const flattened: SurveyQuestion[] = [];
                    const walk = (questions: SurveyQuestion[]) => {
                        for (const q of questions) {
                            const triggers = q.survey_question_trigger ?? [];
                            for (const trigger of triggers) {
                                state.removedEntries.trigger.push(trigger.id ?? -1);
                            }
                            const children = triggers.flatMap((t) => t.survey_question ?? []);
                            q.survey_question_trigger = [];
                            q.triggered_by = null;
                            flattened.push(q);
                            walk(children);
                        }
                    };
                    walk(survey.survey_question);
                    survey.survey_question = flattened;
                }
                // Phone branch: binary and numberscale are now cross-device, so
                // there's no auto-conversion. Triggers stay as-is.

                survey.device_type = deviceType;
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
                    config: defaultConfigForType('text'),
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

                Object.assign(question, updates);

                if (updates.answer_type && updates.answer_type !== prevAnswerType) {
                    // Reshape config for the new type. Existing options/min/max
                    // are dropped; if the user is just toggling between
                    // option-bearing types they'll re-author.
                    question.config = defaultConfigForType(updates.answer_type);
                }

                question.survey_question_trigger?.forEach((trigger) => {
                    trigger.expression = checkExpressionValidity(
                        prevAnswerType,
                        question.answer_type,
                        trigger.expression as Expression
                    );
                });
            });
        },

        setFreeResponseConfig: (surveyIndex: number, questionPath: number[], allowFreeResponse: boolean, freeResponsePrefix: string) => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;
                question.config = { ...(question.config as object), allowFreeResponse, freeResponsePrefix } as QuestionConfig;
            });
        },

        setSurveyExpireAfterMs: (surveyIndex: number, expireAfterMs: number) => {
            set((state) => {
                state.surveys[surveyIndex].expire_after_ms = expireAfterMs;
            });
        },

        setNumberScaleRange: (surveyIndex: number, questionPath: number[], min: number, max: number) => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;
                question.config = { ...(question.config as object), min, max } as QuestionConfig;
            });
        },

        setNumberScaleLabel: (surveyIndex: number, questionPath: number[], minLabel: string, maxLabel: string) => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;
                question.config = { ...(question.config as object), minLabel, maxLabel } as QuestionConfig;
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
                const options = configOptions(question);
                if (!options) return;

                options.push(`Option ${options.length + 1}`);
            });
        },

        removeSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number) => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;
                const options = configOptions(question);
                if (!options) return;

                options.splice(optionIndex, 1);
            });
        },

        updateSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, value: string) => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;
                const options = configOptions(question);
                if (!options) return;

                options[optionIndex] = value;
            });
        },

        reorderSurveyQuestionOption: (surveyIndex: number, questionPath: number[], optionIndex: number, direction: 'up' | 'down') => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;
                const options = configOptions(question);
                if (!options) return;

                const newIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1;
                if (newIndex < 0 || newIndex >= options.length) {
                    return;
                }

                [options[optionIndex], options[newIndex]] = [options[newIndex], options[optionIndex]];
            });
        },

        addSurveyQuestionTrigger: (surveyIndex: number, questionPath: number[]) => {
            set((state) => {
                const question = getQuestionFromPath(state.surveys[surveyIndex], questionPath);
                if (!question) return;

                const newTrigger: SurveyQuestionTrigger = {
                    id: -1,
                    question_id: -1,
                    expression: { op: 'Equal', value: 0 } as Expression,
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

        addTrigger: () => {
            set((state) => {
                state.campaign_trigger.push({
                    campaign_id: state.campaignId,
                    name: `Trigger ${state.campaign_trigger.length + 1}`,
                    condition: defaultDetection(),
                    actions: [],
                });
            });
        },

        removeTrigger: (index: number) => {
            set((state) => {
                const removed = state.campaign_trigger.splice(index, 1)[0];
                if (removed?.id !== undefined && removed.id !== -1) {
                    state.removedEntries.campaign_trigger.push(removed.id);
                }
            });
        },

        updateTriggerName: (index: number, name: string) => {
            set((state) => {
                if (!state.campaign_trigger[index]) return;
                state.campaign_trigger[index].name = name;
            });
        },

        setTriggerCondition: (index: number, condition: TriggerCondition) => {
            set((state) => {
                if (!state.campaign_trigger[index]) return;
                state.campaign_trigger[index].condition = condition;
            });
        },

        addTriggerAction: (triggerIndex: number, kind: TriggerActionKind) => {
            set((state) => {
                if (!state.campaign_trigger[triggerIndex]) return;
                state.campaign_trigger[triggerIndex].actions.push(defaultAction(kind));
            });
        },

        removeTriggerAction: (triggerIndex: number, actionIndex: number) => {
            set((state) => {
                if (!state.campaign_trigger[triggerIndex]) return;
                state.campaign_trigger[triggerIndex].actions.splice(actionIndex, 1);
            });
        },

        updateTriggerAction: (triggerIndex: number, actionIndex: number, action: TriggerAction) => {
            set((state) => {
                if (!state.campaign_trigger[triggerIndex]?.actions[actionIndex]) return;
                state.campaign_trigger[triggerIndex].actions[actionIndex] = action;
            });
        },

        updateSurveyQuestionTriggerExpression: (surveyIndex: number, questionPath: number[], triggerIndex: number, expression: Expression) => {
            set((state) => {
                const trigger = getTriggerFromPath(state.surveys[surveyIndex], questionPath, triggerIndex);
                if (!trigger) return;
                trigger.expression = expression;
            });
        },

        copySurveyQuestion: (surveyIndex: number, questionPath: number[]) => {
            set((state) => {
                const survey = state.surveys[surveyIndex];
                if (!survey) return;
                const source = getQuestionFromPath(survey, questionPath);
                if (!source) return;
                state.questionClipboard = cloneQuestionAsNew(source);
            });
        },

        pasteSurveyQuestion: (surveyIndex: number, targetQuestionPath: number[]) => {
            set((state) => {
                if (!state.questionClipboard) return;
                const survey = state.surveys[surveyIndex];
                if (!survey) return;
                if (targetQuestionPath.length === 0) return;

                const { arr, idx } = getQuestionArrayAndIndexFromPath(survey, targetQuestionPath);
                if (!arr || idx < 0 || idx >= arr.length) return;

                // Queue the replaced question and its entire trigger subtree
                // for deletion on save. The fresh clone has id=-1 throughout
                // and will be inserted as a new row chain.
                const collectIds = (q: SurveyQuestion) => {
                    if (q.id != null && q.id !== -1) state.removedEntries.question.push(q.id);
                    q.survey_question_trigger.forEach(t => {
                        if (t.id != null && t.id !== -1) state.removedEntries.trigger.push(t.id);
                        t.survey_question.forEach(collectIds);
                    });
                };
                collectIds(arr[idx]);

                // Clone the clipboard so repeated pastes don't share references.
                arr[idx] = { ...cloneQuestionAsNew(state.questionClipboard), id: -1, survey_id: -1, triggered_by: null, survey_question_trigger: [] };
            });
        },

        setCampaignUsingImportedConfig: (config: ExportedCampaignConfig) => {
            set((state) => {
                const walkQuestions = (questions: SurveyQuestion[]) => {
                    questions.forEach((q) => {
                        state.removedEntries.question.push(q.id ?? -1);
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

                state.campaign_trigger.forEach((t) => {
                    state.removedEntries.campaign_trigger.push(t.id ?? -1);
                });

                state.tables = config.tables;
                state.surveys = config.surveys;
                state.campaign_trigger = config.campaign_trigger ?? [];
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
}
