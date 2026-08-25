"use client";
import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import IconButton from "@/components/common/IconButton";
import SwitchingTextInput from "@/components/common/SwitchingTextInput";
import IconUploadInput from "@/components/common/IconUploadInput";

export default function WebappForm() {
  const { webapps, removeWebapp, updateWebappName, updateWebappUrl, updateWebappIcon } = useCampaignConfigEdit(
    (state) => state,
  );

  if (webapps.length === 0) {
    return (
      <div className="flex w-full items-center justify-center bg-gray-100 py-12">
        <p className="text-lg text-gray-500">No web app is configured</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {webapps.map((webapp, webappIndex) => (
        <Card key={webappIndex}>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <IconButton
                onClick={() => removeWebapp(webappIndex)}
                hoverColor="red"
                size="lg"
                className="icon-[humbleicons--times]"
              />
              <IconUploadInput
                size="sm"
                value={webapp.icon_path}
                onChange={(value) => updateWebappIcon(webappIndex, value)}
              />
              <SwitchingTextInput
                className="text-lg font-semibold whitespace-nowrap text-gray-900"
                value={webapp.name}
                onChange={(value) => updateWebappName(webappIndex, value)}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap text-gray-900">URL</span>
              <SwitchingTextInput
                sizing="sm"
                value={webapp.url}
                onChange={(value) => updateWebappUrl(webappIndex, value)}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
