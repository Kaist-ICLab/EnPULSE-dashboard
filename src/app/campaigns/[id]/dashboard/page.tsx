import { ComparisonChart } from "@/components/dashboard/chart/ComparisonChart";
import DailyOverviewTable from "@/components/dashboard/stat/DailyStatTable";
// import SendMessageFloatingModal from "@/components/messaging/SendMessageFloatingModal";
// import { CampaignParticipant } from "@/types/campaign";

const Page = () => {
  // const [sendTo, setSendTo] = useState<CampaignParticipant[]>([]);
  // const [messageModalVisible, setMessageModalVisible] = useState<boolean>(false);

  return (
    <>
      <DailyOverviewTable />

      <ComparisonChart />

      {
        // messageModalVisible && <SendMessageFloatingModal
        //     initialSendTo={sendTo}
        //     onClose={() => setMessageModalVisible(false)}
        // />
      }
    </>
  );
};

export default Page;
