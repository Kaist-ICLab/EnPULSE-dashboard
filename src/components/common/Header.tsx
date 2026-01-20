"use client";
import CampaignDropdown from "@/components/common/CampaignDropdown";
import React from "react";
import { Button } from "flowbite-react";
import useSectionState from "@/hooks/useSectionState";
import dayjs from "dayjs";


const Header: React.FC = () => {
    const { date, updateDate: setDate, addDaysToDate, initTimeRange } = useSectionState();

    return (
        <div className="w-full min-h-16 flex justify-between items-center border-b border-gray-200 px-4">
            <div className="flex justify-start items-center gap-2">
                <div className="py-2 rounded-xl flex justify-center items-center gap-2 text-gray-700 hover:text-gray-500">
                    <CampaignDropdown />
                </div>
            </div>
            <div className="flex items-center gap-1 ml-auto mr-auto">
                <Button
                    color="light"
                    aria-label="Previous day"
                    onClick={() => {
                        addDaysToDate(-1);
                        initTimeRange();
                    }}
                >
                    <span className="icon-[eva--chevron-left-fill] w-6 h-6"></span>
                </Button>
                <input
                    type="date"
                    className="h-10 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1"
                    value={dayjs(date).format('YYYY-MM-DD')}
                    onChange={(e) => {
                        const date = dayjs(e.target.value).startOf('day').toDate();
                        setDate(date);
                        initTimeRange();
                    }}
                />
                <Button
                    color="light"
                    aria-label="Next day"
                    disabled={dayjs(date).isAfter(dayjs().startOf('day').subtract(1, 'second'))}
                    onClick={() => {
                        addDaysToDate(1);
                        initTimeRange();
                    }}
                >
                    <span className="icon-[eva--chevron-right-fill] w-6 h-6"></span>
                </Button>
            </div>
            <Button
            >
                <span className="icon-[eva--sync-fill] w-4 h-4 mr-2"></span> Sync now
            </Button>
        </div>
    );
}

export default Header;