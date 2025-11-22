import Section from "@/components/common/Section";
import CampaignName from "@/components/settings/CampaignName";
import DisplayConfiguration from "@/components/settings/DisplayConfiguration";
import { Card } from "flowbite-react";

const Page = () => {
    return (<Card className="m-4">
        <Section title="General">
            <CampaignName />
        </Section>
        <Section title="Database Configuration">
            <DisplayConfiguration />
        </Section>
    </Card>);
}

export default Page;