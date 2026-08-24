"use client";
import { useRouter } from "next/navigation";

import WebappForm from "@/components/configuration/form/WebappForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useEffect } from "react";

const WebappPage: React.FC = () => {
  const router = useRouter();
  const { isWebappValid } = useValidConfigState();
  const configEditStore = useCampaignConfigEditStoreApi();
  const { clear } = useTemporalStore(configEditStore, (state) => state);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <>
      <WebappForm />
      <PrevNextNavigation onNextClick={() => router.push("/create/triggers")} disabled={!isWebappValid} />
    </>
  );
};

export default WebappPage;
