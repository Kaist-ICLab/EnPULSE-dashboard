'use client'

import { Card, TextInput, Button } from "flowbite-react";
import useCampaignConfigEdit from "@/hooks/create/useCampaignConfigEdit";
import { useState } from "react";
import ScheduleMethodConfig from "./ScheduleMethodConfig";
import { ScheduleMethod, SurveyQuestion } from "@/types/survey";
import { useRouter } from "next/navigation";

const SurveyList: React.FC = () => {
    const { surveys, removeSurvey, updateSurveyTitle, updateSurveyDescription, updateSurveyScheduleMethod } = useCampaignConfigEdit();

    if (surveys.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100">
                <p className="text-gray-500 text-lg">No surveys configured</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {surveys.map((survey, index) => (
                <SurveyCard
                    key={index}
                    survey={survey}
                    surveyIndex={index}
                    onRemove={() => removeSurvey(index)}
                    onTitleChange={(title) => updateSurveyTitle(index, title)}
                    onDescriptionChange={(description) => updateSurveyDescription(index, description)}
                    onScheduleMethodChange={(scheduleMethod) => updateSurveyScheduleMethod(index, scheduleMethod)}
                />
            ))}
        </div>
    );
};

interface SurveyCardProps {
    survey: { title: string; description: string; schedule_method: ScheduleMethod; questions?: SurveyQuestion[] };
    surveyIndex: number;
    onRemove: () => void;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onScheduleMethodChange: (scheduleMethod: ScheduleMethod) => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, surveyIndex, onRemove, onTitleChange, onDescriptionChange, onScheduleMethodChange }) => {
    const router = useRouter();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [titleValue, setTitleValue] = useState(survey.title);
    const [descriptionValue, setDescriptionValue] = useState(survey.description);

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={onRemove}
                    ></span>
                    {isEditingTitle ? (
                        <div className="flex w-full gap-2">
                            <TextInput
                                value={titleValue}
                                onChange={(e) => setTitleValue(e.target.value)}
                                onBlur={() => {
                                    onTitleChange(titleValue);
                                    setIsEditingTitle(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onTitleChange(titleValue);
                                        setIsEditingTitle(false);
                                    }
                                    if (e.key === 'Escape') {
                                        setTitleValue(survey.title);
                                        setIsEditingTitle(false);
                                    }
                                }}
                                className="flex-1"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div
                            className="w-full px-3 py-2 border border-transparent hover:border-gray-300 rounded-lg cursor-text font-bold text-xl"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {survey.title || <span className="text-gray-400">Click to edit title</span>}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                <label className="block text-sm font-medium text-gray-900">
                    Description
                </label>
                {isEditingDescription ? (
                    <div className="flex gap-2 w-full">
                        <TextInput
                            sizing="sm"
                            value={descriptionValue}
                            onChange={(e) => setDescriptionValue(e.target.value)}
                            onBlur={() => {
                                onDescriptionChange(descriptionValue);
                                setIsEditingDescription(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onDescriptionChange(descriptionValue);
                                    setIsEditingDescription(false);
                                }
                                if (e.key === 'Escape') {
                                    setDescriptionValue(survey.description);
                                    setIsEditingDescription(false);
                                }
                            }}
                            className="grow"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div
                        className="px-2 py-1.5 border border-transparent hover:border-gray-300 rounded-lg cursor-text min-h-[1.5rem] w-full text-sm text-gray-500"
                        onClick={() => setIsEditingDescription(true)}
                    >
                        {survey.description || <span className="text-gray-400">Click to edit description</span>}
                    </div>
                )}
            </div>
            <ScheduleMethodConfig
                scheduleMethod={survey.schedule_method}
                onScheduleMethodChange={onScheduleMethodChange}
            />
            <div className="mt-4">
                <Button
                    color="blue"
                    onClick={() => router.push(`/create/passive-sensing/${surveyIndex}`)}
                    className="w-full"
                >
                    <span className="icon-[material-symbols--edit] mr-2"></span>
                    Edit Questions ({survey.questions?.length || 0})
                </Button>
            </div>
        </Card>
    );
};

export default SurveyList;
