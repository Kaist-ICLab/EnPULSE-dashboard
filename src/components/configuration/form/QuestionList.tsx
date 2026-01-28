'use client'

import { Card, Select, Checkbox, Button, TextInput } from "flowbite-react";
import { AnswerType, SurveyQuestion, SurveyQuestionTrigger, Expression, ValueComparator, Operator } from "@/types/survey";

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import SwitchingTextInput from "./SwitchingTextInput";
import { useMemo } from "react";

const QuestionList: React.FC<{
    surveyIndex: number;
}> = ({ surveyIndex }) => {
    const { surveys } = useCampaignConfigEdit();
    const survey = surveys[surveyIndex];

    const flatQuestions = useMemo(() => {
        const recursiveCallback = (questionList: SurveyQuestion[], basePath: number[], depth: number): { question: SurveyQuestion, questionPath: number[], depth: number, totalQuestions: number }[] => {
            return questionList.flatMap((question, idx) => {
                const questionPath = [...basePath, idx];
                const directChildren = question.survey_question_trigger.map((t, tidx) => recursiveCallback(t.survey_question, [...basePath, idx, tidx], depth + 1)).flat();
                return [{ question, questionPath, depth, totalQuestions: questionList.length }, ...directChildren];
            });
        };
        return recursiveCallback(survey.survey_question || [], [], 0);
    }, [survey]);

    if (!survey) {
        return null;
    }

    if (flatQuestions.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-lg">No questions configured</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {flatQuestions.map(({ question, questionPath, depth, totalQuestions }) => {
                return <div key={questionPath.join('-')} className="flex w-full items-center gap-2">
                    {
                        Array(depth).fill(0).map((d, idx) => <div key={idx} className="w-4 h-4"></div>)
                    }
                    <QuestionCard
                        key={questionPath.join('-')}
                        surveyIndex={surveyIndex}
                        question={question}
                        questionPath={questionPath}
                        totalQuestions={totalQuestions}
                        depth={depth}
                    />
                </div>
            }
            )}
        </div>
    );
};

