"use client";
import DashboardCard from "@/components/campaign/DashboardCard";
import { ComparisonChart } from "@/components/dashboard/charts/ComparisonChart";
import UserDailyStatTable from "@/components/dashboard/UserDailyTable";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import { sectionTypes } from "@/hooks/useSectionState";
import { CampaignParticipant } from "@/types/campaign";
import { Button } from "flowbite-react";
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
            <DashboardCard>
                <div className="flex items-center">
                    <span className="font-semibold">Last updated: {lastLoaded ? lastLoaded.toDateString() + ', ' + lastLoaded.toLocaleTimeString() : ''}</span>
                    <Button
                        className="ml-auto"
                        onClick={() => {
                            setLastLoaded(new Date())
                        }}
                    >
                        <span className="icon-[eva--sync-fill] w-6 h-6 mr-2"></span> Sync now
                    </Button>
                </div>
            </DashboardCard>
            <UserDailyStatTable
                syncTime={lastLoaded}
                openMessageModal={(sendTo: CampaignParticipant[]) => { setSendTo(sendTo); setMessageModalVisible(true); }}
            />

            {sectionTypes.map((type) => (
                <ComparisonChart
                    key={type}
                    sectionType={type}
                />
            ))}

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