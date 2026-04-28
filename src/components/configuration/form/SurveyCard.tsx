'use client'

import { DeviceType, Survey } from "@/types/survey";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";

import { useSurveyCardState } from "@/hooks/configuration/useSurveyCardState";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { Modal } from "../../common/Modal";
import SwitchingTextInput from "../../common/SwitchingTextInput";
import ScheduleMethodConfig from "./ScheduleMethodConfig";

const SurveyCard: React.FC<{
    baseUrl: string;
    survey: Survey;
    surveyIndex: number;
}> = ({ baseUrl, survey, surveyIndex }) => {
    const router = useRouter();
    const { removeSurvey, updateSurveyTitle, updateSurveyDescription, setSurveyExpireAfterMs } = useCampaignConfigEdit((state) => state);
    const { pendingDeviceType, affectedQuestions, handleDeviceTypeChange, confirmDeviceTypeChange, cancelDeviceTypeChange } = useSurveyCardState(survey, surveyIndex);

    const modalTitle = "Switch to Watch?";
    const modalMessage = "Watch does not support conditional triggers. Switching will remove all triggers in this survey and flatten the remaining questions to the top level. This cannot be undone by switching back.";
    const modalConfirmLabel = "Remove Triggers and Switch";

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex w-full items-center gap-2">
                    <span
                        className="icon-[humbleicons--times] w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => removeSurvey(surveyIndex)}
                    ></span>
                    <SwitchingTextInput
                        value={survey.title}
                        onChange={(value) => updateSurveyTitle(surveyIndex, value)}
                        className="font-bold"
                    />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                <label className="block text-sm font-medium text-gray-900">
                    Description
                </label>
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
            {
                survey.device_type === DeviceType.Watch && (
                    <div className="flex flex-row items-center gap-4">
                        <Label htmlFor={`device-type-${surveyIndex}`} className="block text-sm font-medium text-gray-900">
                            Expiration Time (ms)
                        </Label>
                        <TextInput
                            id={`expiration-time-${surveyIndex}`}
                            type="number"
                            value={survey.expire_after_ms}
                            onChange={(e) => setSurveyExpireAfterMs(surveyIndex, Number(e.target.value))}
                            className="w-full max-w-xs"
                        />
                    </div>
                )
            }

            <ScheduleMethodConfig
                surveyIndex={surveyIndex}
                scheduleMethod={survey.schedule_method}
            />
            <div className="mt-4">
                <Button
                    color="blue"
                    onClick={() => router.push(`${baseUrl}/${surveyIndex}`)}
                    className="w-full"
                >
                    <span className="icon-[material-symbols--edit] mr-2"></span>
                    Edit Questions ({survey.survey_question?.length || 0})
                </Button>
            </div>
            {pendingDeviceType !== null && (
                <Modal
                    title={modalTitle}
                    onClose={cancelDeviceTypeChange}
                    className="w-full max-w-md"
                >
                    <div className="p-4 text-sm text-gray-700 flex flex-col gap-2">
                        <p>{modalMessage}</p>
                        <p className="font-medium text-gray-900">
                            Questions with triggers that will be affected:
                        </p>
                        <ul className="list-disc pl-5 max-h-48 overflow-auto">
                            {affectedQuestions.map((q, idx) => (
                                <li key={idx} className="text-gray-700">
                                    {q.question || <span className="italic text-gray-500">Untitled question</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                        <Button color="gray" onClick={cancelDeviceTypeChange}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={confirmDeviceTypeChange}>
                            {modalConfirmLabel}
                        </Button>
                    </div>
                </Modal>
            )}
        </Card>
    );
};

export default SurveyCard;
