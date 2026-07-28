'use client'
import { Card } from "flowbite-react";
import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import IconButton from "@/components/common/IconButton";
import SwitchingTextInput from "@/components/common/SwitchingTextInput";

export default function WebappForm() {
    const { webapps, removeWebapp, updateWebappName, updateWebappUrl } = useCampaignConfigEdit((state) => state);

    if (webapps.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-12 bg-gray-100">
                <p className="text-gray-500 text-lg">No web app is configured</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-4">
            {webapps.map((webapp, webappIndex) => (
                <Card key={webappIndex}>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <IconButton
                                onClick={() => removeWebapp(webappIndex)}
                                hoverColor="red"
                                size="lg"
                                className="icon-[humbleicons--times]"
                            />
                            <SwitchingTextInput className="text-lg font-semibold text-gray-900 whitespace-nowrap" value={webapp.name} onChange={(value) => updateWebappName(webappIndex, value)} />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                URL
                            </span>
                            <SwitchingTextInput sizing="sm" value={webapp.url} onChange={(value) => updateWebappUrl(webappIndex, value)} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
