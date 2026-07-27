import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import dayjs from "dayjs";
import { Card, TextInput } from "flowbite-react";

const CampaignPeriodForm = () => {
    const { campaignStartTime, campaignEndTime, setCampaignStartTime, setCampaignEndTime } = useCampaignConfigEdit((state) => state);

    return (
        <Card>
            <h6 className="text-xl font-medium text-gray-900">
                Campaign Period
            </h6>
            <div className="flex flex-col gap-2 items-stretch">
                <div className="flex gap-2 items-center">
                    <label htmlFor="campaignStartTime" className="block text-sm font-medium text-gray-900 w-16">Start time</label>
                    <TextInput
                        type="datetime-local"
                        value={dayjs(campaignStartTime).format("YYYY-MM-DDTHH:mm:ss")}
                        onChange={(e) => setCampaignStartTime(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="campaignEndTime" className="block text-sm font-medium text-gray-900 w-16">End time</label>
                    <TextInput
                        type="datetime-local"
                        value={dayjs(campaignEndTime).format("YYYY-MM-DDTHH:mm:ss")}
                        onChange={(e) => setCampaignEndTime(e.target.value)}
                    />
                </div>
            </div>
        </Card>
    )
}

export default CampaignPeriodForm;