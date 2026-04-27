'use client'

import { Card, Select, Checkbox, Button, Label, TextInput } from "flowbite-react";
import { AnswerType, DeviceType, SurveyQuestion } from "@/types/survey";

import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import SwitchingTextInput from "../../common/SwitchingTextInput";
import TriggerCard from "./TriggerCard";
import { useMemo } from "react";

const QuestionList: React.FC<{
    surveyIndex: number;
}> = ({ surveyIndex }) => {
    const { surveys } = useCampaignConfigEdit((state) => state);
    const survey = surveys[surveyIndex];
    const isWatch = survey?.device_type === DeviceType.Watch;

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
                        isWatch={isWatch}
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
    isWatch: boolean;
}> = ({ surveyIndex, question, questionPath, totalQuestions, depth, isWatch }) => {
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
        setNumberScaleRange,
    } = useCampaignConfigEdit((state) => state);

    const answerTypeOptions: { value: AnswerType; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
        ...(isWatch ? [
            { value: 'binary' as const, label: 'Binary' },
            { value: 'numberscale' as const, label: 'Number Scale' },
        ] : []),
    ];

    const needsOptions = question.answer_type === 'radio' || question.answer_type === 'checkbox';
    const options = question.survey_question_option || [];
    const pathKey = questionPath.join('-');
    const scaleOptions = question.survey_question_option ?? [];
    const scaleMin = scaleOptions.length ? Number(scaleOptions[0].display) : 0;
    const scaleMax = scaleOptions.length ? Number(scaleOptions[scaleOptions.length - 1].display) : 10;

    return (
        <Card className="grow">
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => removeSurveyQuestion(surveyIndex, questionPath)}
                    ></span>
                    <div className="grow">
                        {depth > 0 ? (
                            <span className="text-xs text-blue-700 font-medium whitespace-nowrap ml-2">
                                {/* {questionPath.filter((_, idx) => idx % 2 === 1).map(v => `Trigger ${v + 1}`).join(' > ')} */}
                                {questionPath.filter((_, idx) => idx % 2 === 1).map(v => `Trigger ${v + 1}`).join(' > ')}
                            </span>
                        ) : null}
                        <SwitchingTextInput
                            value={question.question}
                            onChange={(value: string) => updateSurveyQuestion(surveyIndex, questionPath, { question: value })}
                            className="font-bold text-lg grow"
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
                    onChange={(e) => updateSurveyQuestion(surveyIndex, questionPath, { answer_type: e.target.value as AnswerType })}
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

            {question.answer_type === 'numberscale' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Integer Range
                    </label>
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor={`scale-min-${pathKey}`} className="text-sm text-gray-700">Min</Label>
                        <TextInput
                            id={`scale-min-${pathKey}`}
                            type="number"
                            sizing="sm"
                            value={scaleMin}
                            onChange={(e) => setNumberScaleRange(surveyIndex, questionPath, Number(e.target.value), scaleMax)}
                            className="w-24"
                        />
                        <Label htmlFor={`scale-max-${pathKey}`} className="text-sm text-gray-700 ml-2">Max</Label>
                        <TextInput
                            id={`scale-max-${pathKey}`}
                            type="number"
                            sizing="sm"
                            value={scaleMax}
                            onChange={(e) => setNumberScaleRange(surveyIndex, questionPath, scaleMin, Number(e.target.value))}
                            className="w-24"
                        />
                    </div>
                </div>
            )}

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
                                <div key={optionIndex} className="flex items-center gap-2 w-full bg-gray-50 rounded-lg p-2">
                                    <span
                                        className="icon-[humbleicons--times] w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500 flex-shrink-0"
                                        onClick={() => removeSurveyQuestionOption(surveyIndex, questionPath, optionIndex)}
                                        title="Remove option"
                                    ></span>
                                    <div className="flex flex-col gap-1 grow">
                                        <div >

                                            <SwitchingTextInput
                                                value={option.display}
                                                onChange={(value: string) => updateSurveyQuestionOption(surveyIndex, questionPath, optionIndex, { display: value })}
                                                sizing="sm"
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pl-2">
                                            <Label htmlFor={`allow-free-response-${questionPath.join('-')}-${optionIndex}`} className="text-sm font-light text-gray-500">
                                                Allow free text response
                                            </Label>
                                            <Checkbox
                                                id={`allow-free-response-${questionPath.join('-')}-${optionIndex}`}
                                                checked={option.allow_free_response}
                                                onChange={(e) => updateSurveyQuestionOption(surveyIndex, questionPath, optionIndex, { allow_free_response: e.target.checked })}
                                            />
                                        </div>
                                    </div>
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

            {!isWatch && (
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
                                    onRemove={() => removeSurveyQuestionTrigger(surveyIndex, questionPath, triggerIndex)}
                                    onUpdateExpression={(expression) => updateSurveyQuestionTriggerExpression(surveyIndex, questionPath, triggerIndex, expression)}
                                    onAddChildQuestion={() => addSurveyQuestion(surveyIndex, questionPath, triggerIndex)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default QuestionList;
