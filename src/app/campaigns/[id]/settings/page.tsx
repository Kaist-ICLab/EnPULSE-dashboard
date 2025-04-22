'use client'

import { Card, TextInput, Button } from "flowbite-react";
import ValidatorSelector from "@/components/ValidatorSelector";
import Section from "@/components/Section";
import { useState, useEffect } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";

const Page = () => {
  const { currentCampaign, renameCampaign } = useCampaigns();
  const [campaignName, setCampaignName] = useState(currentCampaign.name);
  const [renameStatus, setRenameStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Synchronize campaignName with currentCampaign.name when it changes
  useEffect(() => {
    setCampaignName(currentCampaign.name);
  }, [currentCampaign.name]);

  const handleValidUrl = (url: string) => {
    // Handle the valid URL here
    console.log('Valid URL:', url);
  };

  const handleValidFile = (file: File) => {
    // Handle the valid file here
    console.log('Valid File:', file.name);
  };

  const handleRename = () => {
    // Rename the campaign and check if it was successful
    const isRenamed = renameCampaign(currentCampaign.id, campaignName);
    
    if (isRenamed) {
      setRenameStatus({ success: true, message: "Campaign renamed successfully" });
    } else {
      setRenameStatus({ success: false, message: "No changes made or invalid name" });
    }
    
    // Clear the status message after 3 seconds
    setTimeout(() => {
      setRenameStatus(null);
    }, 3000);
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
              {renameStatus && (
                <div className={`mt-2 text-sm ${renameStatus.success ? 'text-green-600' : 'text-amber-600'}`}>
                  {renameStatus.message}
                </div>
              )}
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