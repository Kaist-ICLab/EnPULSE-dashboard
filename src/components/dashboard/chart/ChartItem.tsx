import { DnDItem, DragHandle } from "@/components/common/DnDList";
import IconButton from "@/components/common/IconButton";
import TimelineChart from "@/components/dashboard/chart/TimelineChart";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { TimelineData, TimelineSurveyEventPoint } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { ParentSize } from "@visx/responsive";
import { useState } from "react";
import { SurveyDistributionModal } from "./SurveyDistributionModal";

export const ChartItem: React.FC<{
    timeline: TimelineData;
    pinned: boolean;
    isSelected: boolean;
    setSelectedChart: (id: string | null) => void;
    bucketSize: number;
    sectionType: ComparisonType;
}> = ({ timeline, pinned, isSelected, setSelectedChart, bucketSize, sectionType }) => {
    const { updatePinQuery, updateComparisonParams, comparisonParams, date } = useSectionParamStore((state) => state);
    const [distributionOpen, setDistributionOpen] = useState(false);

    if (!timeline) return

    // In Days mode each chart is its own date; otherwise the chart should
    // track the store's date so it doesn't snap back to the previously-fetched
    // params.date during the brief window before new data arrives.
    const baseTime = sectionType === ComparisonType.Days
        ? timeline.params.date.getTime()
        : date.getTime();

    const isSurvey = timeline.chartType === 'survey_events';

    return (
        <DnDItem id={timeline.id} className={`w-full flex flex-row justify-center items-center p-2`}>
            <div className='shrink-0 flex items-center' onClick={() => {
                setSelectedChart(isSelected ? null : timeline.id);
            }} >
                <DragHandle className="flex flex-row justify-center items-center">
                    <span className='w-6 h-6 mr-1 text-gray-300 icon-[mdi--hamburger-menu]' />
                </DragHandle>
            </div>
            <div className='grow min-w-0 flex flex-col' onClick={() => {
                setSelectedChart(isSelected ? null : timeline.id);
            }}>
                <div className={`w-fit flex flex-row justify-center items-center h-8 px-2 rounded-tl-md rounded-tr-md ${isSelected ? 'bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    {pinned ? <span className="text-blue-600 w-5 h-5 icon-[mdi--pin] translate-y-0.25" /> : null}
                    <span className="truncate mr-2">{timeline.title}</span>
                    <IconButton size="md" hoverColor="gray" className={`mr-0.5 ${pinned ? 'icon-[mdi--pin-off]' : 'icon-[mdi--pin]'}`} onClick={(e) => {
                        e.stopPropagation();
                        updatePinQuery(pinned ? { date: null, uuid: null, fieldId: null, questionId: null } : { ...timeline.params, questionId: timeline.params.questionId ?? null })
                        setSelectedChart(pinned ? null : timeline.id);
                    }} />
                    {isSurvey && (
                        <IconButton
                            size="md"
                            hoverColor="gray"
                            className="icon-[mdi--chart-bar] mr-0.5"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDistributionOpen(true);
                            }}
                        />
                    )}
                    {!isSurvey && (sectionType === ComparisonType.Sensors || sectionType === ComparisonType.Participants) ? (
                        <IconButton size="md" hoverColor="gray" className={`icon-[mdi--eye-off]`} onClick={() => {
                            if (sectionType === ComparisonType.Sensors) {
                                if (timeline.params.questionId !== undefined) {
                                    updateComparisonParams(sectionType, { questionId: comparisonParams[sectionType].questionId.filter(questionId => questionId !== timeline.params.questionId) })
                                } else {
                                    updateComparisonParams(sectionType, { fieldId: comparisonParams[sectionType].fieldId.filter(fieldId => fieldId !== timeline.params.fieldId) })
                                }
                            } else if (sectionType === ComparisonType.Participants) {
                                updateComparisonParams(sectionType, { uuid: comparisonParams[sectionType].uuid.filter(uuid => uuid !== timeline.params.uuid) })
                            }
                        }} />
                    ) : null}
                </div>

                <div className='h-[100px] flex flex-row justify-center items-center'>
                    <ParentSize>
                        {({ width }) => (
                            <TimelineChart
                                isSelected={isSelected}
                                fieldId={timeline.params.fieldId}
                                chartType={timeline.chartType}
                                baseTime={baseTime}
                                data={timeline.value}
                                bucketSize={bucketSize}
                                width={Math.max(width, 0)}
                                height={100}
                            />
                        )}
                    </ParentSize>
                </div>
            </div>
            {isSurvey && (
                <SurveyDistributionModal
                    open={distributionOpen}
                    onClose={() => setDistributionOpen(false)}
                    events={timeline.value as TimelineSurveyEventPoint[]}
                    chartTitle={timeline.title}
                    participantUuid={timeline.params.uuid}
                />
            )}
        </DnDItem >
    )
}
