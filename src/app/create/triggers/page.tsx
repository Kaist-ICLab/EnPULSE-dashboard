"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import TriggerForm from "@/components/configuration/trigger/TriggerForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";

const Page: React.FC = () => {
  const router = useRouter();
  const { isTriggerValid, triggerIssue } = useValidConfigState();
  const configEditStore = useCampaignConfigEditStoreApi();
  const { clear } = useTemporalStore(configEditStore, (state) => state);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <>
      <TriggerForm />
      <PrevNextNavigation
        prevHref="/create/webapp"
        onNextClick={() => router.push("/create/confirm")}
        disabled={!isTriggerValid}
        disabledReason={triggerIssue}
      />
    </>
  );
};

export default Page;
