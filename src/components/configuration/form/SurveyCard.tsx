"use client";

import { DeviceType, Survey } from "@/types/survey";
import { MIN_WATCH_SURVEY_EXPIRE_MS } from "@/constants/survey";
import { Button, Card, Label, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "../../common/ConfirmModal";
import NumberInput from "../../common/NumberInput";

import { useSurveyCardState } from "@/hooks/configuration/useSurveyCardState";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { Modal } from "../../common/Modal";
import SwitchingTextInput from "../../common/SwitchingTextInput";

const SurveyCard: React.FC<{
  baseUrl: string;
  survey: Survey;
  surveyIndex: number;
}> = ({ baseUrl, survey, surveyIndex }) => {
  const router = useRouter();
  const { removeSurvey, updateSurveyTitle, updateSurveyDescription, setSurveyExpireAfterMs, campaign_trigger } =
    useCampaignConfigEdit((state) => state);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // removeSurvey clears the survey selection of every trigger action that used it.
  const referencingTriggerCount = campaign_trigger.filter((t) =>
    t.actions.some((a) => (a.kind === "ema" || a.kind === "watch_ema") && a.surveyIndex === surveyIndex),
  ).length;
  const {
    pendingDeviceType,
    nestedQuestionCount,
    affectedQuestions,
    handleDeviceTypeChange,
    confirmDeviceTypeChange,
    cancelDeviceTypeChange,
  } = useSurveyCardState(survey, surveyIndex);

  const modalTitle = "Switch to Watch?";
  const modalMessage =
    "Watch does not support conditional triggers. Switching will remove all triggers in this survey and flatten the remaining questions to the top level. This cannot be undone by switching back.";
  const modalConfirmLabel = "Remove Triggers and Switch";

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            aria-label="Delete survey"
            className="icon-[humbleicons--times] h-5 w-5 cursor-pointer text-gray-500 hover:text-red-500"
            onClick={() => setIsDeleteOpen(true)}
          ></button>
          <SwitchingTextInput
            value={survey.title}
            onChange={(value) => updateSurveyTitle(surveyIndex, value)}
            className="font-bold"
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <label className="block text-sm font-medium text-gray-900">Description</label>
        <SwitchingTextInput
          value={survey.description}
          onChange={(value) => updateSurveyDescription(surveyIndex, value)}
          sizing="sm"
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <Label htmlFor={`device-type-${surveyIndex}`} className="block text-sm font-medium text-gray-900">
          Display On
        </Label>
        <Select
          id={`device-type-${surveyIndex}`}
          value={survey.device_type}
          onChange={(e) => handleDeviceTypeChange(Number(e.target.value) as DeviceType)}
          className="w-full max-w-xs"
        >
          <option value={DeviceType.Phone}>Phone</option>
          <option value={DeviceType.Watch}>Watch (MicroEMA)</option>
        </Select>
      </div>
      {survey.device_type === DeviceType.Watch && (
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor={`expiration-time-${surveyIndex}`} className="block text-sm font-medium text-gray-900">
            Expiration Time (ms)
          </Label>
          <NumberInput
            id={`expiration-time-${surveyIndex}`}
            integer
            min={MIN_WATCH_SURVEY_EXPIRE_MS}
            step={1000}
            value={survey.expire_after_ms}
            // 0 (or missing, on an older row) makes the watch's countdown loop skip
            // entirely, so the microEMA closes as "expired" the instant it opens.
            onValueChange={(ms) => setSurveyExpireAfterMs(surveyIndex, ms)}
            color={
              !survey.expire_after_ms || survey.expire_after_ms < MIN_WATCH_SURVEY_EXPIRE_MS ? "failure" : undefined
            }
            className="w-full max-w-xs"
          />
          {(!survey.expire_after_ms || survey.expire_after_ms < MIN_WATCH_SURVEY_EXPIRE_MS) && (
            <span className="text-sm text-red-600">
              At least {MIN_WATCH_SURVEY_EXPIRE_MS} ms, or the prompt closes before it can be answered.
            </span>
          )}
        </div>
      )}

      <div className="mt-4">
        <Button color="blue" onClick={() => router.push(`${baseUrl}/${surveyIndex}`)} className="w-full">
          <span className="icon-[material-symbols--edit] mr-2"></span>
          Edit Questions ({nestedQuestionCount})
        </Button>
      </div>
      {pendingDeviceType !== null && (
        <Modal title={modalTitle} onClose={cancelDeviceTypeChange} className="w-full max-w-md">
          <div className="flex flex-col gap-2 p-4 text-sm text-gray-700">
            <p>{modalMessage}</p>
            <p className="font-medium text-gray-900">Questions with triggers that will be affected:</p>
            <ul className="max-h-48 list-disc overflow-auto pl-5">
              {affectedQuestions.map((q, idx) => (
                <li key={idx} className="text-gray-700">
                  {q.question || <span className="text-gray-500 italic">Untitled question</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-200 p-4">
            <Button color="gray" onClick={cancelDeviceTypeChange}>
              Cancel
            </Button>
            <Button color="red" onClick={confirmDeviceTypeChange}>
              {modalConfirmLabel}
            </Button>
          </div>
        </Modal>
      )}
      {isDeleteOpen && (
        <ConfirmModal
          title="Delete survey?"
          message={
            <>
              <p>This deletes &quot;{survey.title || "Untitled"}&quot; and all of its questions.</p>
              {referencingTriggerCount > 0 && (
                <p className="mt-2">
                  {referencingTriggerCount === 1 ? "1 trigger uses" : `${referencingTriggerCount} triggers use`} this
                  survey; their survey selection will be cleared.
                </p>
              )}
            </>
          }
          confirmLabel="Delete survey"
          onConfirm={() => {
            setIsDeleteOpen(false);
            removeSurvey(surveyIndex);
          }}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </Card>
  );
};

export default SurveyCard;
