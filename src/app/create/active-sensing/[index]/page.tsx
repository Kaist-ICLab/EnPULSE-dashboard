"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { useCampaignConfigEdit, useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import QuestionList from "@/components/configuration/form/QuestionList";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useEffect } from "react";

export default function SurveyQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyIndex = parseInt(params.index as string);
  const { surveys } = useCampaignConfigEdit((state) => state);
  const configEditStore = useCampaignConfigEditStoreApi();
  const { clear } = useTemporalStore(configEditStore, (state) => state);

  useEffect(() => {
    clear();
  }, [clear]);

  const survey = surveys[surveyIndex];

  if (!survey) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-12">
        <p className="text-lg text-gray-500">Survey not found</p>
        <Button color="gray" onClick={() => router.push("/create/active-sensing")}>
          Back to Active Sensing Configuration
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <QuestionList surveyIndex={surveyIndex} />
      <div className="mb-4 flex gap-4">
        <Button color="gray" onClick={() => router.push("/create/active-sensing")}>
          Back to Active Sensing Configuration
        </Button>
      </div>
    </div>
  );
}
