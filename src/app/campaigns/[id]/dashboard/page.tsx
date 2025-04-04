"use client";
import Card from "@/components/Card";
import CategoricalTimeline from "@/components/charts/CategoricalTimeline";
import NumericalTimeline from "@/components/charts/NumericalTimeline";
import Loading from "@/components/Loading";
import UserDailyStatTable from "@/components/UserDailyTable";
import useSampleCategoricalData from "@/hooks/useSampleCategoricalData";
import useSampleNumericalData from "@/hooks/useSampleNumericalData";

const Page = () => {
  const { data, loading, error } = useSampleNumericalData();
  const {
    data: categoricalData,
    loading: categoricalLoading,
    error: categoricalError } = useSampleCategoricalData();
  return (<>
    <UserDailyStatTable />
    <Card>
      {loading && <Loading />}
      {error && (
        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error}</p>
      )}
      {data && (
        <NumericalTimeline
          title="Sample Timeline"
          data={data}
          height={400}
        />
      )}
    </Card>
    {/* <Card>
      {categoricalLoading && <Loading />}
      {categoricalError && (
        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {categoricalError}</p>
      )}
      {categoricalData && (
        <CategoricalTimeline
          title="Sample Timeline"
          data={categoricalData}
          height={400}
        />
      )}
    </Card> */}
  </>



  );
}

export default Page;