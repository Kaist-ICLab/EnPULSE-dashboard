import { Database } from "@/lib/schema";

export type AnswerType = Database["public"]["Enums"]["survey_question_type"];

export enum DeviceType {
  Phone = 0,
  Watch = 1,
}

// Survey question triggers
// Expression<T> models the sealed Expression<T> hierarchy from the backend.
export type Predicate<T = number | string> = { op: "Equal"; value: T } | { op: "NotEqual"; value: T };

export type ComparablePredicate =
  | { op: "GreaterThan"; value: number }
  | { op: "GreaterThanOrEqual"; value: number }
  | { op: "LessThan"; value: number }
  | { op: "LessThanOrEqual"; value: number };

export type SetPredicate = {
  op: "Contains";
  value: number;
};

export type StringPredicate = {
  op: "Empty";
};

export type Expression<T = number | string | number[]> =
  | Predicate<T>
  | (T extends number ? ComparablePredicate : never)
  | (T extends number[] ? SetPredicate : never)
  | (T extends string ? StringPredicate : never);

export type OperatorType =
  "Equal" | "NotEqual" | "GreaterThan" | "GreaterThanOrEqual" | "LessThan" | "LessThanOrEqual" | "Contains" | "Empty";

export type UnaryExpression = Exclude<Expression, StringPredicate>;

// Per-question config (replaces survey_question_option only — the trigger
// table stays normalized).
//
// - text / number / binary: empty config (binary's Yes/No is intrinsic to the type)
// - radio / checkbox: options[]
// - numberscale: min/max/step (replaces the old options array of stringified ints)
export type OptionQuestionConfig = { options: string[]; allowFreeResponse: boolean; freeResponsePrefix: string };
export type NumberScaleQuestionConfig = { min: number; max: number; minLabel: string; maxLabel: string };
export type QuestionConfig = Record<string, never> | OptionQuestionConfig | NumberScaleQuestionConfig;

export type Survey = Database["public"]["Tables"]["survey"]["Insert"] & {
  survey_question: SurveyQuestion[];
};

export type SurveyQuestion = Omit<Database["public"]["Tables"]["survey_question"]["Insert"], "config"> & {
  config: QuestionConfig;
  survey_question_trigger: SurveyQuestionTrigger[];
};

export type SurveyQuestionTrigger = Database["public"]["Tables"]["survey_question_trigger"]["Insert"] & {
  survey_question: SurveyQuestion[];
};

export type FetchedSurveyTrigger = Required<Omit<SurveyQuestionTrigger, "survey_question">> & {
  survey_question: FetchedSurveyQuestion[];
};

export type FetchedSurveyQuestion = Required<Omit<SurveyQuestion, "config" | "survey_question_trigger">> & {
  config: QuestionConfig;
  survey_question_trigger: FetchedSurveyTrigger[];
};

export type FetchedSurvey = Required<Omit<Survey, "survey_question">> & {
  survey_question: FetchedSurveyQuestion[];
};
