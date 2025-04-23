'use client'

import { Card } from "flowbite-react";
import DatabaseConnection from "@/components/DatabaseConnection";
import RenameCampaign from "@/components/RenameCampaign";

const Page = () => {
  return (
    <div className="p-4">
      <Card className="mb-4">
        <div className="space-y-6">
          <RenameCampaign />
          <DatabaseConnection />
        </div>
      </Card>
    </div>
  );
}

export default Page;