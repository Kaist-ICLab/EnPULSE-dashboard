'use client'

import { TriggerAction } from "@/types/trigger";
import { DeviceType } from "@/types/survey";
import { Label, Select, TextInput } from "flowbite-react";

const NotificationAction: React.FC<{
    action: Extract<TriggerAction, { kind: "notification" }>;
    onChange: (next: TriggerAction) => void;
}> = ({ action, onChange }) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-700">Title</Label>
                <TextInput
                    sizing="sm"
                    placeholder="Notification Title"
                    value={action.title}
                    onChange={(e) => onChange({ ...action, title: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-700">Description </Label>
                <TextInput
                    sizing="sm"
                    placeholder="Notification Description"
                    value={action.description}
                    onChange={(e) => {
                        onChange({ ...action, description: e.target.value });
                    }}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-700">URL <span className="text-gray-400 font-normal">(optional)</span></Label>
                <TextInput
                    sizing="sm"
                    placeholder="Notification URL"
                    value={action.url ?? ""}
                    onChange={(e) => {
                        const v = e.target.value
                        onChange({ ...action, url: v.length > 0 ? v : undefined });
                    }}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium text-gray-700">Show On</Label>
                <Select
                    sizing="sm"
                    value={action.deviceType}
                    onChange={(e) => onChange({ ...action, deviceType: Number(e.target.value) as DeviceType })}
                >
                    <option value={DeviceType.Phone}>Phone</option>
                    <option value={DeviceType.Watch}>Watch</option>
                </Select>
            </div>

            <div className="flex flex-row items-center">
                <span className="block text-sm text-gray-900 mr-4">Minimum Interval Between Notifications:</span>
                <TextInput
                    type="number"
                    sizing="sm"
                    value={action.minIntervalMillis}
                    onChange={(e) => onChange({ ...action, minIntervalMillis: Number(e.target.value) })}
                />
                <span className="text-sm ml-1 text-gray-900">ms</span>
            </div>
        </div>
    );
};

export default NotificationAction;