"use client";
import useCampaign from "@/hooks/useCampaign";
import dayjs from "dayjs";
import Link from "next/link";

const TimeHeadline: React.FC = () => {
    const { campaign } = useCampaign();

    if (campaign && dayjs(campaign.start_time).toDate() >= new Date()) {
        return <div className="w-full text-center py-1 bg-blue-700 text-white ">
            <span className="mr-3 font-bold">Campaign has not started yet</span>
            <Link href={`/campaigns/${campaign.id}/settings/general`} className="underline">Start study</Link>
        </div>
    }
    if (campaign && dayjs(campaign.end_time).toDate() <= new Date()) {
        return <div className="w-full text-center py-1 bg-blue-700 text-white ">
            <span className="mr-3 font-bold">Campaign has ended</span>
            <Link href={`/campaigns/${campaign.id}/settings/general`} className="underline">Extend study</Link>
        </div>
    }
}

export default TimeHeadline;