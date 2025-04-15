"use client";
import TimelineOverview from "@/components/TimelineOverview";
import UserDailyStatTable from "@/components/UserDailyTable";

const Page = () => {
  return (
    <div className="space-y-6">
      <UserDailyStatTable />
      <TimelineOverview />
    </div>
  );
}

export default Page;