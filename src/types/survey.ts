export interface Survey {
    id: number;
    campaign_id: number;
    title: string;
    description: string;
    schedule_method: ScheduleMethod;
}

export interface SurveyQuestion {
    id: number;
    survey_id: number;
    campaign_id: number;
    question: string;
    answer_type: AnswerType;
    is_mandatory: boolean;
    trigger?: Trigger;
    options?: SurveyQuestionOption[];
}

export interface SurveyQuestionOption {
    id: number;
    question_id: number;
    value: string;
    display: string;
    is_free_answer_allowed: boolean;
}

export interface NewSurvey {
    id: number;
    campaign_id: number;
    title: string;
    description: string;
    schedule_method: ScheduleMethod;
    questions: SurveyQuestion[];
}

export type AnswerType = 'checkbox' | 'radio' | 'text' | 'number'


// Survey Schedule Methods
export type ESM = {
    minInterval: number,
    maxInterval: number,
    numSurvey: number,
}

export type Fixed = {
    timeOfDay: string[]
}

export type ScheduleMethod = ESM | Fixed | null;

// Survey question triggers
export type Expression = ValueComparator | Operator;

export type ValueComparator =
    | { type: 'Equal'; value: string }
    | { type: 'NotEqual'; value: string };

export type Operator =
    | { type: 'And'; a: ValueComparator; b: ValueComparator }
    | { type: 'Or'; a: ValueComparator; b: ValueComparator }
    | { type: 'Not'; a: ValueComparator };

export interface Trigger {
    predicate: Expression;
    children: SurveyQuestion[];
}