"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useFakeAppUsageData from "@/hooks/useFakeAppUsageData";
import useFakeBatteryData from "@/hooks/useFakeBatteryData";
import { ChartType, TimelineData } from "@/types/chart";
import { Card, Select, Spinner } from "flowbite-react";
import { useState } from "react";

const defaultTimeRange = {
    start: new Date().setHours(0, 0, 0, 0),
    end: new Date().setHours(23, 59, 59, 999),
}

const TimelineOverview: React.FC<({
    userId: string;
    setUserId: (userId: string) => void;
})> = ({ userId, setUserId }) => {
    const { data, loading, error } = useFakeBatteryData();
    const { data: appUsageData } = useFakeAppUsageData();

    return <ComparisonChart
        userId={userId}
        setUserId={setUserId}
        loading={loading}
        error={error}
        type={ChartType.TimelineOverview}
        timelines={(data && appUsageData) ? (
            [
                {
                    title: "Battery Charge Type",
                    id: "battery-chargetype",
                    table: "battery",
                    column: "chargetype",
                    chartType: "categorical",
                    timestamp: data.timestamp,
                    value: data.chargetype
                },
                {
                    title: "Battery Level",
                    id: "battery-level",
                    table: "battery",
                    column: "level",
                    chartType: "numerical",
                    timestamp: data.timestamp,
                    value: data.level
                },
                {
                    title: "App Usage",
                    id: "app-usage",
                    table: "app_usage",
                    column: "app_name",
                    chartType: "categorical",
                    timestamp: appUsageData.timestamp,
                    value: appUsageData.appName
                }
            ]) : []}
    />
}

const IntraPersonComparison: React.FC<({
    userId: string;
    setUserId: (userId: string) => void;
})> = ({ userId, setUserId }) => {
    const { data, loading, error } = useFakeBatteryData();
    const { data: appUsageData } = useFakeAppUsageData();

    console.log(data, appUsageData);
    return (
        <ComparisonChart
            userId={userId}
            setUserId={setUserId}
            loading={loading}
            error={error}
            type={ChartType.IntraPerson}
            timelines={data && appUsageData ? (
                [
                    {
                        title: "2025-04-23",
                        id: "2025-04-23",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                    {
                        title: "2025-04-22",
                        id: "2025-04-22",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                    {
                        title: "2025-04-21",
                        id: "2025-04-21",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                    {
                        title: "2025-04-20",
                        id: "2025-04-20",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                ]) : []} />
    )
}

const InterPersonComparison: React.FC<({
    userId: string;
    setUserId: (userId: string) => void;
})> = ({ userId, setUserId }) => {
    const { data, loading, error } = useFakeBatteryData();
    const { data: appUsageData } = useFakeAppUsageData();

    console.log(data, appUsageData);
    return (
        <ComparisonChart
            userId={userId}
            setUserId={setUserId}
            loading={loading}
            error={error}
            type={ChartType.InterPerson}
            timelines={data && appUsageData ? (
                [
                    {
                        title: "p01@gmail.com",
                        id: "1",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                    {
                        title: "p02@gmail.com",
                        id: "2",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                    {
                        title: "p03@gmail.com",
                        id: "3",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                    {
                        title: "p04@gmail.com",
                        id: "4",
                        table: "battery",
                        column: "chargetype",
                        chartType: "categorical",
                        timestamp: data.timestamp,
                        value: data.chargetype
                    },
                ]) : []} />
    )
}

const ComparisonChart: React.FC<({
    userId: string;
    setUserId: (userId: string) => void;
    loading: boolean;
    error: string | null;
    timelines: TimelineData[];
    type: ChartType;
})> = ({ userId, setUserId, loading, error, timelines, type }) => {

    console.log(timelines)

    const [date, setDate] = useState<Date>(new Date());

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
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
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
                                defaultValue={sensors[0].id}
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
                                value={date.toISOString().split('T')[0]}
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                        </div>}
                    </div>
                </div>

                <div className="w-full rounded-lg py-4 flex flex-col gap-4">
                    {loading && <Spinner className="w-full" />}
                    {error && (
                        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error}</p>
                    )}
                    {timelines.length > 0 && <ChartContainer timelines={timelines} chartType={type} defaultTimeRange={defaultTimeRange} />}
                </div>
            </div>
        </Card>
    )
}

export { IntraPersonComparison, InterPersonComparison, TimelineOverview }