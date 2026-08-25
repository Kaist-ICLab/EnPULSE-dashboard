"use client";

import { useRouter } from "next/navigation";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";

import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const ConfirmPage: React.FC = () => {
  const { campaignName, tables, surveys, campaign_trigger, webapps } = useCampaignConfigEdit((state) => state);
  const { updateCampaignConfig } = useUpdateCampaign((id) => {
    router.push(`/campaigns/${id}`);
  });
  const router = useRouter();

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Card>
          {/* Campaign Name */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Campaign Name</h3>
            <p className="text-gray-700">{campaignName || "Not set"}</p>
          </div>

          {/* Tables (Sensors) */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Sensors</h3>
            {tables.length === 0 ? (
              <p className="text-sm text-gray-500">No sensors configured</p>
            ) : (
              <ul className="space-y-2">
                {tables.map((table, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                    <span className="text-gray-900">{table.name}</span>
                    <span className="text-sm text-gray-600">{table.campaign_table_field?.length || 0} fields</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Surveys */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Surveys</h3>
            {surveys.length === 0 ? (
              <p className="text-sm text-gray-500">No surveys configured</p>
            ) : (
              <ul className="space-y-2">
                {surveys.map((survey, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                    <span className="text-gray-900">{survey.title || `Survey ${index + 1}`}</span>
                    <span className="text-sm text-gray-600">{survey.survey_question?.length || 0} questions</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Web Apps */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Web Apps</h3>
            {webapps.length === 0 ? (
              <p className="text-sm text-gray-500">No web apps configured</p>
            ) : (
              <ul className="space-y-2">
                {webapps.map((webapp, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                    <span className="text-gray-900">{webapp.name || `Web App ${index + 1}`}</span>
                    <span className="text-sm text-gray-600">{webapp.url}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Triggers */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Triggers</h3>
            {campaign_trigger.length === 0 ? (
              <p className="text-sm text-gray-500">No triggers configured</p>
            ) : (
              <ul className="space-y-2">
                {campaign_trigger.map((trigger, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                    <span className="text-gray-900">{trigger.name || `Trigger ${index + 1}`}</span>
                    <span className="text-sm text-gray-600">
                      {trigger.actions.length === 0 ? "no actions" : trigger.actions.map((a) => a.kind).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
      <PrevNextNavigation onNextClick={updateCampaignConfig} nextLabel="Create Campaign!" />
    </>
  );
};

export default ConfirmPage;
