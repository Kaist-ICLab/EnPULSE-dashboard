"use client";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import UserDailyStatTable from "@/components/dashboard/UserDailyTable";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import useChartParams from "@/hooks/legacy/useChartParams";
import { ChartType } from "@/types/chart";
import { useState } from "react";

const chartTypes = [
    ChartType.TimelineOverview,
    ChartType.IntraPerson,
    ChartType.InterPerson
]

const Page = () => {
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

    return (
        <div className="space-y-6">
            {/* <UserDailyStatTable
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
            {messageModalVisible && <SendMessageFloatingModal
                sendTo={sendTo}
                onClose={() => setMessageModalVisible(false)}
                onSendButtonClick={() => setMessageModalVisible(false)}
            />} */}
        </div>
    );
}

export default Page;