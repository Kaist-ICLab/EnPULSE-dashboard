"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useComparisonChartTimeline from "@/hooks/useComparisonChartData";
import { ChartParams, ChartType } from "@/types/chart";
import { Card, Select, Spinner } from "flowbite-react";


const ComparisonChart: React.FC<({
    params: ChartParams;
    setParams: (type: ChartType, params: ChartParams) => void;
    type: ChartType;
})> = ({ params, setParams, type }) => {
    const { timeline, loading, error } = useComparisonChartTimeline(params, type);

    const chartName = (() => {
        switch (type) {
            case ChartType.IntraPerson:
                return "Intra-Person Comparison";
            case ChartType.InterPerson:
                return "Inter-Person Comparison";
            default:
                return "Timeline Overview";
        }
    })();


    const defaultTimeRange = {
        start: new Date().setHours(0, 0, 0, 0),
        end: new Date().setHours(23, 59, 59, 999),
    }

    // Mock user data - replace with actual user data from your backend
    const users = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
        { id: "3", name: "User 3" },
    ];

    const sensors = [
        { id: "call_log", name: "call_log" },
        { id: "location", name: "location" },
        { id: "battery", name: "battery" },
        { id: "x_y", name: "x_y" },
        { id: "x_z", name: "x_z" },
    ];

    return (
        <Card id={`${type}-comparison-chart`}>
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold">{chartName}</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {type !== ChartType.InterPerson && <div className="w-full sm:w-48">
                            <Select
                                icon={() => <span className="icon-[material-symbols--person-rounded]"></span>}
                                value={params.uid}
                                onChange={(e) => setParams(type, { ...params, uid: e.target.value })}
                            >
                                <option value="">Select User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Select>
                        </div>}
                        {type !== ChartType.TimelineOverview && <div className="w-full sm:w-48">
                            <Select
                                icon={() => <span className="icon-[material-symbols--sensors-rounded]"></span>}
                                value={params.sid}
                                onChange={(e) => setParams(type, { ...params, sid: e.target.value })}
                            >
                                <option value="">Select Sensor</option>
                                {sensors.map((sensor) => (
                                    <option key={sensor.id} value={sensor.id}>
                                        {sensor.name}
                                    </option>
                                ))}
                            </Select>
                        </div>}
                        {type !== ChartType.IntraPerson && <div className="w-full sm:w-48">
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={params.date.toISOString().split('T')[0]}
                                onChange={(e) => setParams(type, { ...params, date: new Date(e.target.value) })}
                            />
                        </div>}
                    </div>
                </div>

                <div className="w-full rounded-lg py-4 flex flex-col gap-4">
                    {loading && <Spinner className="w-full" />}
                    {error && (
                        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error}</p>
                    )}
                    {timeline.length > 0 && <ChartContainer
                        timelines={timeline}
                        chartType={type}
                        setChartParams={t => setParams(t, params)}
                        defaultTimeRange={defaultTimeRange} />
                    }
                </div>
            </div>
        </Card>
    )
}

export { ComparisonChart }