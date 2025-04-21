"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useFakeBatteryData from "@/hooks/useFakeBatteryData";
import { Card, Select, Spinner } from "flowbite-react";
import { useState } from "react";


const TimelineOverview: React.FC<({
    userId: string;
    setUserId: (userId: string) => void;
})> = ({ userId, setUserId }) => {
    const { data, loading, error } = useFakeBatteryData();
    const [date, setDate] = useState<Date>(new Date());

    // Mock user data - replace with actual user data from your backend
    const users = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
        { id: "3", name: "User 3" },
    ];
    const defaultTimeRange = {
        start: new Date().setHours(0, 0, 0, 0),
        end: new Date().setHours(23, 59, 59, 999),
    }
    return (
        <Card>
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <h2 className="text-xl font-semibold">Timeline Overview</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-48">
                            <Select
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
                        </div>
                        <div className="w-full sm:w-48">
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={date.toISOString().split('T')[0]}
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-lg p-4 flex flex-col gap-4">
                    {loading && <Spinner className="w-full" />}
                    {error && (
                        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error}</p>
                    )}
                    {data && (
                        <ChartContainer timelines={[
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
                            }
                        ]} defaultTimeRange={defaultTimeRange} />
                    )}
                </div>
            </div>
        </Card>
    )
}

export default TimelineOverview 