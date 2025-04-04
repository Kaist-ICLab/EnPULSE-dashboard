import Card from "@/components/Card";
import CategoricalChart from "@/components/charts/CategoricalChart";
import NumericalBarChart from "@/components/charts/NumericalBarChart";
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
    <Card>
      <UserDailyStatTable />
      {loading && <Loading />}
      {error && (
        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error}</p>
      )}
      {data && (
        <NumericalBarChart
          title="Sample Timeline"
          data={data}
          height={400}
        />
      )}
    </Card>
    <Card>
      {categoricalLoading && <Loading />}
      {categoricalError && (
        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {categoricalError}</p>
      )}
      {categoricalData && (
        <CategoricalChart
          title="Sample Timeline"
          data={categoricalData}
          height={400}
        />
      )}
    </Card>
  </>



  );
}

export default Page;