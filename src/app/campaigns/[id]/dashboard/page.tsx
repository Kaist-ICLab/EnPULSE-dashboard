"use client";
import DashboardCard from "@/components/campaign/DashboardCard";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import UserDailyStatTable from "@/components/dashboard/UserDailyTable";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import useChartParams from "@/hooks/legacy/useChartParams";
import { ChartType, PinQuery } from "@/types/chart";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";

const chartTypes = [
    ChartType.TimelineOverview,
    // ChartType.IntraPerson,
    // ChartType.InterPerson
]

const Page = () => {
    const [lastLoaded, setLastLoaded] = useState<Date | null>(null)
    const [sendTo, setSendTo] = useState<string>("");
    const [messageModalVisible, setMessageModalVisible] = useState<boolean>(false);

    const { params, setParams } = useChartParams(
        {
            uid: "1",
            sid: "battery-chargetype",
            date: new Date()
        },
        chartTypes
    )

    const [pinQuery, setPinQuery] = useState<PinQuery>(chartTypes.reduce((acc, type) => {
        acc[type] = null;
        return acc;
    }, {} as PinQuery));

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
                setUserId={v => setParams(ChartType.TimelineOverview, { ...params[ChartType.TimelineOverview], uid: v })}
                openMessageModal={(sendTo: string) => { setSendTo(sendTo); setMessageModalVisible(true); }}
            />

            {chartTypes.map((type) => (
                <ComparisonChart
                    key={type}
                    params={params[type]}
                    setParams={setParams} type={type}
                    pinQuery={pinQuery}
                    setPinQuery={setPinQuery}
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