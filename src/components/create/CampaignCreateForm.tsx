'use client'

import { Button } from "flowbite-react"
import CampaignName from "./CampaignName"
import Link from "next/link"
import CampaignSensors from "./CampaignTables"
export default function CampaignCreateForm() {
    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create campaign</h1>
            <CampaignName />
            <CampaignSensors />
            <div className="w-full gap-4 flex mt-5">
                <Button className="flex-2/3" size="lg">
                    Create Campaign
                </Button>
                <Link href="/campaigns" className="flex-1/3" >
                    <Button className="w-full" size="lg" color="gray">
                        Cancel
                    </Button>
                </Link>
            </div>
        </>
    )
}
