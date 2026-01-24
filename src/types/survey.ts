export interface Survey {
    id: number;
    campaign_id: number;
    title: string;
    description: string;
    schedule_method: ScheduleMethod;
    survey_question: SurveyQuestion[];
}

export interface SurveyQuestion {
    id: number;
    survey_id: number;
    question: string;
    answer_type: AnswerType;
    is_mandatory: boolean;
    trigger: Trigger | null;
    survey_question_option: SurveyQuestionOption[];
}

export interface SurveyQuestionOption {
    id: number;
    question_id: number;
    value: string;
    display: string;
    allow_free_response: boolean;
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
    | { op: 'Equal'; value: string }
    | { op: 'NotEqual'; value: string };

export type Operator =
    | { op: 'And'; a: Expression; b: Expression }
    | { op: 'Or'; a: Expression; b: Expression }
    | { op: 'Not'; a: Expression };

export interface Trigger {
    predicate: Expression;
    children: SurveyQuestion[];
}