
'use client'
import { Card } from "flowbite-react";
// import FormatConfigTable from "@/components/settings/FormatConfigTable";
// import DatabaseConnection from "@/components/settings/DatabaseConnection";
import CampaignName from "@/components/settings/CampaignName";
import Section from "@/components/common/Section";
// import useCampaign from "@/hooks/mockups/useCampaign";
// import { useEffect } from "react";

const Page = () => {
  // const { selectedCampaignId, selectCampaignId } = useCampaign();
  // useEffect(() => {
  //   if (selectedCampaignId != ) {
  //   useCampaign.selectCampaignId(id);
  // }, []);
  return (<Card>
    <Section title="General">
      <CampaignName />
    </Section>
    {/* <Section title="Database Configuration">

    </Section> */}

    {/* <DatabaseConnection /> */}
    {/* <FormatConfigTable/> */}
  </Card>);
}

export default Page;