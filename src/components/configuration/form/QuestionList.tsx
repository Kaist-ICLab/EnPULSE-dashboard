'use client'

import { Card, Select, Checkbox, Button, TextInput } from "flowbite-react";
import { AnswerType, SurveyQuestion, SurveyQuestionOption, SurveyQuestionTrigger, Expression, ValueComparator, Operator } from "@/types/survey";

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import SwitchingTextInput from "./SwitchingTextInput";

interface QuestionListProps {
    surveyIndex: number;
}

const QuestionList: React.FC<QuestionListProps> = ({ surveyIndex }) => {
    const {
        surveys,
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
        addTriggerChildQuestion,
        removeTriggerChildQuestion,
        updateTriggerChildQuestion,
        reorderTriggerChildQuestion
    } = useCampaignConfigEdit();
    const survey = surveys[surveyIndex];

    if (!survey) {
        return null;
    }

    const questions = survey.survey_question || [];

    if (questions.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-lg">No questions configured</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {questions.map((question, questionIndex) => (
                <QuestionCard
                    key={questionIndex}
                    question={question}
                    questionIndex={questionIndex}
                    surveyIndex={surveyIndex}
                    totalQuestions={questions.length}
                    allQuestions={questions}
                    onRemove={() => removeSurveyQuestion(surveyIndex, questionIndex)}
                    onUpdate={(updates) => updateSurveyQuestion(surveyIndex, questionIndex, updates)}
                    onMoveUp={() => reorderSurveyQuestion(surveyIndex, questionIndex, 'up')}
                    onMoveDown={() => reorderSurveyQuestion(surveyIndex, questionIndex, 'down')}
                    onAddOption={() => addSurveyQuestionOption(surveyIndex, questionIndex)}
                    onRemoveOption={(optionIndex) => removeSurveyQuestionOption(surveyIndex, questionIndex, optionIndex)}
                    onUpdateOption={(optionIndex, updates) => updateSurveyQuestionOption(surveyIndex, questionIndex, optionIndex, updates)}
                    onMoveOptionUp={(optionIndex) => reorderSurveyQuestionOption(surveyIndex, questionIndex, optionIndex, 'up')}
                    onMoveOptionDown={(optionIndex) => reorderSurveyQuestionOption(surveyIndex, questionIndex, optionIndex, 'down')}
                    onAddTrigger={() => addSurveyQuestionTrigger(surveyIndex, questionIndex)}
                    onRemoveTrigger={(triggerIndex) => removeSurveyQuestionTrigger(surveyIndex, questionIndex, triggerIndex)}
                    onUpdateTriggerExpression={(triggerIndex, expression) => updateSurveyQuestionTriggerExpression(surveyIndex, questionIndex, triggerIndex, expression)}
                    onAddTriggerChildQuestion={(triggerIndex) => addTriggerChildQuestion(surveyIndex, questionIndex, triggerIndex)}
                    onRemoveTriggerChildQuestion={(triggerIndex, childQuestionIndex) => removeTriggerChildQuestion(surveyIndex, questionIndex, triggerIndex, childQuestionIndex)}
                    onUpdateTriggerChildQuestion={(triggerIndex, childQuestionIndex, updates) => updateTriggerChildQuestion(surveyIndex, questionIndex, triggerIndex, childQuestionIndex, updates)}
                    onReorderTriggerChildQuestion={(triggerIndex, childQuestionIndex, direction) => reorderTriggerChildQuestion(surveyIndex, questionIndex, triggerIndex, childQuestionIndex, direction)}
                />
            ))}
        </div>
    );
};

