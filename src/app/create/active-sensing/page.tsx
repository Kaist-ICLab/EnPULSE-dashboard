"use client";
import { usePathname, useRouter } from "next/navigation";

import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";
import { useTemporalStore } from "@/hooks/useTemporalStore";
import { useCampaignConfigEditStoreApi } from "@/providers/CampaignConfigEditStoreProvider";
import { useEffect } from "react";

const Page: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isActiveSensingValid } = useValidConfigState();
  const configEditStore = useCampaignConfigEditStoreApi();
  const { clear } = useTemporalStore(configEditStore, (state) => state);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <>
      <ActiveSensingForm baseUrl={pathname} />
      <PrevNextNavigation
        prevHref="/create/passive-sensing"
        onNextClick={() => router.push("/create/webapp")}
        disabled={!isActiveSensingValid}
      />
    </>
  );
};

export default Page;
