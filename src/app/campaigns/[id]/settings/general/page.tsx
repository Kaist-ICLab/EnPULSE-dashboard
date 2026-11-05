"use client";

import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import CampaignPeriodForm from "@/components/configuration/form/CampaignPeriodForm";
import ConfigImportExportForm from "@/components/configuration/form/ConfigImportExportForm";
import DangerZoneForm from "@/components/configuration/form/DangerZoneForm";

const Page: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <CampaignInfoForm />
      <CampaignPeriodForm />
      <ConfigImportExportForm />
      <DangerZoneForm />
    </div>
  );
};

export default Page;
