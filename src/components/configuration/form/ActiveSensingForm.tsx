"use client";

import SurveyCard from "./SurveyCard";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";

const ActiveSensingForm: React.FC<{
  baseUrl: string;
}> = ({ baseUrl }) => {
  const { surveys } = useCampaignConfigEdit((state) => state);

  if (surveys.length === 0) {
    return (
      <div className="flex w-full items-center justify-center bg-gray-100 py-12">
        <p className="text-lg text-gray-500">No surveys configured</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {surveys.map((survey, index) => (
        <SurveyCard key={index} baseUrl={baseUrl} survey={survey} surveyIndex={index} />
      ))}
    </div>
  );
};

export default ActiveSensingForm;
