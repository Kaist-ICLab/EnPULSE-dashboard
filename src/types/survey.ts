import { Database } from "@/lib/schema";

export type Survey = Database['public']['Tables']['survey']['Insert'] & {
    schedule_method: ScheduleMethod;
    survey_question: SurveyQuestion[];
}

export type SurveyQuestion = Database['public']['Tables']['survey_question']['Insert'] & {
    survey_question_option: SurveyQuestionOption[];
    survey_question_trigger: SurveyQuestionTrigger[];
}

export type SurveyQuestionOption = Database['public']['Tables']['survey_question_option']['Insert']

export type SurveyQuestionTrigger = Database['public']['Tables']['survey_question_trigger']['Insert'] & {
    survey_question: SurveyQuestion[];
}


export type FetchedSurveyTrigger = Required<SurveyQuestionTrigger> & {
    survey_question: FetchedSurveyQuestion[];
}

export type FetchedSurveyQuestion = Required<SurveyQuestion> & {
    survey_question_option: Required<SurveyQuestionOption>[];
    survey_question_trigger: FetchedSurveyTrigger[];
}

export type FetchedSurvey = Required<Survey> & {
    survey_question: FetchedSurveyQuestion[];
}

export type AnswerType = Database['public']['Enums']['survey_question_type']

// Survey Schedule Methods
export type ESM = {
    minInterval: number,
    maxInterval: number,
    startOfDay: number,
    endOfDay: number,
    numSurvey: number,
}

export type Fixed = {
    timeOfDay: number[]
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