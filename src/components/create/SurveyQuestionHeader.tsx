'use client'

import { useParams, useRouter } from "next/navigation";
import { Button, Select } from "flowbite-react";
import useCampaignConfigEdit from "@/hooks/create/useCampaignConfigEdit";

export default function SurveyQuestionHeader() {
    const params = useParams();
    const router = useRouter();
    const currentSurveyIndex = parseInt(params.index as string);
    const { surveys, addSurveyQuestion } = useCampaignConfigEdit();

    const handleSurveySelect = (index: number) => {
        router.push(`/create/passive-sensing/${index}`);
    };

    return (
        <div className="flex w-full items-center">
            <Select value={currentSurveyIndex} onChange={(e) => handleSurveySelect(parseInt(e.target.value))} className="w-40 mr-auto font-bold">
                {surveys.map((survey, index) => (
                    <option key={index} value={index}>{survey.title}</option>
                ))}
            </Select>
            <Button
                color="blue"
                onClick={() => addSurveyQuestion(currentSurveyIndex)}
            >
                <span className="icon-[tabler--plus] mr-2"></span> Add Question
            </Button>
        </div>
    );
}
