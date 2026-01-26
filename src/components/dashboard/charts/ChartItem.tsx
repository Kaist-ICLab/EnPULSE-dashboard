import { DragHandle } from "@/components/common/DnDList";
import { DnDItem } from "@/components/common/DnDList";
import { TimelineData } from "@/types/chart";
import useSectionState from "@/hooks/useSectionState";
import TimelineChart from "@/components/dashboard/charts/TimelineChart";

export const ChartItem: React.FC<{
    timeline: TimelineData;
    pinned: boolean;
    isSelected: boolean;
    setSelectedChart: (id: string | null) => void;
    bucketSize: number;
    width: number;
}> = ({ timeline, pinned, isSelected, setSelectedChart, bucketSize, width }) => {
    const { updatePinQuery } = useSectionState()

    if (!timeline) return

    return (
        <DnDItem id={timeline.id} className={`w-full flex flex-row justify-center items-center p-2 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`} >
            <div className='w-18 flex flex-row justify-center items-center' onClick={() => {
                setSelectedChart(isSelected ? null : timeline.id);
            }} >
                <DragHandle>
                    <span className='w-6 h-6 ml-4 mr-2 text-gray-300 icon-[mdi--hamburger-menu]' />
                </DragHandle>
                <div className='flex flex-col w-12 mr-8'>
                    <div className='text-sm overflow-ellipsis'>{timeline.title}</div>
                    <button className='text-gray-400 w-6 cursor-pointer' onClick={() => {
                        updatePinQuery(pinned ? { date: null, uuid: null, fieldId: null } : timeline.params)
                    }}>
                        {pinned ? <span className="w-6 h-6 icon-[mdi--pin-off]" /> : <span className="w-6 h-6 icon-[mdi--pin]" />}
                    </button>
                </div>
            </div>
            <div
                className={`grow flex flex-row justify-center items-center cursor-pointer transition-colors`}
            >
                <TimelineChart
                    fieldId={timeline.params.fieldId}
                    chartType={timeline.chartType}
                    baseTime={timeline.params.date.getTime()}
                    data={timeline.value}
                    bucketSize={bucketSize}
                    width={width}
                    height={100}
                />
            </div>
        </DnDItem>
    )
}