"use client"
import ChartContainer from "@/components/dashboard/chart/ChartContainer";
import useTimeline from "@/hooks/chart/useTimeline";
import { ComparisonType } from "@/types/chart";
import { Card, Spinner } from "flowbite-react";
import { useMemo, useRef } from "react";
import SensorDropdown from "../SensorDropdown";
import useSectionState from "@/hooks/useSectionState";
import SectionTypeSelect from "../SectionTypeSelect";
import ParticipantDropdown from "../ParticipantDropdown";

const ComparisonChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { comparisonParams, updateComparisonParams, selectedSection, updateSelectedSection } = useSectionState()
    const currentComparisonParams = useMemo(() => comparisonParams[selectedSection], [comparisonParams, selectedSection])
    const { timeline, bucketSize, loading, error } = useTimeline(selectedSection, (chartRef.current?.clientWidth || 0) - 88);

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
                    <SensorDropdown
                        selectedFieldIds={currentComparisonParams.fieldId}
                        setSelectedFieldIds={(fieldId: number[]) => updateComparisonParams(selectedSection, { fieldId })}
                        isMultipleSelection={selectedSection === ComparisonType.Sensors}
                    />
                    <ParticipantDropdown
                        selectedParticipantIds={currentComparisonParams.uuid}
                        setSelectedParticipantIds={(uuid: string[]) => updateComparisonParams(selectedSection, { uuid })}
                        isMultipleSelection={selectedSection === ComparisonType.Participants}
                    />
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