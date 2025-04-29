'use client'
import CampaignNameInput from "../common/CampaignNameInput";
import { Button, Card } from "flowbite-react";
import FormatConfigTable from "../settings/FormatConfigTable";
import DatabaseConnection from "../settings/DatabaseConnection";
import Link from "next/link";
import useNewCampaignName from "@/hooks/useNewCampaignName";

const Page: React.FC = () => {
    const { name, setName, status, onCheck } = useNewCampaignName("")
    return (
        <Card>
            <h1 className="text-3xl font-bold mb-3 text-gray-900">Create Campaign</h1>
            <CampaignNameInput name={name} setName={setName} status={status} label="Check" onClick={onCheck} />
            <DatabaseConnection />
            <FormatConfigTable />
            <div className="flex justify-end gap-2 mt-8 ">
                <Button size="lg" className="flex-2/3">Create</Button>
                <Link href="/" className="flex-1/3">
                    <Button size="lg" color="gray" className="w-full">Cancel</Button>
                </Link>
            </div>
        </Card>
    );
}

export default Page;