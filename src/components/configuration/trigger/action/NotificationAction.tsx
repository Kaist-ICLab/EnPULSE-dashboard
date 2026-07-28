'use client'

import { TriggerAction } from "@/types/trigger";
import { Label, TextInput } from "flowbite-react";

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
        </div>
    );
};

export default NotificationAction;