"use client";

import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import CampaignPeriodForm from "@/components/configuration/form/CampaignPeriodForm";
import ConfigImportExportForm from "@/components/configuration/form/ConfigImportExportForm";
import DangerZoneForm from "@/components/configuration/form/DangerZoneForm";
import { IS_DEMO_MODE } from "@/constants/demoMode";

const Page: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <CampaignInfoForm />
      <CampaignPeriodForm />
      <ConfigImportExportForm />
      {!IS_DEMO_MODE && <DangerZoneForm />}
    </div>
  );
};

export default Page;
