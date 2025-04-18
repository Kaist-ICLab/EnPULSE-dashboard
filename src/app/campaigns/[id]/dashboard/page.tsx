"use client";
import TimelineOverview from "@/components/dashboard/TimelineOverview";
import UserDailyStatTable from "@/components/dashboard/UserDailyTable";
import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
import { useState } from "react";

const Page = () => {
    const [userId, setUserId] = useState<string>("1");
    const [sendTo, setSendTo] = useState<string>("");
    const [messageModalVisible, setMessageModalVisible] = useState<boolean>(false);

    return (
        <div className="space-y-6">
            <UserDailyStatTable setUserId={setUserId} openMessageModal={(sendTo: string) => { setSendTo(sendTo); setMessageModalVisible(true); }} />
            <TimelineOverview userId={userId} setUserId={setUserId} />
            {messageModalVisible && <SendMessageFloatingModal
                sendTo={sendTo}
                onClose={() => setMessageModalVisible(false)}
                onSendButtonClick={() => setMessageModalVisible(false)}
            />}
        </div>
    );
}

export default Page;