const QuestionCard: React.FC<{
    question: SurveyQuestion;
    questionIndex: number;
    surveyIndex: number;
    totalQuestions: number;
    allQuestions: SurveyQuestion[];
    onRemove: () => void;
    onUpdate: (updates: Partial<SurveyQuestion>) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onAddOption: () => void;
    onRemoveOption: (optionIndex: number) => void;
    onUpdateOption: (optionIndex: number, updates: Partial<SurveyQuestionOption>) => void;
    onMoveOptionUp: (optionIndex: number) => void;
    onMoveOptionDown: (optionIndex: number) => void;
    onAddTrigger: () => void;
    onRemoveTrigger: (triggerIndex: number) => void;
    onUpdateTriggerExpression: (triggerIndex: number, expression: Expression) => void;
    onAddTriggerChildQuestion: (triggerIndex: number) => void;
    onRemoveTriggerChildQuestion: (triggerIndex: number, childQuestionIndex: number) => void;
    onUpdateTriggerChildQuestion: (triggerIndex: number, childQuestionIndex: number, updates: Partial<SurveyQuestion>) => void;
    onReorderTriggerChildQuestion: (triggerIndex: number, childQuestionIndex: number, direction: 'up' | 'down') => void;
}> = ({ question, questionIndex, totalQuestions, allQuestions, onRemove, onUpdate, onMoveUp, onMoveDown, onAddOption, onRemoveOption, onUpdateOption, onMoveOptionUp, onMoveOptionDown, onAddTrigger, onRemoveTrigger, onUpdateTriggerExpression, onAddTriggerChildQuestion, onRemoveTriggerChildQuestion, onUpdateTriggerChildQuestion, onReorderTriggerChildQuestion }) => {
    const answerTypeOptions: { value: AnswerType; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
    ];

    const needsOptions = question.answer_type === 'radio' || question.answer_type === 'checkbox';
    const options = question.survey_question_option || [];

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={onRemove}
                    ></span>
                    <SwitchingTextInput
                        value={question.question}
                        onChange={(value: string) => onUpdate({ question: value })}
                        className="font-bold text-lg"
                    />
                </div>
                <div className="flex items-center gap-2 ml-2">
                    {questionIndex > 0 && (
                        <span
                            className="icon-[material-symbols--arrow-upward] w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={onMoveUp}
                            title="Move up"
                        ></span>
                    )}
                    {questionIndex < totalQuestions - 1 && (
                        <span
                            className="icon-[material-symbols--arrow-downward] w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={onMoveDown}
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

                        onUpdate(updates);
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
                    id={`mandatory-${questionIndex}`}
                    checked={question.is_mandatory}
                    onChange={(e) => onUpdate({ is_mandatory: e.target.checked })}
                />
                <label htmlFor={`mandatory-${questionIndex}`} className="text-sm font-medium text-gray-900">
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
                            onClick={onAddOption}
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
                                        onClick={() => onRemoveOption(optionIndex)}
                                        title="Remove option"
                                    ></span>
                                    <SwitchingTextInput
                                        value={option.display}
                                        onChange={(value: string) => onUpdateOption(optionIndex, { display: value })}
                                        sizing="sm"
                                        className="flex-1"
                                    />
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {optionIndex > 0 && (
                                            <span
                                                className="icon-[material-symbols--arrow-upward] w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                                onClick={() => onMoveOptionUp(optionIndex)}
                                                title="Move up"
                                            ></span>
                                        )}
                                        {optionIndex < options.length - 1 && (
                                            <span
                                                className="icon-[material-symbols--arrow-downward] w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                                onClick={() => onMoveOptionDown(optionIndex)}
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
                        onClick={onAddTrigger}
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
                                questionIndex={questionIndex}
                                allQuestions={allQuestions}
                                onRemove={() => onRemoveTrigger(triggerIndex)}
                                onUpdateExpression={(expression) => onUpdateTriggerExpression(triggerIndex, expression)}
                                onAddChildQuestion={() => onAddTriggerChildQuestion(triggerIndex)}
                                onRemoveChildQuestion={(childQuestionIndex) => onRemoveTriggerChildQuestion(triggerIndex, childQuestionIndex)}
                                onUpdateChildQuestion={(childQuestionIndex, updates) => onUpdateTriggerChildQuestion(triggerIndex, childQuestionIndex, updates)}
                                onReorderChildQuestion={(childQuestionIndex, direction) => onReorderTriggerChildQuestion(triggerIndex, childQuestionIndex, direction)}
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
    questionIndex: number;
    allQuestions: SurveyQuestion[];
    onRemove: () => void;
    onUpdateExpression: (expression: Expression) => void;
    onAddChildQuestion: () => void;
    onRemoveChildQuestion: (childQuestionIndex: number) => void;
    onUpdateChildQuestion: (childQuestionIndex: number, updates: Partial<SurveyQuestion>) => void;
    onReorderChildQuestion: (childQuestionIndex: number, direction: 'up' | 'down') => void;
}> = ({ trigger, question, allQuestions, onRemove, onUpdateExpression, onAddChildQuestion, onRemoveChildQuestion, onUpdateChildQuestion, onReorderChildQuestion }) => {
    const childQuestions = trigger.survey_question || [];

    return (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-900">Trigger Condition</span>
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
                {childQuestions.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">No child questions added</p>
                ) : (
                    <div className="flex flex-col gap-2 mt-2">
                        {childQuestions.map((childQuestion, childQuestionIndex) => (
                            <div key={childQuestionIndex} className="p-2 bg-white rounded border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="icon-[humbleicons--times] w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500 flex-shrink-0"
                                        onClick={() => onRemoveChildQuestion(childQuestionIndex)}
                                        title="Remove child question"
                                    ></span>
                                    <SwitchingTextInput
                                        value={childQuestion.question}
                                        onChange={(value: string) => onUpdateChildQuestion(childQuestionIndex, { question: value })}
                                        className="font-medium text-sm flex-1"
                                        sizing="sm"
                                    />
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {childQuestionIndex > 0 && (
                                            <span
                                                className="icon-[material-symbols--arrow-upward] w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                                onClick={() => onReorderChildQuestion(childQuestionIndex, 'up')}
                                                title="Move up"
                                            ></span>
                                        )}
                                        {childQuestionIndex < childQuestions.length - 1 && (
                                            <span
                                                className="icon-[material-symbols--arrow-downward] w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                                                onClick={() => onReorderChildQuestion(childQuestionIndex, 'down')}
                                                title="Move down"
                                            ></span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2 ml-6">
                                    <label className="block text-xs font-medium text-gray-700">
                                        Answer Type
                                    </label>
                                    <Select
                                        value={childQuestion.answer_type}
                                        onChange={(e) => {
                                            const newAnswerType = e.target.value as AnswerType;
                                            const updates: Partial<SurveyQuestion> = { answer_type: newAnswerType };
                                            if ((newAnswerType === 'radio' || newAnswerType === 'checkbox') && !childQuestion.survey_question_option) {
                                                updates.survey_question_option = [];
                                            } else if (newAnswerType !== 'radio' && newAnswerType !== 'checkbox' && childQuestion.survey_question_option) {
                                                updates.survey_question_option = undefined;
                                            }
                                            onUpdateChildQuestion(childQuestionIndex, updates);
                                        }}
                                        className="grow max-w-xs"
                                        sizing="sm"
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="radio">Radio</option>
                                        <option value="checkbox">Checkbox</option>
                                    </Select>
                                </div>
                                <div className="flex flex-row items-center gap-2 ml-6 mt-1">
                                    <Checkbox
                                        id={`child-mandatory-${childQuestionIndex}`}
                                        checked={childQuestion.is_mandatory}
                                        onChange={(e) => onUpdateChildQuestion(childQuestionIndex, { is_mandatory: e.target.checked })}
                                    />
                                    <label htmlFor={`child-mandatory-${childQuestionIndex}`} className="text-xs font-medium text-gray-700">
                                        Mandatory
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                <TextInput
                    type="text"
                    value={currentExpression.value}
                    onChange={(e) => onChange({ op: currentExpression.op, value: e.target.value } as ValueComparator)}
                    placeholder="Value"
                    sizing="sm"
                    className="flex-1 max-w-xs"
                />
                {question.answer_type === 'radio' || question.answer_type === 'checkbox' ? (
                    <Select
                        value=""
                        onChange={(e) => {
                            if (e.target.value) {
                                onChange({ op: currentExpression.op, value: e.target.value } as ValueComparator);
                            }
                        }}
                        sizing="sm"
                        className="w-40"
                    >
                        <option value="">Or select option...</option>
                        {(question.survey_question_option || []).map((option, idx) => (
                            <option key={idx} value={option.display}>
                                {option.display}
                            </option>
                        ))}
                    </Select>
                ) : null}
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
