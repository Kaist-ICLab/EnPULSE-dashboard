import { DnDItem, DragHandle } from "@/components/common/DnDList";
import IconButton from "@/components/common/IconButton";
import TimelineChart from "@/components/dashboard/chart/TimelineChart";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { TimelineData } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { ParentSize } from "@visx/responsive";

export const ChartItem: React.FC<{
    timeline: TimelineData;
    pinned: boolean;
    isSelected: boolean;
    setSelectedChart: (id: string | null) => void;
    bucketSize: number;
    sectionType: ComparisonType;
}> = ({ timeline, pinned, isSelected, setSelectedChart, bucketSize, sectionType }) => {
    const { updatePinQuery, updateComparisonParams, comparisonParams } = useSectionParamStore((state) => state);

    if (!timeline) return

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
                        updatePinQuery(pinned ? { date: null, uuid: null, fieldId: null } : timeline.params)
                        setSelectedChart(pinned ? null : timeline.id);
                    }} />
                    {sectionType === ComparisonType.Sensors || sectionType === ComparisonType.Participants ? (
                        <IconButton size="md" hoverColor="gray" className={`icon-[mdi--eye-off]`} onClick={() => {
                            if (sectionType === ComparisonType.Sensors) {
                                updateComparisonParams(sectionType, { fieldId: comparisonParams[sectionType].fieldId.filter(fieldId => fieldId !== timeline.params.fieldId) })
                            } else if (sectionType === ComparisonType.Participants) {
                                updateComparisonParams(sectionType, { uuid: comparisonParams[sectionType].uuid.filter(uuid => uuid !== timeline.params.uuid) })
                            }
                        }} />
                    ) : null}
                </div>

                <div className='flex flex-row justify-center items-center'>
                    <ParentSize>
                        {({ width }) => (
                            <TimelineChart
                                isSelected={isSelected}
                                fieldId={timeline.params.fieldId}
                                chartType={timeline.chartType}
                                baseTime={timeline.params.date.getTime()}
                                data={timeline.value}
                                bucketSize={bucketSize}
                                width={Math.max(width, 0)}
                                height={100}
                            />
                        )}
                    </ParentSize>
                </div>
            </div>
        </DnDItem >
    )
}