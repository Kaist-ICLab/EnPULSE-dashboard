"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "flowbite-react";
import dayjs from "dayjs";

import MainHeader from "@/components/common/MainHeader";
import { useCampaignListStore } from "@/providers/CampaignListStoreProvider";
import { CampaignListItem } from "@/types/campaign";

function calculateProgress(startTime: string, endTime: string): number {
  const now = dayjs();
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  if (now.isBefore(start)) return 0;
  if (now.isAfter(end)) return 100;

  const totalDuration = end.diff(start);
  const elapsed = now.diff(start);
  return parseFloat(((elapsed / totalDuration) * 100).toFixed(2));
}

interface CampaignCardProps {
  id: number;
  campaign: CampaignListItem;
  isMounted: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ id, campaign, isMounted }) => {
  const { name, description, start_time, end_time } = campaign;

  const progress = isMounted ? calculateProgress(start_time, end_time) : 0;
  const isCompleted = isMounted && progress >= 100;
  const isUpcoming = isMounted && progress === 0;
  const isActive = isMounted && progress > 0 && progress < 100;

  return (
    <Card
      key={`campaign-${id}`}
      className="group w-full overflow-hidden rounded-xl border-none shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/campaigns/${id}`} className="block h-full">
        <div className="flex h-full flex-col gap-5 p-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="line-clamp-1 text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
              {name}
            </h3>
            {isUpcoming && (
              <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-yellow-700">
                Upcoming
              </span>
            )}
            {isActive && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-emerald-700">
                Active
              </span>
            )}
            {isCompleted && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-blue-700">
                Completed
              </span>
            )}
          </div>

          <p className="line-clamp-2 flex-grow text-sm text-gray-500">
            {description || "No description provided"}
          </p>

          <div className="mt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-medium text-gray-600">
              <span>Progress</span>
              <span>{isMounted ? `${Math.max(0, Math.min(100, progress))}%` : "-"}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isCompleted ? "bg-blue-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                }`}
                style={{ width: `${isMounted ? Math.max(0, Math.min(100, progress)) : 0}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
              <span>Start: {isMounted ? dayjs(start_time).format("MMM D, YYYY") : "-"}</span>
              <span>End: {isMounted ? dayjs(end_time).format("MMM D, YYYY") : "-"}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

const EmptyState: React.FC = () => (
  <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
      <svg
        className="h-8 w-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900">No campaigns found</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign.</p>
  </div>
);

const CampaignsPage: React.FC = () => {
  const campaignList = useCampaignListStore((state) => state.campaignList);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <MainHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Management Dashboard</h1>
          <p className="mt-2 text-gray-500">Manage and track all your current and past campaigns in one place.</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from(campaignList.entries()).map(([id, campaign]) => (
            <CampaignCard key={`campaign-${id}`} id={id} campaign={campaign} isMounted={isMounted} />
          ))}
          {campaignList.size === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;

