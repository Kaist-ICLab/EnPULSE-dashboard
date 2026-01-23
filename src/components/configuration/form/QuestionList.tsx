'use client'

import { Card, Select, Checkbox, Button } from "flowbite-react";
import { AnswerType, SurveyQuestion, SurveyQuestionOption } from "@/types/survey";

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import SwitchingTextInput from "./SwitchingTextInput";

interface QuestionListProps {
    surveyIndex: number;
}

const QuestionList: React.FC<QuestionListProps> = ({ surveyIndex }) => {
    const { surveys, removeSurveyQuestion, updateSurveyQuestion, reorderSurveyQuestion, addSurveyQuestionOption, removeSurveyQuestionOption, updateSurveyQuestionOption, reorderSurveyQuestionOption } = useCampaignConfigEdit();
    const survey = surveys[surveyIndex];

    if (!survey) {
        return null;
    }

    const questions = survey.questions || [];

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
                    onRemove={() => removeSurveyQuestion(surveyIndex, questionIndex)}
                    onUpdate={(updates) => updateSurveyQuestion(surveyIndex, questionIndex, updates)}
                    onMoveUp={() => reorderSurveyQuestion(surveyIndex, questionIndex, 'up')}
                    onMoveDown={() => reorderSurveyQuestion(surveyIndex, questionIndex, 'down')}
                    onAddOption={() => addSurveyQuestionOption(surveyIndex, questionIndex)}
                    onRemoveOption={(optionIndex) => removeSurveyQuestionOption(surveyIndex, questionIndex, optionIndex)}
                    onUpdateOption={(optionIndex, updates) => updateSurveyQuestionOption(surveyIndex, questionIndex, optionIndex, updates)}
                    onMoveOptionUp={(optionIndex) => reorderSurveyQuestionOption(surveyIndex, questionIndex, optionIndex, 'up')}
                    onMoveOptionDown={(optionIndex) => reorderSurveyQuestionOption(surveyIndex, questionIndex, optionIndex, 'down')}
                />
            ))}
        </div>
    );
};

interface QuestionCardProps {
    question: SurveyQuestion;
    questionIndex: number;
    surveyIndex: number;
    totalQuestions: number;
    onRemove: () => void;
    onUpdate: (updates: Partial<SurveyQuestion>) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onAddOption: () => void;
    onRemoveOption: (optionIndex: number) => void;
    onUpdateOption: (optionIndex: number, updates: Partial<SurveyQuestionOption>) => void;
    onMoveOptionUp: (optionIndex: number) => void;
    onMoveOptionDown: (optionIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionIndex, totalQuestions, onRemove, onUpdate, onMoveUp, onMoveDown, onAddOption, onRemoveOption, onUpdateOption, onMoveOptionUp, onMoveOptionDown }) => {
    const answerTypeOptions: { value: AnswerType; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
    ];

    const needsOptions = question.answer_type === 'radio' || question.answer_type === 'checkbox';
    const options = question.options || [];

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
                        if ((newAnswerType === 'radio' || newAnswerType === 'checkbox') && !question.options) {
                            updates.options = [];
                        }
                        // Clear options if switching away from radio/checkbox
                        else if (newAnswerType !== 'radio' && newAnswerType !== 'checkbox' && question.options) {
                            updates.options = undefined;
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
        </Card>
    );
};

export default QuestionList;
