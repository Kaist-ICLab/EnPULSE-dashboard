'use client'

import { useParams, useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";
import QuestionList from "@/components/configuration/form/QuestionList";

export default function SurveyQuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const surveyIndex = parseInt(params.index as string);
    const { surveys } = useCampaignConfigEdit();

    const survey = surveys[surveyIndex];

    if (!survey) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <p className="text-gray-500 text-lg">Survey not found</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <QuestionList surveyIndex={surveyIndex} />
            <div className="flex gap-4">
                <Button
                    color="gray"
                    onClick={() => router.push('/create/passive-sensing')}
                >
                    Back to Passive Sensing Configuration
                </Button>
            </div>
        </div>
    );
}
