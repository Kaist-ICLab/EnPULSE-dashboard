"use client"

import CampaignInfoForm from "@/components/configuration/form/CampaignInfoForm";
import CampaignPeriodForm from "@/components/configuration/form/CampaignPeriodForm";
import ConfigImportExportForm from "@/components/configuration/form/ConfigImportExportForm";

const Page: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <CampaignInfoForm />
            <CampaignPeriodForm />
            <ConfigImportExportForm />
        </div>
    )
}

export default Page;