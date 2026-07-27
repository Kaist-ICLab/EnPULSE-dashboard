"use client"
import ChartContainer from "@/components/dashboard/chart/ChartContainer";
import useTimeline from "@/hooks/chart/useTimeline";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { ComparisonType } from "@/types/dashboard";
import { Card, Spinner } from "flowbite-react";
import { useMemo, useRef } from "react";
import ParticipantDropdown from "../ParticipantDropdown";
import SectionTypeSelect from "../SectionTypeSelect";
import SensorDropdown from "../SensorDropdown";

const ComparisonChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { comparisonParams, updateComparisonParams, selectedSection, updateSelectedSection } = useSectionParamStore((state) => state);
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
                        selectedQuestionIds={currentComparisonParams.questionId}
                        setSelectedFieldIds={(fieldId: number[]) => updateComparisonParams(selectedSection, { fieldId })}
                        setSelectedQuestionIds={(questionId: number[]) => updateComparisonParams(selectedSection, { questionId })}
                        isMultipleSelection={selectedSection === ComparisonType.Sensors}
                    />
                    <ParticipantDropdown
                        selectedParticipantIds={currentComparisonParams.uuid}
                        setSelectedParticipantIds={(uuid: string[]) => updateComparisonParams(selectedSection, { uuid })}
                        isMultipleSelection={selectedSection === ComparisonType.Participants}
                    />
                </div>
            </div>
            <div className="w-full">
                <div className="w-full rounded-lg flex flex-col gap-4 items-center justify-center relative" ref={chartRef}>
                    {loading && <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-white/50 backdrop-blur-sm rounded-lg">
                        <Spinner className="" />
                    </div>
                    }
                    {error && (
                        <div className="text-red-500 font-medium">Failed to load data: {error.message}</div>
                    )}
                    {timeline.length > 0 ? (
                        <ChartContainer
                            timelines={timeline}
                            bucketSize={bucketSize}
                        />
                    ) : (
                        <ComprisonChartEmpty
                            isUuidEmpty={currentComparisonParams.uuid.length === 0}
                            isFieldIdEmpty={currentComparisonParams.fieldId.length === 0 && currentComparisonParams.questionId.length === 0}
                        />
                    )}
                </div>
            </div>
        </Card>
    )
}

const ComprisonChartEmpty: React.FC<{
    isUuidEmpty: boolean;
    isFieldIdEmpty: boolean;
}> = ({ isUuidEmpty, isFieldIdEmpty }) => {
    return (<div className="text-gray-500 font-medium bg-gray-100 min-h-48 w-full rounded-lg flex items-center justify-center">
        {
            (isUuidEmpty !== isFieldIdEmpty) ? (
                <>Select at least one {isFieldIdEmpty ? "sensor" : "participant"} to view data</>
            ) : (
                <>Select at least one sensor and participants to view data</>
            )
        }
    </div>)
}

export { ComparisonChart };
