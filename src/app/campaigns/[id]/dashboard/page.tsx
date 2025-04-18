"use client";
import TimelineOverview from "@/components/TimelineOverview";
import UserDailyStatTable from "@/components/UserDailyTable";
import { useState } from "react";

const Page = () => {
    const [userId, setUserId] = useState<string>("1");
    return (
        <div className="space-y-6">
            <UserDailyStatTable setUserId={setUserId} />
            <TimelineOverview userId={userId} setUserId={setUserId} />
        </div>
    );
}

export default Page;