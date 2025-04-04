'use client';
import Card from "@/components/Card";
import CategoricalChart from "@/components/charts/CategoricalChart";
import NumericalBarChart from "@/components/charts/NumericalBarChart";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";
import useSampleCategoricalData from "@/hooks/useSampleCategoricalData";
import useSampleNumericalData from "@/hooks/useSampleNumericalData";


export default function Home() {
  const { data, loading, error } = useSampleNumericalData();
  const {
    data: categoricalData,
    loading: categoricalLoading,
    error: categoricalError } = useSampleCategoricalData();
  return (
    <div className="w-full min-h-full bg-gray-50 flex flex-row ">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex flex-col w-full items-stretch p-4 grow">
          <Card>
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
          <div className="mb-4"></div>
        </main>
      </div>
    </div>
  );
}
