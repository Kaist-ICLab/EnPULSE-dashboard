"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useTimeline from "@/hooks/charts/useTimeline";
import useCampaign from "@/hooks/useCampaign";
import { ChartParams, ChartType, PinQuery } from "@/types/chart";
import { Card, Select, Spinner } from "flowbite-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SensorDropdown from "../SensorDropdown";

const defaultTimeRange = {
    start: new Date(0).setHours(0, 0, 0, 0),
    end: new Date(0).setHours(23, 59, 59, 999),
}

const ComparisonChart: React.FC<({
    params: ChartParams;
    setParams: (type: ChartType, params: ChartParams) => void;
    type: ChartType;
    pinQuery: PinQuery;
    setPinQuery: (pinQuery: PinQuery) => void;
})> = ({ params, setParams, type, pinQuery, setPinQuery }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [timeRange, setTimeRange] = useState<{ start: number, end: number }>(defaultTimeRange);
    const { campaignParticipants, mergedTabledFields } = useCampaign()

    const [isFieldSelected, setIsFieldSelected] = useState<{ [key: number]: boolean }>(mergedTabledFields.reduce((acc, field) => {
        acc[field.id] = false
        return acc
    }, {} as { [key: number]: boolean }))
    const selectedFields = useMemo(() => mergedTabledFields.filter(v => isFieldSelected[v.id] || type !== ChartType.TimelineOverview), [isFieldSelected, mergedTabledFields, type])
    const { timeline, loading, error } = useTimeline(params, type, selectedFields, (chartRef.current?.clientWidth || 0) - 100, timeRange);


    const users = useMemo(() => {
        return Array.from(campaignParticipants.values()).map(v => ({ id: v.uuid, name: v.email }))
    }, [campaignParticipants])

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

    useEffect(() => {
        setTimeRange(defaultTimeRange)
    }, [])

    return (
        <Card id={`${type}-comparison-chart`}>
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold">{chartName}</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {type == ChartType.TimelineOverview &&
                            <SensorDropdown
                                isFieldSelected={isFieldSelected}
                                setIsFieldSelected={setIsFieldSelected}
                            />
                        }
                        {type !== ChartType.InterPerson && <div className="w-full sm:w-48">
                            <Select
                                value={params.uuid}
                                onChange={(e) => setParams(type, { ...params, uuid: e.target.value })}
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
                                value={params.fieldId}
                                onChange={(e) => setParams(type, { ...params, fieldId: parseInt(e.target.value) })}
                            >
                                <option value="">Select Sensor</option>
                                {Object.values(mergedTabledFields).flat().map((sensor) => (
                                    <option key={sensor.id} value={sensor.id}>
                                        {sensor.displayName}
                                    </option>
                                ))}
                            </Select>
                        </div>}
                        <div className="w-full sm:w-32">
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={params.date.toISOString().split('T')[0]}
                                onChange={(e) => setParams(type, { ...params, date: new Date(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-lg py-4 flex flex-col gap-4" ref={chartRef}>
                    {loading && <Spinner className="w-full" />}
                    {error && (
                        <p className="text-red-500 font-medium">❌ 데이터 로딩 실패: {error.message}</p>
                    )}
                    {timeline.length > 0 && <ChartContainer
                        timelines={timeline.filter(v => (isFieldSelected[v.params.fieldId] || type !== ChartType.TimelineOverview))}
                        chartType={type}
                        setChartParams={setParams}
                        pinQuery={pinQuery}
                        setPinQuery={setPinQuery}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        defaultTimeRange={defaultTimeRange}
                    />
                    }
                </div>
            </div>
        </Card>
    )
}

export { ComparisonChart }