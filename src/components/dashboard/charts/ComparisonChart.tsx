"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useTimeline from "@/hooks/charts/useTimeline";
import useCampaign from "@/hooks/useCampaign";
import { SectionType } from "@/types/chart";
import { Card, Select, Spinner } from "flowbite-react";
import { useMemo, useRef, useState } from "react";
import SensorDropdown from "../SensorDropdown";
import useSectionState from "@/hooks/useSectionState";
import TimelineOverviewTabButton from "../TimelineOverviewTabButton";

const ComparisonChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { campaignParticipants, mergedTabledFields } = useCampaign()
    const { timelineParams, updateTimelineParams, selectedSection, updateSelectedSection } = useSectionState()

    const [isFieldSelected, setIsFieldSelected] = useState<{ [key: number]: boolean }>(mergedTabledFields.reduce((acc, field) => {
        acc[field.id] = false
        return acc
    }, {} as { [key: number]: boolean }))

    const selectedFields = useMemo(() => mergedTabledFields.filter(v => isFieldSelected[v.id] || selectedSection !== SectionType.TimelineOverview), [isFieldSelected, mergedTabledFields, selectedSection])
    const { timeline, bucketSize, loading, error } = useTimeline(selectedSection, selectedFields, (chartRef.current?.clientWidth || 0) - 88);

    const users = useMemo(() => {
        return Array.from(campaignParticipants.values()).map(v => ({ id: v.uuid, name: v.email }))
    }, [campaignParticipants])

    return (
        <Card>
            <div className="w-full flex flex-row items-center">
                <div className="flex flex-row items-center">
                    Comparison between
                    <div className="w-2" />
                    <TimelineOverviewTabButton isSelected={selectedSection === SectionType.TimelineOverview} onClick={() => updateSelectedSection(SectionType.TimelineOverview)}>
                        <span className="icon-[material-symbols--sensors-rounded] mr-2"></span> Sensors
                    </TimelineOverviewTabButton>
                    <TimelineOverviewTabButton isSelected={selectedSection === SectionType.InterPerson} onClick={() => updateSelectedSection(SectionType.InterPerson)}>
                        <span className="icon-[material-symbols--sensors-rounded] mr-2"></span> Participants
                    </TimelineOverviewTabButton>
                    <TimelineOverviewTabButton isSelected={selectedSection === SectionType.IntraPerson} onClick={() => updateSelectedSection(SectionType.IntraPerson)}>
                        <span className="icon-[material-symbols--sensors-rounded] mr-2"></span> Days
                    </TimelineOverviewTabButton>
                </div>
                <div className="flex flex-row ml-auto gap-2">
                    {selectedSection == SectionType.TimelineOverview &&
                        <SensorDropdown
                            isFieldSelected={isFieldSelected}
                            setIsFieldSelected={setIsFieldSelected}
                            isMultipleSelection={true}
                        />
                    }
                    {selectedSection !== SectionType.InterPerson && <div className="w-full sm:w-48">
                        <Select
                            value={timelineParams.uuid}
                            onChange={(e) => updateTimelineParams({ uuid: e.target.value })}
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </Select>
                    </div>}
                    {selectedSection !== SectionType.TimelineOverview && <div className="w-full sm:w-48">
                        <Select
                            icon={() => <span className="icon-[material-symbols--sensors-rounded]"></span>}
                            value={timelineParams.fieldId}
                            onChange={(e) => updateTimelineParams({ fieldId: parseInt(e.target.value) })}
                        >
                            <option value="">Select Sensor</option>
                            {Object.values(mergedTabledFields).flat().map((sensor) => (
                                <option key={sensor.id} value={sensor.id}>
                                    {sensor.displayName}
                                </option>
                            ))}
                        </Select>
                    </div>}
                    {/* <div className="w-full sm:w-32">
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={dayjs(date).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const date = dayjs(e.target.value).startOf('day').toDate();
                                    updateSectionParams(sectionType, { date })
                                    initTimeRange(sectionType)
                                }}
                            />
                        </div> */}
                </div>
            </div>
            <div className="w-full">
                <div className="w-full rounded-lg flex flex-col gap-4 items-center justify-center relative" ref={chartRef}>
                    {loading && <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-white/50 backdrop-blur-sm rounded-lg">
                        <Spinner className="" />
                    </div>
                    }
                    {error && (
                        <p className="text-red-500 font-medium">Failed to load data: {error.message}</p>
                    )}
                    {timeline.length > 0 && <ChartContainer
                        timelines={timeline}
                        bucketSize={bucketSize}
                    />
                    }
                </div>
            </div>
        </Card>
    )
}

export { ComparisonChart }