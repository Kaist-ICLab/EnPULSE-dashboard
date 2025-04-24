
'use client'
import { Card } from "flowbite-react";
import FormatConfigTable from "@/components/settings/FormatConfigTable";
import DatabaseConnection from "@/components/settings/DatabaseConnection";
import RenameCampaign from "@/components/settings/RenameCampaign";

const Page = () => {
  return (<Card>
    <RenameCampaign />
    <DatabaseConnection />
    <FormatConfigTable/>
  </Card>);
}

export default Page;