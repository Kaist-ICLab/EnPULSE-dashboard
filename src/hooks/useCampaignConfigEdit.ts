import { CampaignTableField, FieldRole, FieldType, NewCampaignTable } from "@/types/campaign";
import { NewSurvey, ScheduleMethod, SurveyQuestion, SurveyQuestionOption } from "@/types/survey";
import { create } from "zustand";
import { templateTable } from "./create/sensorTemplate";

interface PassiveSensingConfig {
    startTime: number; // milliseconds since midnight
    endTime: number; // milliseconds since midnight
}

interface CampaignConfigEditState {
    tables: NewCampaignTable[];
    availableTemplateTables: NewCampaignTable[];
    passiveSensingConfig: PassiveSensingConfig;
    surveys: NewSurvey[];
    setDailyCountMax: (index: number, value: number) => void;
    addTable: (name: string, description: string, fields?: CampaignTableField[]) => void;
    addNewTemplateTable: (idx: number) => void;
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
    tables: [],
    availableTemplateTables: templateTable,
    passiveSensingConfig: {
        startTime: 0, // 00:00 in milliseconds
        endTime: 23 * 60 * 60 * 1000 + 59 * 60 * 1000, // 23:59 in milliseconds
    },
    surveys: [],

    setDailyCountMax: (index: number, value: number) => {
        set((state) => {
            const newTables = [...state.tables];
            newTables.splice(index, 1, { ...state.tables[index], daily_count_max: value });
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    addTable: (name: string, description: string, fields: CampaignTableField[] = []) => {
        set((state) => {
            const newTables = [...state.tables, { id: -1, campaign_id: -1, name, description, daily_count_max: 0, fields, is_custom: true }];
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    addNewTemplateTable: (idx: number) => {
        set((state) => {
            const availableTables = templateTable.filter(t => !state.tables.some(t2 => t2.name == t.name));
            const newTables = [...state.tables, structuredClone(availableTables[idx])];
            return {
                tables: newTables,
                availableTemplateTables: availableTables
            };
        });
    },

    removeTable: (index: number) => {
        set((state) => {
            const newTables = [...state.tables];
            newTables.splice(index, 1);
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    addField: (tableIndex: number, field: CampaignTableField) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const table = newTables[tableIndex];
            table.fields.forEach((v, i) => { v.id = i });
            field.id = table.fields.length;
            newTables[tableIndex].fields.push(field);
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    removeField: (tableIndex: number, fieldIdx: number) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            newTables[tableIndex].fields.splice(fieldIdx, 1);
            newTables[tableIndex].fields.forEach((v, i) => { v.id = i });
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    setField: (tableIndex: number, fieldIdx: number, fieldName: 'role' | 'type', fieldValue: FieldRole | FieldType) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            const field = newTables[tableIndex].fields[fieldIdx];
            if (fieldName == 'role') {
                newTables[tableIndex].fields[fieldIdx] = { ...field, field_role: fieldValue as FieldRole };
            } else {
                newTables[tableIndex].fields[fieldIdx] = { ...field, field_type: fieldValue as FieldType };
            }
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
            };
        });
    },

    setFieldMapping: (tableIndex: number, fieldIdx: number, mapping: { value: string, display: string }[]) => {
        set((state) => {
            const newTables = structuredClone(state.tables);
            newTables[tableIndex].fields[fieldIdx] = { ...newTables[tableIndex].fields[fieldIdx], mapping };
            return {
                tables: newTables,
                availableTemplateTables: templateTable.filter(t => !newTables.some(t2 => t2.name == t.name))
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
            const newSurvey: NewSurvey = {
                id: -1,
                campaign_id: -1,
                title: `Survey ${state.surveys.length + 1}`,
                description: "",
                schedule_method: null,
                questions: [],
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
                id: -1, // Temporary ID
                survey_id: -1, // Temporary ID
                campaign_id: -1, // Temporary ID
                question: `Question ${newSurveys[surveyIndex].questions.length + 1}`,
                answer_type: 'text',
                is_mandatory: false,
            };
            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                questions: [...newSurveys[surveyIndex].questions, newQuestion],
            };
            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestion: (surveyIndex: number, questionIndex: number) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                questions: newSurveys[surveyIndex].questions.filter((_, i) => i !== questionIndex),
            };
            return { surveys: newSurveys };
        });
    },

    updateSurveyQuestion: (surveyIndex: number, questionIndex: number, updates: Partial<SurveyQuestion>) => {
        set((state) => {
            const newSurveys = [...state.surveys];
            const newQuestions = [...newSurveys[surveyIndex].questions];
            newQuestions[questionIndex] = { ...newQuestions[questionIndex], ...updates };
            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                questions: newQuestions,
            };
            return { surveys: newSurveys };
        });
    },

    reorderSurveyQuestion: (surveyIndex: number, questionIndex: number, direction: 'up' | 'down') => {
        set((state) => {
            const newSurveys = [...state.surveys];
            const questions = [...newSurveys[surveyIndex].questions];
            const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;

            if (newIndex < 0 || newIndex >= questions.length) {
                return state; // Can't move beyond boundaries
            }

            // Swap questions
            [questions[questionIndex], questions[newIndex]] = [questions[newIndex], questions[questionIndex]];

            newSurveys[surveyIndex] = {
                ...newSurveys[surveyIndex],
                questions: questions,
            };
            return { surveys: newSurveys };
        });
    },

    addSurveyQuestionOption: (surveyIndex: number, questionIndex: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].questions[questionIndex];
            if (!question.options) {
                question.options = [];
            }
            const newOption: SurveyQuestionOption = {
                id: -1, // Temporary ID
                question_id: question.id,
                value: `option_${question.options.length + 1}`,
                display: `Option ${question.options.length + 1}`,
                is_free_answer_allowed: false,
            };
            question.options.push(newOption);
            return { surveys: newSurveys };
        });
    },

    removeSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].questions[questionIndex];
            if (question.options) {
                question.options = question.options.filter((_, i) => i !== optionIndex);
            }
            return { surveys: newSurveys };
        });
    },

    updateSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number, updates: Partial<SurveyQuestionOption>) => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].questions[questionIndex];
            if (question.options && question.options[optionIndex]) {
                question.options[optionIndex] = { ...question.options[optionIndex], ...updates };
            }
            return { surveys: newSurveys };
        });
    },

    reorderSurveyQuestionOption: (surveyIndex: number, questionIndex: number, optionIndex: number, direction: 'up' | 'down') => {
        set((state) => {
            const newSurveys = structuredClone(state.surveys);
            const question = newSurveys[surveyIndex].questions[questionIndex];
            if (!question.options) {
                return state;
            }

            const options = [...question.options];
            const newIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1;

            if (newIndex < 0 || newIndex >= options.length) {
                return state; // Can't move beyond boundaries
            }

            // Swap options
            [options[optionIndex], options[newIndex]] = [options[newIndex], options[optionIndex]];

            question.options = options;
            return { surveys: newSurveys };
        });
    },

    reset: () => {
        set({
            tables: [],
            availableTemplateTables: templateTable,
            passiveSensingConfig: {
                startTime: 0,
                endTime: 23 * 60 * 60 * 1000 + 59 * 60 * 1000,
            },
            surveys: [],
        });
    }
}));

export default useCampaignConfigEdit;
