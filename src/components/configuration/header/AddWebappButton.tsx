"use client";
import { useState } from "react";
import { Button, Card, TextInput } from "flowbite-react";

import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import IconUploadInput from "@/components/common/IconUploadInput";

export default function AddWebappButton() {
  const { addWebapp } = useCampaignConfigEdit((state) => state);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [iconPath, setIconUrl] = useState("");

  const reset = () => {
    setIsInputVisible(false);
    setName("");
    setUrl("");
    setIconUrl("");
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          setIsInputVisible(true);
          setName("");
          setUrl("");
          setIconUrl("");
        }}
      >
        <span className="icon-[tabler--plus] mr-2"></span> Add web app
      </Button>
      {isInputVisible && (
        <Card className="absolute top-20 right-6 z-10 min-w-96 shadow-lg">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap text-gray-900">Icon</span>
            <IconUploadInput value={iconPath} onChange={setIconUrl} size="sm" />
          </div>

          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap text-gray-900">Name</span>
            <TextInput
              type="text"
              placeholder="Web app name"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap text-gray-900">URL</span>
            <TextInput
              type="text"
              placeholder="https://example.com"
              className="w-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="flex-2/3"
              onClick={() => {
                addWebapp({ campaign_id: -1, name, url, icon_path: iconPath });
                reset();
              }}
              disabled={name.trim().length === 0 || url.trim().length === 0 || iconPath.trim().length === 0}
            >
              Confirm
            </Button>
            <Button className="flex-1/3" color="gray" onClick={reset}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
