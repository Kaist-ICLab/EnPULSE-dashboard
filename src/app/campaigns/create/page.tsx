"use client"
import Section from "@/components/common/Section";
import DatabaseConnection from "@/components/legacy/DatabaseConnection";
import { Button, Card, TextInput } from "flowbite-react";
import { useState } from "react";

const Page: React.FC = () => {
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignNameAvailabilityStatus, setCampaignNameAvailabilityStatus] = useState<{ success: boolean, message: string } | null>(null);

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-row ">
            <aside className="min-h-screen w-64 flex flex-col border-r border-gray-200">
                <div className="px-5 h-16 flex items-center text-black text-2xl font-bold">DataSentry</div>
            </aside>
            <div className="flex flex-col w-full p-4">
                <h1>Create campaign</h1>
                <Card>
                    <Section title="General">
                        <div>
                            <h6 className="text-base font-medium text-gray-900 mb-2">
                                Campaign name
                            </h6>
                            <div className="flex gap-2">
                                <TextInput
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    className="w-[421px]"
                                />
                            </div>
                            {campaignNameAvailabilityStatus && (
                                <div className={`mt-2 text-sm ${campaignNameAvailabilityStatus.success ? 'text-green-600' : 'text-amber-600'}`}>
                                    {campaignNameAvailabilityStatus.message}
                                </div>
                            )}
                        </div>
                        <div>
                            <h6 className="text-base font-medium text-gray-900 mb-2">
                                Import Database
                            </h6>
                            <DatabaseConnection />
                        </div>
                    </Section>
                    <Button className="w-fit">
                        Create
                    </Button>
                </Card>
            </div>
        </div>
    );
}
export default Page;