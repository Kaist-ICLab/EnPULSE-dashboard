import { useState, useEffect } from "react";
import { TextInput, Button } from "flowbite-react";
import { useCampaigns } from "@/hooks/useCampaigns";
import Section from "@/components/common/Section";

const RenameCampaign = () => {
  const { currentCampaign, renameCampaign } = useCampaigns();
  const [campaignName, setCampaignName] = useState(currentCampaign.name);
  const [renameStatus, setRenameStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Synchronize campaignName with currentCampaign.name when it changes
  useEffect(() => {
    setCampaignName(currentCampaign.name);
  }, [currentCampaign.name]);

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
  );
};

export default RenameCampaign; 