"use client"
import ChartContainer from "@/components/dashboard/charts/ChartContainer";
import useTimeline from "@/hooks/charts/useTimeline";
import useCampaign from "@/hooks/useCampaign";
import { ComparisonType } from "@/types/chart";
import { Card, Select, Spinner } from "flowbite-react";
import { useMemo, useRef, useState } from "react";
import SensorDropdown from "../SensorDropdown";
import useSectionState from "@/hooks/useSectionState";
import SectionTypeSelect from "../SectionTypeSelect";

const ComparisonChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { campaignParticipants, mergedTabledFields } = useCampaign()
    const { timelineParams, updateTimelineParams, selectedSection, updateSelectedSection } = useSectionState()

    const [isFieldSelected, setIsFieldSelected] = useState<{ [key: number]: boolean }>(mergedTabledFields.reduce((acc, field) => {
        acc[field.id] = false
        return acc
    }, {} as { [key: number]: boolean }))

    const selectedFields = useMemo(() => mergedTabledFields.filter(v => isFieldSelected[v.id] || selectedSection !== ComparisonType.Sensors), [isFieldSelected, mergedTabledFields, selectedSection])
    const { timeline, bucketSize, loading, error } = useTimeline(selectedSection, selectedFields, (chartRef.current?.clientWidth || 0) - 88);

    return (
        <Card>
            <div className="w-full flex flex-row items-center">
                <div className="flex flex-row items-center gap-2">
                    <h2 className="text-2xl font-semibold">Comparison between</h2>
                    <SectionTypeSelect
                        selectedSection={selectedSection}
                        updateSelectedSection={updateSelectedSection}
                    />
                </div>
                <div className="flex flex-row ml-auto gap-2">
                    {selectedSection == ComparisonType.Sensors &&
                        <SensorDropdown
                            isFieldSelected={isFieldSelected}
                            setIsFieldSelected={setIsFieldSelected}
                            isMultipleSelection={true}
                        />
                    }
                    {selectedSection !== ComparisonType.Participants && <div className="w-full sm:w-48">
                        <Select
                            value={timelineParams.uuid}
                            onChange={(e) => updateTimelineParams({ uuid: e.target.value })}
                        >
                            <option value="">Select User</option>
                            {Array.from(campaignParticipants.values()).map((user) => (
                                <option key={user.uuid} value={user.uuid}>
                                    {user.email}
                                </option>
                            ))}
                        </Select>
                    </div>}
                    {selectedSection !== ComparisonType.Sensors && <div className="w-full sm:w-48">
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