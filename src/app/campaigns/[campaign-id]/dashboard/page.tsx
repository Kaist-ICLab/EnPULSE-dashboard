import Card from "@/components/Card";
import CampaignLayout from "@/app/campaigns/layout";
import type { NextPageWithLayout } from '@/app/_app'

const Dashboard: NextPageWithLayout = () => {
    return (
      <Card>
        <p>This is the dashboard page.</p>
      </Card>
    );
}

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <CampaignLayout>
            {page}
        </CampaignLayout>
    );
}

export default Dashboard;