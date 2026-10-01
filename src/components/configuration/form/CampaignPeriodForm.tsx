import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import dayjs from "dayjs";
import { Card, TextInput } from "flowbite-react";

const CampaignPeriodForm = () => {
  const { campaignStartTime, campaignEndTime, setCampaignStartTime, setCampaignEndTime } = useCampaignConfigEdit(
    (state) => state,
  );
  const isEndBeforeStart = !dayjs(campaignEndTime).isAfter(dayjs(campaignStartTime));

  return (
    <Card>
      <h6 className="text-xl font-medium text-gray-900">Campaign Period</h6>
      <div className="flex flex-col items-stretch gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="campaignStartTime" className="block w-16 text-sm font-medium text-gray-900">
            Start time
          </label>
          <TextInput
            id="campaignStartTime"
            type="datetime-local"
            value={dayjs(campaignStartTime).format("YYYY-MM-DDTHH:mm:ss")}
            onChange={(e) => setCampaignStartTime(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="campaignEndTime" className="block w-16 text-sm font-medium text-gray-900">
            End time
          </label>
          <TextInput
            id="campaignEndTime"
            type="datetime-local"
            value={dayjs(campaignEndTime).format("YYYY-MM-DDTHH:mm:ss")}
            onChange={(e) => setCampaignEndTime(e.target.value)}
            color={isEndBeforeStart ? "failure" : undefined}
          />
        </div>
        {isEndBeforeStart && <p className="text-sm text-red-600">The end time must be after the start time.</p>}
      </div>
    </Card>
  );
};

export default CampaignPeriodForm;
