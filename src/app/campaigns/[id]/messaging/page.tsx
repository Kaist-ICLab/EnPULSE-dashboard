import Card from "@/components/Card";
import CampaignLayout from "@/app/campaigns/[id]/layout";
import type { NextPageWithLayout } from '@/app/_app'

const Messaging: NextPageWithLayout = () => {
    return (
      <Card>
        <p>This is the messaging page.</p>
      </Card>
    );
}

Messaging.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <CampaignLayout>
            {page}
        </CampaignLayout>
    );
}

export default Messaging;