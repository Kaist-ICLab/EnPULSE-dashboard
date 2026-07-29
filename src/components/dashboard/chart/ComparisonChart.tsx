"use client"
import ChartContainer from "@/components/dashboard/chart/ChartContainer";
import useTimeline from "@/hooks/chart/useTimeline";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { ComparisonType } from "@/types/dashboard";
import { Button, Card, Spinner } from "flowbite-react";
import Link from 'next/link';
import { useMemo, useRef, useState } from "react";
import ParticipantDropdown from "../ParticipantDropdown";
import SectionTypeSelect from "../SectionTypeSelect";
import SensorFieldDropdown from "../SensorFieldDropdown";

const ComparisonChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { comparisonParams, updateComparisonParams, selectedSection, updateSelectedSection, updateDate, updatePinQuery } = useSectionParamStore((state) => state);
    const currentComparisonParams = useMemo(() => comparisonParams[selectedSection], [comparisonParams, selectedSection])
    const { timeline, bucketSize, loading, error } = useTimeline(selectedSection, (chartRef.current?.clientWidth || 0) - 88);
    const [selectedChart, setSelectedChart] = useState<string | null>(null);

    const comparisonName = {
        [ComparisonType.Participants]: "Participants",
        [ComparisonType.Sensors]: "Sensors",
        [ComparisonType.Days]: "Days"
    }

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
                    <SensorFieldDropdown
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
            <div className={`flex flex-row items-center justify-between bg-blue-100 text-gray-700 h-10 px-3 rounded-lg ${selectedChart ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {
                    selectedChart ? (
                        <>
                            <span>
                                <span className="font-medium">Selected Chart: </span>
                                <span>{timeline.find(t => t.id === selectedChart)?.title}</span>
                            </span>
                            <div className="flex flex-row gap-2 items-center">
                                <span className="font-medium">Compare with other</span>
                                {Object.entries(comparisonName).map(([type, value]) => (
                                    selectedSection !== type && <Link key={type} href={`./dashboard/#${type}-comparison-chart`}>
                                        <Button
                                            size="2xs"
                                            className="flex flex-row gap-1 px-2.5 py-1"
                                            onClick={() => {
                                                const params = timeline.find(t => t.id === selectedChart)!.params
                                                const isSurvey = params.questionId !== undefined
                                                updateComparisonParams(type as ComparisonType, {
                                                    uuid: [params.uuid],
                                                    fieldId: isSurvey ? [] : [params.fieldId],
                                                    questionId: isSurvey ? [params.questionId!] : [],
                                                })
                                                updateDate(params.date)
                                                updatePinQuery({ ...params, questionId: params.questionId ?? null })
                                                updateSelectedSection(type as ComparisonType)
                                                setSelectedChart(null)
                                            }}
                                        >
                                            <span className="text-sm">{value}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <span>No chart selected</span>
                    )
                }
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
                            selectedChart={selectedChart}
                            setSelectedChart={setSelectedChart}
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

