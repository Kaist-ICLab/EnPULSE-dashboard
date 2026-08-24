'use client'

import { Card, Select, Checkbox, Button, Label, TextInput } from "flowbite-react";
import { AnswerType, DeviceType, OptionQuestionConfig, NumberScaleQuestionConfig, SurveyQuestion } from "@/types/survey";

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
        return recursiveCallback(survey?.survey_question || [], [], 0);
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
            })}
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
        setNumberScaleLabel,
        setFreeResponseConfig,
        copySurveyQuestion,
        pasteSurveyQuestion,
        questionClipboard,
    } = useCampaignConfigEdit((state) => state);
    const canPasteHere = questionClipboard !== null;

    const answerTypeOptions: { value: AnswerType; label: string }[] = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'binary', label: 'Binary' },
        { value: 'numberscale', label: 'Number Scale' },
    ];

    const needsOptions = question.answer_type === 'radio' || question.answer_type === 'checkbox';
    const config = (question.config ?? {}) as Partial<OptionQuestionConfig & NumberScaleQuestionConfig>;
    const options = (config as OptionQuestionConfig).options ?? [];
    const pathKey = questionPath.join('-');
    const scaleMin = config.min ?? 0;
    const scaleMax = config.max ?? 10;
    const scaleMinLabel = config.minLabel ?? '';
    const scaleMaxLabel = config.maxLabel ?? '';

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
                    <span
                        className="icon-[material-symbols--content-copy-outline] w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                        onClick={() => copySurveyQuestion(surveyIndex, questionPath)}
                        title="Copy question"
                    ></span>
                    {canPasteHere && (
                        <span
                            className="icon-[material-symbols--content-paste] w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={() => pasteSurveyQuestion(surveyIndex, questionPath)}
                            title={`Paste over with: ${questionClipboard?.question || 'copied question'}`}
                        ></span>
                    )}
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
                    checked={question.is_mandatory ?? false}
                    onChange={(e) => updateSurveyQuestion(surveyIndex, questionPath, { is_mandatory: e.target.checked })}
                />
                <label htmlFor={`mandatory-${pathKey}`} className="text-sm font-medium text-gray-900">
                    Mandatory
                </label>
                {(question.answer_type === 'radio' || question.answer_type === 'checkbox') && (
                    <>
                        <Checkbox
                            id={`allow-free-response-${pathKey}`}
                            checked={(config as OptionQuestionConfig).allowFreeResponse ?? false}
                            className="ml-2"
                            onChange={(e) => setFreeResponseConfig(surveyIndex, questionPath, e.target.checked, (config as OptionQuestionConfig).freeResponsePrefix ?? '')}
                        />
                        <label htmlFor={`allow-free-response-${pathKey}`} className="text-sm font-medium text-gray-900">
                            Allow free response
                        </label>
                    </>
                )}
            </div>

            {question.answer_type === 'numberscale' && (
                <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor={`scale-min-${pathKey}`} className="text-sm text-gray-700 w-7">Min</Label>
                        <TextInput
                            id={`scale-min-${pathKey}`}
                            type="number"
                            sizing="sm"
                            value={scaleMin}
                            onChange={(e) => setNumberScaleRange(surveyIndex, questionPath, Number(e.target.value), scaleMax)}
                            className="w-24"
                        />
                        <Label htmlFor={`scale-min-${pathKey}`} className="text-sm text-gray-700 ml-2 w-28">Min number label</Label>
                        <TextInput
                            id={`scale-min-${pathKey}`}
                            type="text"
                            sizing="sm"
                            value={scaleMinLabel}
                            onChange={(e) => setNumberScaleLabel(surveyIndex, questionPath, e.target.value, scaleMaxLabel)}
                            className="grow"
                        />

                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor={`scale-max-${pathKey}`} className="text-sm text-gray-700 w-7">Max</Label>
                        <TextInput
                            id={`scale-max-${pathKey}`}
                            type="number"
                            sizing="sm"
                            value={scaleMax}
                            onChange={(e) => setNumberScaleRange(surveyIndex, questionPath, scaleMin, Number(e.target.value))}
                            className="w-24"
                        />
                        <Label htmlFor={`scale-max-${pathKey}`} className="text-sm text-gray-700 ml-2 w-28">Max number label</Label>
                        <TextInput
                            id={`scale-max-${pathKey}`}
                            type="text"
                            sizing="sm"
                            value={scaleMaxLabel}
                            onChange={(e) => setNumberScaleLabel(surveyIndex, questionPath, scaleMinLabel, e.target.value)}
                            className="grow"
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
                                        <div>
                                            <SwitchingTextInput
                                                value={option}
                                                onChange={(value) => updateSurveyQuestionOption(surveyIndex, questionPath, optionIndex, value)}
                                                sizing="sm"
                                                className="flex-1"
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
                    {(config as OptionQuestionConfig).allowFreeResponse && (
                        <div className="flex items-center gap-2 w-full bg-gray-100 rounded-lg p-2 mt-2">
                            <Label htmlFor={`free-response-prefix-${pathKey}`} className="text-sm text-gray-700 w-42">Free response prefix: </Label>
                            <SwitchingTextInput
                                id={`free-response-prefix-${pathKey}`}
                                value={(config as OptionQuestionConfig).freeResponsePrefix ?? ''}
                                onChange={(value) => setFreeResponseConfig(surveyIndex, questionPath, (config as OptionQuestionConfig).allowFreeResponse, value)}
                                sizing="sm"
                            />
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
