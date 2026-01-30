'use client'

import { Button } from "flowbite-react";
import { SurveyQuestion, SurveyQuestionTrigger, Expression } from "@/types/survey";
import ExpressionBuilder from "./ExpressionBuilder";

interface TriggerCardProps {
    trigger: SurveyQuestionTrigger;
    triggerIndex: number;
    question: SurveyQuestion;
    onRemove: () => void;
    onUpdateExpression: (expression: Expression) => void;
    onAddChildQuestion: () => void;
}

const TriggerCard: React.FC<TriggerCardProps> = ({
    trigger,
    triggerIndex,
    question,
    onRemove,
    onUpdateExpression,
    onAddChildQuestion
}) => {
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
                setExpression={onUpdateExpression}
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

export default TriggerCard;
