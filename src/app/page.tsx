'use client';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const table_data = [
    { uid: "p01@gmail.com",
      contact_history: 13,
      data: {
        "APP_USAGE": {
          "max_count": 30,
          "count": 20,
          "timeline": 10
        },
        "LOCATION": {
          "max_count": 30,
          "count": 20,
          "timeline": 5
        },
        "CALL_LOG": {
          "max_count": 30,
          "count": 20,
          "timeline": 20
        },
        "BATTERY": {
          "max_count": 30,
          "count": 20,
          "timeline": 20
        }
      }
    },
  ]

  return (
    <div className="w-full min-h-full bg-gray-50 flex flex-row ">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex flex-col w-full items-stretch p-4 grow">
          {/* <Card>
            {loading && <Loading />}
            {error && (
              <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error}</p>
            )}
            {data && (
              <SampleTimeline
                title="Sample Timeline"
                data={data}
                height={400}
              />
            )}
          </Card> */}
          {/* <Table headers={["APP_USAGE", "CALL_LOG", "LOCATION", "BATTERY"]} table_data={table_data} /> */}

        </main>
      </div>
    </div>
  );
}
