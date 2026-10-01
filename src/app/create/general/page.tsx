"use client";
import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import CampaignPeriodForm from "@/components/configuration/form/CampaignPeriodForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { CampaignNameStatus } from "@/hooks/configuration/useCampaignNameState";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const router = useRouter();
  const { isInfoValid, infoIssue } = useValidConfigState();
  const [nameStatus, setNameStatus] = useState<CampaignNameStatus>("empty");

  const configEditStore = useCampaignConfigEditStoreApi();
  const { clear } = useTemporalStore(configEditStore, (state) => state);

  useEffect(() => {
    clear();
  }, [clear]);

  const isNameTaken = nameStatus === "taken";
  const disabledReason =
    isNameTaken && infoIssue === null ? "Another campaign already uses this name. Choose a different one." : infoIssue;

  return (
    <>
      <div className="flex flex-col gap-4">
        <CampaignInfoForm onNameStatusChange={setNameStatus} />
        <CampaignPeriodForm />
      </div>
      <PrevNextNavigation
        onNextClick={() => router.push("/create/passive-sensing")}
        nextLabel="Next"
        disabled={!isInfoValid || isNameTaken}
        disabledReason={disabledReason}
      />
    </>
  );
};

export default Page;
