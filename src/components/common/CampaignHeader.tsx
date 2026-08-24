"use client";
import CampaignDropdown from "@/components/common/CampaignDropdown";
import React from "react";

export const CampaignHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-16 w-full items-center justify-between border-b border-gray-200 px-4">
      <div className="flex items-center justify-start gap-2">
        <div className="flex items-center justify-center gap-2 rounded-xl py-2 text-gray-700 hover:text-gray-500">
          <CampaignDropdown />
        </div>
      </div>
      {children}
    </div>
  );
};
