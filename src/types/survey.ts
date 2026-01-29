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
// Expression<T> models the sealed Expression<T> hierarchy from the backend.
export type Predicate<T = number | string> =
    | { op: 'Equal'; value: T }
    | { op: 'NotEqual'; value: T };

export type ComparablePredicate =
    | { op: 'GreaterThan'; value: number }
    | { op: 'GreaterThanOrEqual'; value: number }
    | { op: 'LessThan'; value: number }
    | { op: 'LessThanOrEqual'; value: number };

export type SetPredicate = {
    op: 'Contains';
    value: number;
};

export type StringPredicate = {
    op: 'Empty';
};

// export type Operator<T = unknown> =
//     | { op: 'And'; a: Expression<T>; b: Expression<T> }
//     | { op: 'Or'; a: Expression<T>; b: Expression<T> }
//     | { op: 'Not'; a: Expression<T> };

export type Expression<T = number | string | number[]> =
    | Predicate<T>
    | (T extends number ? ComparablePredicate : never)
    | (T extends number[] ? SetPredicate : never)
    | (T extends string ? StringPredicate : never)
// | Operator<T>;

export interface Trigger {
    predicate: Expression;
    children: SurveyQuestion[];
}

export type OperatorType = 'Equal' | 'NotEqual' | 'GreaterThan' | 'GreaterThanOrEqual' | 'LessThan' | 'LessThanOrEqual' | 'Contains' | 'Empty' | 'Contains';

export type UnaryExpression = Exclude<Expression, StringPredicate>;