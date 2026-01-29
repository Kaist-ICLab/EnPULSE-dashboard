'use client'

import SurveyCard from "./SurveyCard";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";

const ActiveSensingForm: React.FC<{
    baseUrl: string;
}> = ({ baseUrl }) => {
    const { surveys } = useCampaignConfigEdit();

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
                    baseUrl={baseUrl}
                    survey={survey}
                    surveyIndex={index}
                />
            ))}
        </div>
    );
};

export default ActiveSensingForm;
