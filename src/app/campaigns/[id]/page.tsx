import Card from "@/components/Card";
import CampaignLayout from "@/app/campaigns/[id]/layout";
import type { NextPageWithLayout } from '@/app/_app'

// Overview of Campaign
const Campaigns: NextPageWithLayout = () => {
    return (
        <Card>
            <p>This is the overview page of the current Campaign.</p>
        </Card>
    );
}

Campaigns.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <CampaignLayout>
            {page}
        </CampaignLayout>
    );
}

export default Campaigns;