'use client'

import { Card, Label, TextInput } from "flowbite-react";
import { usePassiveSensingTime } from "@/hooks/configuration/usePassiveSensingTime";
import SurveyList from "./SurveyList";
import useCampaignConfigEdit from "@/hooks/useCampaignConfigEdit";

const PassiveSensingForm: React.FC = () => {
    const { startTimeString, endTimeString, endTimeNextDay, setStartTime, setEndTime } = usePassiveSensingTime();
    const { surveys } = useCampaignConfigEdit();

    return (
        <div className="w-full flex flex-col gap-6">
            {surveys.length > 0 && <Card className="bg-blue-100">
                <div className="flex flex-col gap-4">
                    <h6 className="text-xl font-medium text-gray-900">
                        Schedule Time
                    </h6>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2 items-center">
                            <Label htmlFor="start-time" className="block text-sm font-medium text-gray-900 w-20">
                                Start of Day
                            </Label>
                            <TextInput
                                id="start-time"
                                type="time"
                                sizing="sm"
                                value={startTimeString}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full max-w-2xs"
                            />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Label htmlFor="end-time" className="block text-sm font-medium text-gray-900 w-20">
                                End of Day
                            </Label>
                            <TextInput
                                id="end-time"
                                type="time"
                                sizing="sm"
                                value={endTimeString}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full max-w-2xs"
                            />
                            {endTimeNextDay && (
                                <div className="flex items-center gap-2 text-sm text-blue-500">
                                    (Tomorrow {endTimeString})
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>}
            <SurveyList />
        </div>
    );
};

export default PassiveSensingForm;
