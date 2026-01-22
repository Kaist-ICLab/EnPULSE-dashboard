'use client'

import { Card, Select, TextInput, Checkbox } from "flowbite-react";
import useCampaignConfigEdit from "@/hooks/create/useCampaignConfigEdit";
import { useState, useEffect } from "react";
import { AnswerType, SurveyQuestion } from "@/types/survey";

interface QuestionListProps {
    surveyIndex: number;
}

const QuestionList: React.FC<QuestionListProps> = ({ surveyIndex }) => {
    const { surveys, removeSurveyQuestion, updateSurveyQuestion, reorderSurveyQuestion } = useCampaignConfigEdit();
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
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionIndex, totalQuestions, onRemove, onUpdate, onMoveUp, onMoveDown }) => {
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [questionText, setQuestionText] = useState(question.question);

    useEffect(() => {
        if (!isEditingQuestion) {
            setQuestionText(question.question);
        }
    }, [question.question, isEditingQuestion]);

    const answerTypeOptions: { value: AnswerType; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
    ];

    const handleQuestionSave = () => {
        onUpdate({ question: questionText });
        setIsEditingQuestion(false);
    };

    const handleQuestionCancel = () => {
        setQuestionText(question.question);
        setIsEditingQuestion(false);
    };

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={onRemove}
                    ></span>
                    {isEditingQuestion ? (
                        <div className="flex w-full gap-2">
                            <TextInput
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                onBlur={handleQuestionSave}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleQuestionSave();
                                    if (e.key === 'Escape') handleQuestionCancel();
                                }}
                                className="flex-1"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div
                            className="w-full px-3 py-2 border border-transparent hover:border-gray-300 rounded-lg cursor-text font-bold text-xl"
                            onClick={() => setIsEditingQuestion(true)}
                        >
                            {question.question || <span className="text-gray-400">Click to edit question</span>}
                        </div>
                    )}
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
                    onChange={(e) => onUpdate({ answer_type: e.target.value as AnswerType })}
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
        </Card>
    );
};

export default QuestionList;