const QuestionCard: React.FC<{
    surveyIndex: number;
    question: SurveyQuestion;
    questionPath: number[];
    totalQuestions: number;
    depth: number;
}> = ({ surveyIndex, question, questionPath, totalQuestions, depth }) => {
    const {
        removeSurveyQuestion,
        updateSurveyQuestion,
        reorderSurveyQuestion,
        addSurveyQuestionOption,
        removeSurveyQuestionOption,
        updateSurveyQuestionOption,
        reorderSurveyQuestionOption,
        addSurveyQuestionTrigger,
        removeSurveyQuestionTrigger,
        updateSurveyQuestionTriggerExpression,
        addSurveyQuestion,
        surveys,
    } = useCampaignConfigEdit();

    const survey = surveys[surveyIndex];
    const allQuestions = survey?.survey_question || [];

    const answerTypeOptions: { value: AnswerType; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
    ];

    const needsOptions = question.answer_type === 'radio' || question.answer_type === 'checkbox';
    const options = question.survey_question_option || [];
    const pathKey = questionPath.join('-');

    return (
        <Card className="grow">
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => removeSurveyQuestion(surveyIndex, questionPath)}
                    ></span>
                    <div>
                        {depth > 0 ? (
                            <span className="text-xs text-blue-700 font-medium whitespace-nowrap ml-2">
                                {/* {questionPath.filter((_, idx) => idx % 2 === 1).map(v => `Trigger ${v + 1}`).join(' > ')} */}
                                {questionPath.filter((_, idx) => idx % 2 === 1).map(v => `Trigger ${v + 1}`).join(' > ')}
                            </span>
                        ) : null}
                        <SwitchingTextInput
                            value={question.question}
                            onChange={(value: string) => updateSurveyQuestion(surveyIndex, questionPath, { question: value })}
                            className="font-bold text-lg"
                        />
                    </div>

                </div>
                <div className="flex items-center gap-2 ml-2">
                    {questionPath[questionPath.length - 1] > 0 && (
                        <span
                            className="icon-[material-symbols--arrow-upward] w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={() => reorderSurveyQuestion(surveyIndex, questionPath, 'up')}
                            title="Move up"
                        ></span>
                    )}
                    {questionPath[questionPath.length - 1] < totalQuestions - 1 && (
                        <span
                            className="icon-[material-symbols--arrow-downward] w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={() => reorderSurveyQuestion(surveyIndex, questionPath, 'down')}
                            title="Move down"
                        ></span>
                    )}
                </div>
            </div>

            <div className="flex flex-row items-center gap-2">
                <label className="block text-sm font-medium text-gray-900">
                    Answer Type
                </label>
                <Select
                    value={question.answer_type}
                    onChange={(e) => {
                        const newAnswerType = e.target.value as AnswerType;
                        const updates: Partial<SurveyQuestion> = { answer_type: newAnswerType };

                        // Initialize options array if switching to radio/checkbox
                        if ((newAnswerType === 'radio' || newAnswerType === 'checkbox') && !question.survey_question_option) {
                            updates.survey_question_option = [];
                        }
                        // Clear options if switching away from radio/checkbox
                        else if (newAnswerType !== 'radio' && newAnswerType !== 'checkbox' && question.survey_question_option) {
                            updates.survey_question_option = undefined;
                        }

                        updateSurveyQuestion(surveyIndex, questionPath, updates);
                    }}
                    className="grow max-w-xs"
                    sizing="sm"
                >
                    {answerTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="flex flex-row items-center gap-2">
                <Checkbox
                    id={`mandatory-${pathKey}`}
                    checked={question.is_mandatory}
                    onChange={(e) => updateSurveyQuestion(surveyIndex, questionPath, { is_mandatory: e.target.checked })}
                />
                <label htmlFor={`mandatory-${pathKey}`} className="text-sm font-medium text-gray-900">
                    Mandatory
                </label>
            </div>

            {needsOptions && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-900">
                            Options
                        </label>
                        <Button
                            size="xs"
                            color="light"
                            onClick={() => addSurveyQuestionOption(surveyIndex, questionPath)}
                        >
                            <span className="icon-[material-symbols--add] w-4 h-4 mr-1"></span>
                            Add Option
                        </Button>
                    </div>
                    {options.length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">No options added</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <span
                                        className="icon-[humbleicons--times] w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500 flex-shrink-0"
                                        onClick={() => removeSurveyQuestionOption(surveyIndex, questionPath, optionIndex)}
                                        title="Remove option"
                                    ></span>
                                    <SwitchingTextInput
                                        value={option.display}
                                        onChange={(value: string) => updateSurveyQuestionOption(surveyIndex, questionPath, optionIndex, { display: value })}
                                        sizing="sm"
                                        className="flex-1"
                                    />
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {optionIndex > 0 && (
                                            <span
                                                className="icon-[material-symbols--arrow-upward] w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                                onClick={() => reorderSurveyQuestionOption(surveyIndex, questionPath, optionIndex, 'up')}
                                                title="Move up"
                                            ></span>
                                        )}
                                        {optionIndex < options.length - 1 && (
                                            <span
                                                className="icon-[material-symbols--arrow-downward] w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                                onClick={() => reorderSurveyQuestionOption(surveyIndex, questionPath, optionIndex, 'down')}
                                                title="Move down"
                                            ></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Triggers
                    </label>
                    <Button
                        size="xs"
                        color="light"
                        onClick={() => addSurveyQuestionTrigger(surveyIndex, questionPath)}
                    >
                        <span className="icon-[material-symbols--add] w-4 h-4 mr-1"></span>
                        Add Trigger
                    </Button>
                </div>
                {(!question.survey_question_trigger || question.survey_question_trigger.length === 0) ? (
                    <p className="text-sm text-gray-500 py-2">No triggers configured</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {question.survey_question_trigger.map((trigger, triggerIndex) => (
                            <TriggerCard
                                key={triggerIndex}
                                trigger={trigger}
                                triggerIndex={triggerIndex}
                                question={question}
                                allQuestions={allQuestions}
                                onRemove={() => removeSurveyQuestionTrigger(surveyIndex, questionPath, triggerIndex)}
                                onUpdateExpression={(expression) => updateSurveyQuestionTriggerExpression(surveyIndex, questionPath, triggerIndex, expression)}
                                onAddChildQuestion={() => addSurveyQuestion(surveyIndex, questionPath, triggerIndex)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};

const TriggerCard: React.FC<{
    trigger: SurveyQuestionTrigger;
    triggerIndex: number;
    question: SurveyQuestion;
    allQuestions: SurveyQuestion[];
    onRemove: () => void;
    onUpdateExpression: (expression: Expression) => void;
    onAddChildQuestion: () => void;
}> = ({ trigger, triggerIndex, question, allQuestions, onRemove, onUpdateExpression, onAddChildQuestion }) => {
    return (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-900">Trigger Condition #{triggerIndex + 1}</span>
                <span
                    className="icon-[humbleicons--times] w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={onRemove}
                    title="Remove trigger"
                ></span>
            </div>

            <ExpressionBuilder
                expression={trigger.expression as Expression | null | undefined}
                question={question}
                allQuestions={allQuestions}
                onChange={onUpdateExpression}
            />

            <div className="mt-4 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-blue-900">
                        Child Questions (shown when condition is met)
                    </label>
                    <Button
                        size="xs"
                        color="light"
                        onClick={onAddChildQuestion}
                    >
                        <span className="icon-[material-symbols--add] w-4 h-4 mr-1"></span>
                        Add Question
                    </Button>
                </div>
                {trigger.survey_question.length === 0 ?
                    <p className="text-sm text-gray-500 py-2">
                        No questions are triggered by this condition.
                    </p> : <div className="flex flex-col gap-2">
                        {trigger.survey_question.map((question, questionIndex) => (
                            <div key={questionIndex} className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">{question.question}</span>
                            </div>
                        ))}
                    </div>}

            </div>
        </div>
    );
};

const ExpressionBuilder: React.FC<{
    expression: Expression | null | undefined;
    question: SurveyQuestion;
    allQuestions: SurveyQuestion[];
    onChange: (expression: Expression) => void;
}> = ({ expression, question, allQuestions, onChange }) => {
    const isValueComparator = (expr: Expression): expr is ValueComparator => {
        return 'op' in expr && (expr.op === 'Equal' || expr.op === 'NotEqual') && 'value' in expr;
    };

    const isOperator = (expr: Expression): expr is Operator => {
        return 'op' in expr && (expr.op === 'And' || expr.op === 'Or' || expr.op === 'Not');
    };

    // Default to a simple Equal expression if null/undefined
    const currentExpression: Expression = expression || { op: 'Equal', value: '' };

    if (isValueComparator(currentExpression)) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">If answer is</span>
                <Select
                    value={currentExpression.op}
                    onChange={(e) => {
                        const newOp = e.target.value as 'Equal' | 'NotEqual';
                        onChange({ op: newOp, value: currentExpression.value } as ValueComparator);
                    }}
                    sizing="sm"
                    className="w-32"
                >
                    <option value="Equal">Equal to</option>
                    <option value="NotEqual">Not equal to</option>
                </Select>
                {question.answer_type === 'radio' || question.answer_type === 'checkbox' ? (
                    <Select
                        value={currentExpression.value}
                        onChange={(e) => {
                            if (e.target.value) {
                                onChange({ op: currentExpression.op, value: e.target.value } as ValueComparator);
                            }
                        }}
                        sizing="sm"
                        className="w-40"
                    >
                        {question.survey_question_option.map((option, idx) => (
                            <option key={idx} value={idx}>
                                {option.display}
                            </option>
                        ))}
                    </Select>
                ) : <TextInput
                    type={question.answer_type === 'number' ? 'number' : 'text'}
                    value={currentExpression.value}
                    onChange={(e) => onChange({ op: currentExpression.op, value: e.target.value } as ValueComparator)}
                    placeholder="Value"
                    sizing="sm"
                />
                }
            </div>
        );
    }

    if (isOperator(currentExpression)) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Select
                        value={currentExpression.op}
                        onChange={(e) => {
                            const newOp = e.target.value as 'And' | 'Or' | 'Not';
                            if (newOp === 'Not') {
                                onChange({ op: 'Not', a: currentExpression.a } as Operator);
                            } else {
                                onChange({ op: newOp, a: currentExpression.a, b: ('b' in currentExpression ? currentExpression.b : { op: 'Equal', value: '' }) } as Operator);
                            }
                        }}
                        sizing="sm"
                        className="w-24"
                    >
                        <option value="And">And</option>
                        <option value="Or">Or</option>
                        <option value="Not">Not</option>
                    </Select>
                    <Button
                        size="xs"
                        color="light"
                        onClick={() => {
                            const newExpr: ValueComparator = { op: 'Equal', value: '' };
                            if (currentExpression.op === 'Not') {
                                onChange({ op: currentExpression.op, a: newExpr } as Operator);
                            } else {
                                onChange({ op: currentExpression.op, a: newExpr, b: ('b' in currentExpression ? currentExpression.b : { op: 'Equal', value: '' }) } as Operator);
                            }
                        }}
                    >
                        Simplify
                    </Button>
                </div>
                <div className="ml-4 pl-4 border-l-2 border-blue-300">
                    <div className="mb-2">
                        <span className="text-xs text-gray-600 mb-1 block">Left side:</span>
                        <ExpressionBuilder
                            expression={currentExpression.a}
                            question={question}
                            allQuestions={allQuestions}
                            onChange={(newA) => {
                                if (currentExpression.op === 'Not') {
                                    onChange({ op: currentExpression.op, a: newA } as Operator);
                                } else {
                                    onChange({ op: currentExpression.op, a: newA, b: ('b' in currentExpression ? currentExpression.b : { op: 'Equal', value: '' }) } as Operator);
                                }
                            }}
                        />
                    </div>
                    {currentExpression.op !== 'Not' && 'b' in currentExpression && currentExpression.b && (
                        <div>
                            <span className="text-xs text-gray-600 mb-1 block">Right side:</span>
                            <ExpressionBuilder
                                expression={currentExpression.b}
                                question={question}
                                allQuestions={allQuestions}
                                onChange={(newB) => {
                                    onChange({ op: currentExpression.op, a: currentExpression.a, b: newB } as Operator);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default QuestionList;
