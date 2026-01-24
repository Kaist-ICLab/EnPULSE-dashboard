'use client'

import { Card, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { ScheduleMethod, Survey } from "@/types/survey";

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import ScheduleMethodConfig from "./ScheduleMethodConfig";
import SwitchingTextInput from "./SwitchingTextInput";

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

const SurveyCard: React.FC<{
    survey: Survey;
    surveyIndex: number;
    onRemove: () => void;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onScheduleMethodChange: (scheduleMethod: ScheduleMethod) => void;
}> = ({ survey, surveyIndex, onRemove, onTitleChange, onDescriptionChange, onScheduleMethodChange }) => {
    const router = useRouter();


    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={onRemove}
                    ></span>
                    <SwitchingTextInput
                        value={survey.title}
                        onChange={onTitleChange}
                        className="font-bold"
                    />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                <label className="block text-sm font-medium text-gray-900">
                    Description
                </label>
                <SwitchingTextInput
                    value={survey.description}
                    onChange={onDescriptionChange}
                    sizing="sm"
                />
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
                    Edit Questions ({survey.survey_question?.length || 0})
                </Button>
            </div>
        </Card>
    );
};

export default SurveyList;
