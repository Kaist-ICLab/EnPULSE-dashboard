"use client";
import TimelineOverview from "@/components/dashboard/TimelineOverview";
import UserDailyStatTable from "@/components/dashboard/UserDailyTable";

const Page = () => {
  return (
    <div className="space-y-6">
      <UserDailyStatTable />
      <TimelineOverview />
    </div>
  );
}

export default Page;