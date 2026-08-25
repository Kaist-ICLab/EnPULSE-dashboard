"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import QuestionList from "@/components/configuration/form/QuestionList";

export default function SurveyQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyIndex = parseInt(params.index as string);
  const { surveys } = useCampaignConfigEdit((state) => state);

  const survey = surveys[surveyIndex];

  if (!survey) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <p className="text-lg text-gray-500">Survey not found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <QuestionList surveyIndex={surveyIndex} />
      <div className="flex gap-4">
        <Button color="gray" onClick={() => router.push("./")}>
          Back to Active Sensing Configuration
        </Button>
      </div>
    </div>
  );
}
