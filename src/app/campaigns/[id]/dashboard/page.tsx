import { ComparisonChart } from "@/components/dashboard/chart/ComparisonChart";
import DailyOverviewTable from "@/components/dashboard/stat/DailyStatTable";

const Page = () => {
  return (
    <>
      <DailyOverviewTable />

      <ComparisonChart />
    </>
  );
};

export default Page;
