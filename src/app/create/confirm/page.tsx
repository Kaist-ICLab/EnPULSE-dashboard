"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateCampaign } from "@/hooks/configuration/useUpdateCampaign";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";

import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const ConfirmPage: React.FC = () => {
  const { campaignName, tables, surveys, campaign_trigger, webapps } = useCampaignConfigEdit((state) => state);
  const { isInfoValid, isPassiveSensingValid, isActiveSensingValid, isWebappValid, isTriggerValid } =
    useValidConfigState();
  const router = useRouter();
  // Stays true after a successful save so the button cannot be pressed again
  // while the browser is navigating to the new campaign.
  const [isSaved, setIsSaved] = useState(false);
  const { isUpdating, updateCampaignConfig } = useUpdateCampaign((id) => {
    setIsSaved(true);
    router.push(`/campaigns/${id}`);
  });

  // An empty wizard here means the page was reached by browser Back after saving,
  // a refresh, or a typed URL. Send the user to step 1 instead of offering to
  // create an unnamed campaign with no password (which phones cannot join).
  const isPristine = campaignName.trim().length === 0;
  useEffect(() => {
    if (isPristine && !isSaved) router.replace("/create/general");
  }, [isPristine, isSaved, router]);

  const invalidSteps = [
    !isInfoValid && "General",
    !isPassiveSensingValid && "Passive Sensing",
    !isActiveSensingValid && "Active Sensing",
    !isWebappValid && "Web App",
    !isTriggerValid && "Triggers",
  ].filter(Boolean);
  const disabledReason =
    invalidSteps.length > 0 ? `Fix these steps before creating the campaign: ${invalidSteps.join(", ")}.` : null;

  if (isPristine && !isSaved) return null;

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
      <PrevNextNavigation
        prevHref="/create/triggers"
        onNextClick={updateCampaignConfig}
        nextLabel={isUpdating ? "Creating campaign..." : "Create Campaign!"}
        disabled={isUpdating || isSaved || invalidSteps.length > 0}
        disabledReason={disabledReason}
      />
    </>
  );
};

export default ConfirmPage;
