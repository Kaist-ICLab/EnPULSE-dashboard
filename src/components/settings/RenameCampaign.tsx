'use client'
import useCampaignRenameState from "@/hooks/useCampaignRenameState";
import CampaignNameInput from "../common/CampaignNameInput";
import { Card } from "flowbite-react";
import FormatConfigTable from "./FormatConfigTable";
import { Campaign } from "@/hooks/useCampaigns";

const Page: React.FC<{ currentCampaign: Campaign }> = ({ currentCampaign }) => {
    const { name, setName, status, onCheck } = useCampaignRenameState(currentCampaign.name)
    return (<Card>
        <CampaignNameInput
            name={name}
            setName={setName}
            status={status}
            label="Rename"
            onClick={onCheck}
        />
        <FormatConfigTable />
    </Card>);
}

export default Page;