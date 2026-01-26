import { CampaignTable, CampaignTableField, FieldRole, FieldType } from "@/types/campaign";
import { ScheduleMethod, Survey, SurveyQuestion, SurveyQuestionOption } from "@/types/survey";
import { create } from "zustand";

interface PassiveSensingConfig {
    startTime: number; // milliseconds since midnight
    endTime: number; // milliseconds since midnight
}

interface CampaignConfigEditState {
    campaignName: string;
    tables: CampaignTable[];
    passiveSensingConfig: PassiveSensingConfig;
    surveys: Survey[];
    setCampaignName: (name: string) => void;
    setDailyCountMax: (index: number, value: number) => void;
    addTable: (table: CampaignTable) => void;
    removeTable: (index: number) => void;
    addField: (tableIndex: number, field: CampaignTableField) => void;
    removeField: (tableIndex: number, fieldIdx: number) => void;
    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => void;
    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => void;
    setPassiveSensingStartTime: (timeMs: number) => void;
    setPassiveSensingEndTime: (timeMs: number) => void;
    addSurvey: () => void;
    removeSurvey: (index: number) => void;
    updateSurveyTitle: (index: number, title: string) => void;
    updateSurveyDescription: (index: number, description: string) => void;
    updateSurveyScheduleMethod: (index: number, scheduleMethod: ScheduleMethod) => void;
    addSurveyQuestion: (surveyIndex: number) => void;
    removeSurveyQuestion: (surveyIndex: number, questionIndex: number) => void;
    updateSurveyQuestion: (surveyIndex: number, questionIndex: number, updates: Partial<SurveyQuestion>) => void;
    reorderSurveyQuestion: (surveyIndex: number, questionIndex: number, direction: 'up' | 'down') => void;
    addSurveyQuestionOption: (surveyIndex: number, questionIndex: number) => void;
    removeSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number) => void;
    updateSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number, updates: Partial<SurveyQuestionOption>) => void;
    reorderSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number, direction: 'up' | 'down') => void;
    reset: () => void;
}

const useCampaignConfigEdit = create<CampaignConfigEditState>((set) => ({
    campaignName: "",
    tables: [],
    passiveSensingConfig: {
        startTime: 0, // 00:00 in milliseconds
        endTime: 23 * 60 * 60 * 1000 + 59 * 60 * 1000, // 23:59 in milliseconds
    },
    surveys: [],

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
            newTables.splice(index, 1);
            return {
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
            newTables[tableIndex].campaign_table_field.splice(fieldIdx, 1);

            return {
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
            newTables[tableIndex].campaign_table_field[fieldIdx] = { ...newTables[tableIndex].campaign_table_field[fieldIdx], campaign_table_field_mapping: mapping.map(m => ({ value: m.value, display: m.display, field_id: -1 })) };
            return {
                tables: newTables,
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
            newSurveys.splice(index, 1);
            return { surveys: newSurveys };
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

    addSurveyQuestion: (surveyIndex: number) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            const newQuestion: SurveyQuestion = {
                survey_id: -1, // Temporary ID
                triggered_by: null,
                question: `Question ${newSurveys[surveyIndex].survey_question.length + 1}`,
                answer_type: 'text',
                is_mandatory: false,
                survey_question_option: [],
                survey_question_trigger: [],
            };
            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                survey_question: [...newSurveys[surveyIndex].survey_question, newQuestion],
            };
            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestion: (surveyIndex: number, questionIndex: number) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                survey_question: newSurveys[surveyIndex].survey_question.filter((_, i) => i !== questionIndex),
            };
            return { surveys: newSurveys };
        });
    },

    updateSurveyQuestion: (surveyIndex: number, questionIndex: number, updates: Partial<SurveyQuestion>) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            const newQuestions = [...newSurveys[surveyIndex].survey_question];
            newQuestions[questionIndex] = { ...newQuestions[questionIndex], ...updates };
            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                survey_question: newQuestions,
            };
            return { surveys: newSurveys };
        });
    },

    reorderSurveyQuestion: (surveyIndex: number, questionIndex: number, direction: 'up' | 'down') => {
        set((state) => {
            const newSurveys = [...state.surveys];
            const questions = [...newSurveys[surveyIndex].survey_question];
            const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;

            if (newIndex < 0 || newIndex >= questions.length) {
                return state; // Can't move beyond boundaries
            }

            // Swap questions
            [questions[questionIndex], questions[newIndex]] = [questions[newIndex], questions[questionIndex]];

            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                survey_question: questions,
            };
            return { surveys: newSurveys };
        });
    },

    addSurveyQuestionOption: (surveyIndex: number, questionIndex: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].survey_question[questionIndex];
            const newOption: SurveyQuestionOption = {
                question_id: -1,
                value: `option_${question.survey_question_option.length + 1}`,
                display: `Option ${question.survey_question_option.length + 1}`,
                allow_free_response: false,
            };
            question.survey_question_option.push(newOption);
            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].survey_question[questionIndex];
            question.survey_question_option = question.survey_question_option.filter((_, i) => i !== optionIndex);

            return { surveys: newSurveys };
        });
    },

    updateSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number, updates: Partial<SurveyQuestionOption>) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].survey_question[questionIndex];
            question.survey_question_option[optionIndex] = { ...question.survey_question_option[optionIndex], ...updates };
            return { surveys: newSurveys };
        });
    },

    reorderSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number, direction: 'up' | 'down') => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].survey_question[questionIndex];
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

    reset: () => {
        set({
            campaignName: "",
            tables: [],
            passiveSensingConfig: {
                startTime: 0,
                endTime: 23 * 60 * 60 * 1000 + 59 * 60 * 1000,
            },
            surveys: [],
        });
    }
}));

export default useCampaignConfigEdit;
