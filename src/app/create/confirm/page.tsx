"use client";

import { useRouter } from "next/navigation";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";

import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const ConfirmPage: React.FC = () => {
    const { campaignName, tables, surveys, campaign_trigger } = useCampaignConfigEdit((state) => state);
    const { updateCampaignConfig } = useUpdateCampaign((id) => { router.push(`/campaigns/${id}`); });
    const router = useRouter();

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                <Card>
                    {/* Campaign Name */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign Name</h3>
                        <p className="text-gray-700">{campaignName || "Not set"}</p>
                    </div>

                    {/* Tables (Sensors) */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sensors</h3>
                        {tables.length === 0 ? (
                            <p className="text-gray-500 text-sm">No sensors configured</p>
                        ) : (
                            <ul className="space-y-2">
                                {tables.map((table, index) => (
                                    <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-900">{table.name}</span>
                                        <span className="text-gray-600 text-sm">
                                            {table.campaign_table_field?.length || 0} fields
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Surveys */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Surveys</h3>
                        {surveys.length === 0 ? (
                            <p className="text-gray-500 text-sm">No surveys configured</p>
                        ) : (
                            <ul className="space-y-2">
                                {surveys.map((survey, index) => (
                                    <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-900">{survey.title || `Survey ${index + 1}`}</span>
                                        <span className="text-gray-600 text-sm">
                                            {survey.survey_question?.length || 0} questions
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Triggers */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Triggers</h3>
                        {campaign_trigger.length === 0 ? (
                            <p className="text-gray-500 text-sm">No triggers configured</p>
                        ) : (
                            <ul className="space-y-2">
                                {campaign_trigger.map((trigger, index) => (
                                    <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-900">{trigger.name || `Trigger ${index + 1}`}</span>
                                        <span className="text-gray-600 text-sm">
                                            {trigger.actions.length === 0
                                                ? "no actions"
                                                : trigger.actions.map(a => a.kind).join(", ")}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>
            </div>
            <PrevNextNavigation
                onNextClick={updateCampaignConfig}
                nextLabel="Create Campaign!"
            />
        </>
    );
};

export default ConfirmPage;
