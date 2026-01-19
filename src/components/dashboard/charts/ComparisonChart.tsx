"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useTimeline from "@/hooks/charts/useTimeline";
import useCampaign from "@/hooks/useCampaign";
import { SectionType } from "@/types/chart";
import { Card, Select, Spinner } from "flowbite-react";
import { useMemo, useRef, useState } from "react";
import SensorDropdown from "../SensorDropdown";
import useSectionState from "@/hooks/useSectionState";
import dayjs from "dayjs";

function getChartName(sectionType: SectionType) {
    switch (sectionType) {
        case SectionType.IntraPerson:
            return "Intra-Person Comparison";
        case SectionType.InterPerson:
            return "Inter-Person Comparison";
        default:
            return "Timeline Overview";
    }
}

const ComparisonChart: React.FC<{
    sectionType: SectionType;
}> = ({ sectionType }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { campaignParticipants, mergedTabledFields } = useCampaign()
    const { sectionParams, updateSectionParams, initTimeRange } = useSectionState()

    const [isFieldSelected, setIsFieldSelected] = useState<{ [key: number]: boolean }>(mergedTabledFields.reduce((acc, field) => {
        acc[field.id] = false
        return acc
    }, {} as { [key: number]: boolean }))

    const selectedFields = useMemo(() => mergedTabledFields.filter(v => isFieldSelected[v.id] || sectionType !== SectionType.TimelineOverview), [isFieldSelected, mergedTabledFields, sectionType])
    const currentSectionParams = useMemo(() => sectionParams[sectionType], [sectionParams, sectionType])
    const { timeline, bucketSize, loading, error } = useTimeline(sectionType, selectedFields, (chartRef.current?.clientWidth || 0) - 88);

    const users = useMemo(() => {
        return Array.from(campaignParticipants.values()).map(v => ({ id: v.uuid, name: v.email }))
    }, [campaignParticipants])

    return (
        <Card id={`${sectionType}-comparison-chart`}>
            <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold">{getChartName(sectionType)}</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {sectionType == SectionType.TimelineOverview &&
                            <SensorDropdown
                                isFieldSelected={isFieldSelected}
                                setIsFieldSelected={setIsFieldSelected}
                                isMultipleSelection={true}
                            />
                        }
                        {sectionType !== SectionType.InterPerson && <div className="w-full sm:w-48">
                            <Select
                                value={sectionParams[sectionType].uuid}
                                onChange={(e) => updateSectionParams(sectionType, { uuid: e.target.value })}
                            >
                                <option value="">Select User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Select>
                        </div>}
                        {sectionType !== SectionType.TimelineOverview && <div className="w-full sm:w-48">
                            <Select
                                icon={() => <span className="icon-[material-symbols--sensors-rounded]"></span>}
                                value={currentSectionParams.fieldId}
                                onChange={(e) => updateSectionParams(sectionType, { fieldId: parseInt(e.target.value) })}
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
                                value={dayjs(currentSectionParams.date).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const date = dayjs(e.target.value).startOf('day').toDate();
                                    updateSectionParams(sectionType, { date })
                                    initTimeRange(sectionType)
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-lg py-4 flex flex-col gap-4 items-center justify-center relative" ref={chartRef}>
                    {loading && <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-white/50 backdrop-blur-sm rounded-lg">
                        <Spinner className="" />
                    </div>
                    }
                    {error && (
                        <p className="text-red-500 font-medium">Failed to load data: {error.message}</p>
                    )}
                    {timeline.length > 0 && <ChartContainer
                        timelines={timeline.filter(v => (isFieldSelected[v.params.fieldId] || sectionType !== SectionType.TimelineOverview))}
                        sectionType={sectionType}
                        bucketSize={bucketSize}
                    />
                    }
                </div>
            </div>
        </Card>
    )
}

export { ComparisonChart }