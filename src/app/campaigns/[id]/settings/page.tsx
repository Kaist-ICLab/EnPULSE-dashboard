'use client'

import { Card, TextInput, Button } from "flowbite-react";
import ValidatorSelector from "@/components/ValidatorSelector";
import Section from "@/components/Section";
import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";

const Page = () => {
  const { currentCampaign } = useCampaigns();
  const [campaignName, setCampaignName] = useState(currentCampaign.name);

  const handleValidUrl = (url: string) => {
    // Handle the valid URL here
    console.log('Valid URL:', url);
  };

  const handleValidFile = (file: File) => {
    // Handle the valid file here
    console.log('Valid File:', file.name);
  };

  const handleRename = () => {
    // Handle campaign rename here
    console.log('Renaming campaign to:', campaignName);
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <div className="space-y-6">
          <Section title="General">
            <div>
              <h6 className="text-base font-medium text-gray-900 mb-2">
                Campaign name
              </h6>
              <div className="flex gap-2">
                <TextInput
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-[421px]"
                />
                <Button 
                  color="gray"
                  onClick={handleRename}
                  className="text-gray-900 font-medium bg-gray-50 border border-gray-300 hover:bg-gray-100 h-[42px]"
                >
                  Rename
                </Button>
              </div>
            </div>
          </Section>

          <Section title="Database">
            <div>
              <h6 className="text-base font-medium text-gray-900 mb-2">
                Database Connection
              </h6>
              <ValidatorSelector 
                onValidUrl={handleValidUrl}
                onValidFile={handleValidFile}
              />
            </div>
          </Section>
        </div>
      </Card>
    </div>
  );
}

export default Page;