'use client'

import { Card, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Survey } from "@/types/survey";

import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import ScheduleMethodConfig from "./ScheduleMethodConfig";
import SwitchingTextInput from "../../common/SwitchingTextInput";

const SurveyCard: React.FC<{
    baseUrl: string;
    survey: Survey;
    surveyIndex: number;
}> = ({ baseUrl, survey, surveyIndex }) => {
    const router = useRouter();
    const { removeSurvey, updateSurveyTitle, updateSurveyDescription } = useCampaignConfigEdit();
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => removeSurvey(surveyIndex)}
                    ></span>
                    <SwitchingTextInput
                        value={survey.title}
                        onChange={(value) => updateSurveyTitle(surveyIndex, value)}
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
                    onChange={(value) => updateSurveyDescription(surveyIndex, value)}
                    sizing="sm"
                />
            </div>
            <ScheduleMethodConfig
                surveyIndex={surveyIndex}
                scheduleMethod={survey.schedule_method}
            />
            <div className="mt-4">
                <Button
                    color="blue"
                    onClick={() => router.push(`${baseUrl}/${surveyIndex}`)}
                    className="w-full"
                >
                    <span className="icon-[material-symbols--edit] mr-2"></span>
                    Edit Questions ({survey.survey_question?.length || 0})
                </Button>
            </div>
        </Card>
    );
};

export default SurveyCard;
