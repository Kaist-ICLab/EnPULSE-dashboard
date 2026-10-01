import { DnDItem, DragHandle } from "@/components/common/DnDList";
import IconButton from "@/components/common/IconButton";
import TimelineChart from "@/components/dashboard/chart/TimelineChart";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";
import { TimelineData, TimelineSurveyEventPoint } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { ParentSize } from "@visx/responsive";
import { useState, useRef, useCallback } from "react";
import * as htmlToImage from "html-to-image";
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
  const chartRef = useRef<HTMLDivElement>(null);

  // Hooks run before the `!timeline` guard below, so they must not
  // dereference `timeline` unconditionally.
  const title = timeline?.title ?? "chart";
  const downloadChart = useCallback(async (format: "png" | "svg") => {
    if (chartRef.current === null) return;
    try {
      const dataUrl = await (format === "png" 
        ? htmlToImage.toPng(chartRef.current, { backgroundColor: '#ffffff' })
        : htmlToImage.toSvg(chartRef.current, { backgroundColor: '#ffffff' }));
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${timestamp}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download chart", err);
    }
  }, [title]);

  if (!timeline) return;

  // In Days mode each chart is its own date; otherwise the chart should
  // track the store's date so it doesn't snap back to the previously-fetched
  // params.date during the brief window before new data arrives.
  const baseTime = sectionType === ComparisonType.Days ? timeline.params.date.getTime() : date.getTime();

  const isSurvey = timeline.chartType === "survey_events";

  return (
    <DnDItem id={timeline.id} className={`flex w-full flex-row items-center justify-center py-2`}>
      <div
        className="flex shrink-0 items-center"
        onClick={() => {
          setSelectedChart(isSelected ? null : timeline.id);
        }}
      >
        <DragHandle className="flex flex-row items-center justify-center">
          <span className="icon-[mdi--hamburger-menu] mr-1 h-6 w-6 text-gray-300" />
        </DragHandle>
      </div>
      <div
        ref={chartRef}
        className="flex min-w-0 grow flex-col"
        onClick={() => {
          setSelectedChart(isSelected ? null : timeline.id);
        }}
      >
        <div
          className={`flex h-8 w-fit flex-row items-center justify-center rounded-tl-md rounded-tr-md px-2 ${isSelected ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {pinned ? <span className="icon-[mdi--pin] h-5 w-5 translate-y-px text-blue-600" /> : null}
          <span className="mr-2 truncate">{timeline.title}</span>
          <IconButton
            size="md"
            hoverColor="gray"
            className={`mr-0.5 ${pinned ? "icon-[mdi--pin-off]" : "icon-[mdi--pin]"}`}
            onClick={(e) => {
              e.stopPropagation();
              updatePinQuery(
                pinned
                  ? { date: null, uuid: null, fieldId: null, questionId: null }
                  : { ...timeline.params, questionId: timeline.params.questionId ?? null },
              );
              setSelectedChart(pinned ? null : timeline.id);
            }}
          />
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
          <IconButton
            size="md"
            hoverColor="gray"
            className="icon-[mdi--image-outline] mr-0.5"
            onClick={(e) => {
              e.stopPropagation();
              downloadChart("png");
            }}
            title="Download PNG"
          />
          <IconButton
            size="md"
            hoverColor="gray"
            className="icon-[mdi--svg] mr-0.5"
            onClick={(e) => {
              e.stopPropagation();
              downloadChart("svg");
            }}
            title="Download SVG"
          />
          {!isSurvey && (sectionType === ComparisonType.Sensors || sectionType === ComparisonType.Participants) ? (
            <IconButton
              size="md"
              hoverColor="gray"
              className={`icon-[mdi--eye-off]`}
              onClick={() => {
                if (sectionType === ComparisonType.Sensors) {
                  if (timeline.params.questionId !== undefined) {
                    updateComparisonParams(sectionType, {
                      questionId: comparisonParams[sectionType].questionId.filter(
                        (questionId) => questionId !== timeline.params.questionId,
                      ),
                    });
                  } else {
                    updateComparisonParams(sectionType, {
                      fieldId: comparisonParams[sectionType].fieldId.filter(
                        (fieldId) => fieldId !== timeline.params.fieldId,
                      ),
                    });
                  }
                } else if (sectionType === ComparisonType.Participants) {
                  updateComparisonParams(sectionType, {
                    uuid: comparisonParams[sectionType].uuid.filter((uuid) => uuid !== timeline.params.uuid),
                  });
                }
              }}
            />
          ) : null}
        </div>

        <div className="flex h-25 flex-row items-center justify-center">
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
    </DnDItem>
  );
};
