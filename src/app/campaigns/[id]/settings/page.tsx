import Card from "@/components/Card";
import CampaignLayout from "@/app/campaigns/[id]/layout";
import type { NextPageWithLayout } from '@/app/_app'

const Settings: NextPageWithLayout = () => {
    return (
      <Card>
        <p>This is the settings page.</p>
      </Card>
    );
}

Settings.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <CampaignLayout>
            {page}
        </CampaignLayout>
    );
}

export default Settings;