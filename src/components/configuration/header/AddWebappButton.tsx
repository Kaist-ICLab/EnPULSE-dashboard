'use client'
import { useState } from "react";
import { Button, Card, TextInput } from "flowbite-react";

import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";

export default function AddWebappButton() {
    const { addWebapp } = useCampaignConfigEdit((state) => state);
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    return (
        <div className="flex gap-4 items-center">
            <Button
                onClick={() => { setIsInputVisible(true); setName(""); setUrl("") }}
            >
                <span className="icon-[tabler--plus] mr-2"></span> Add web app
            </Button>
            {isInputVisible && (
                <Card className="absolute right-6 top-20 z-10 shadow-lg min-w-96">
                    <div className="flex gap-4 items-center mb-4">
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Name</span>
                        <TextInput
                            type="text"
                            placeholder="Web app name"
                            className="w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 items-center mb-4">
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">URL</span>
                        <TextInput
                            type="text"
                            placeholder="https://example.com"
                            className="w-full"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <Button className="flex-2/3" onClick={() => { addWebapp({ campaign_id: -1, name, url }); setIsInputVisible(false); setName(""); setUrl(""); }} disabled={name.trim().length === 0 || url.trim().length === 0}>
                            Confirm
                        </Button>
                        <Button className="flex-1/3" color="gray" onClick={() => { setIsInputVisible(false); setName(""); setUrl(""); }}>
                            Cancel
                        </Button>
                    </div>
                </Card>
            )}
        </div>

    );
}
