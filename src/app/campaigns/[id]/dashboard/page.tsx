"use client";
import { ComparisonChart } from "@/components/dashboard/charts/ComparisonChart";
import DailyOverviewTable from "@/components/dashboard/DailyOverviewTable";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import { CampaignParticipant } from "@/types/campaign";
import { useEffect, useState } from "react";

const Page = () => {
    const [lastLoaded, setLastLoaded] = useState<Date | null>(null)
    const [sendTo, setSendTo] = useState<CampaignParticipant[]>([]);
    const [messageModalVisible, setMessageModalVisible] = useState<boolean>(false);

    useEffect(() => {
        setLastLoaded(new Date())
    }, [])

    return (
        <div className="space-y-4 p-4">
            <DailyOverviewTable
                syncTime={lastLoaded}
                openMessageModal={(sendTo: CampaignParticipant[]) => { setSendTo(sendTo); setMessageModalVisible(true); }}
            />

            <ComparisonChart />

            {
                messageModalVisible && <SendMessageFloatingModal
                    initialSendTo={sendTo}
                    onClose={() => setMessageModalVisible(false)}
                />
            }
        </div>
    );
}

export default Page;