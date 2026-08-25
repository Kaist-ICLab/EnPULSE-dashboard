import { TimelineData } from "@/types/chart";
import { ComparisonType } from "@/types/dashboard";
import { useEffect, useState, useMemo } from "react";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import {
  flattenSurveyQuestions,
  getDaysComparisonData,
  getPersonComparisonData,
  getSensorComparisonData,
  getSurveyQuestionDaysComparisonData,
  getSurveyQuestionPersonComparisonData,
  getSurveyQuestionSensorComparisonData,
} from "@/services/chartService";
import { useSectionParamStore } from "@/providers/SectionParamStoreProvider";

export default function useTimeline(secitonType: ComparisonType, chartWidth: number) {
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [bucketSize, setBucketSize] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { selectedCampaignId, campaign, campaignParticipants, campaignTables } = useCampaignStore((state) => state);
  const { date, comparisonParams, timeRange, lastManualSyncTime } = useSectionParamStore((state) => state);

  const currentComparisonParams = useMemo(() => comparisonParams[secitonType], [comparisonParams, secitonType]);
  const selectedFields = useMemo(() => {
    return Array.from(
      campaignTables.values().map((table) => ({
        ...table,
        campaign_table_field: table.campaign_table_field.filter((field) =>
          currentComparisonParams.fieldId.includes(field.id),
        ),
      })),
    ).filter((table) => table.campaign_table_field.length > 0);
  }, [currentComparisonParams, campaignTables]);
  const selectedUuids = useMemo(
    () => currentComparisonParams.uuid.map((v) => campaignParticipants.get(v)).filter((v) => v !== undefined),
    [currentComparisonParams, campaignParticipants],
  );

  const flatQuestions = useMemo(() => flattenSurveyQuestions(campaign?.survey ?? []), [campaign?.survey]);
  const selectedQuestions = useMemo(
    () => currentComparisonParams.questionId.map((qid) => flatQuestions.get(qid)).filter((q) => q !== undefined),
    [currentComparisonParams, flatQuestions],
  );

  function getBucketSize(intervalInSec: number) {
    // unit: seconds
    const candidates = [
      0.001,
      0.002,
      0.005, // 1ms, 2ms, 5ms
      0.01,
      0.02,
      0.05, // 10ms, 20ms, 50ms
      0.1,
      0.2,
      0.5, // 100ms, 200ms, 500ms
      1,
      2,
      5, // 1s, 2s, 5s
      10,
      30, // 10s, 20s
      60,
      120,
      300,
      600, // 1min ~ 10min
      1800,
      3600,
      7200,
      14400, // 30min ~ 4h
      86400, // 1 day
    ];

    const nice = candidates.find((v) => v >= intervalInSec) || 86400;
    return nice;
  }

  function getBucketString(bucketSize: number) {
    if (bucketSize < 1) return `${Math.round(bucketSize * 1000)} milliseconds`;
    if (bucketSize < 60) return `${bucketSize} seconds`;
    if (bucketSize < 3600) return `${bucketSize / 60} minutes`;
    return `${bucketSize / 3600} hours`;
  }

  useEffect(() => {
    if (!selectedCampaignId || !currentComparisonParams.uuid || !date) return;

    const intervalInSec = (timeRange.end - timeRange.start) / 1000 / chartWidth; // seconds per pixel
    const pixelPerBucket = 10; // Change this value to change the bucket size
    const bucketSize = getBucketSize(intervalInSec * pixelPerBucket);
    const bucketString = getBucketString(bucketSize);

    setLoading(true);
    setError(null);

    async function fetchData() {
      let sensorPromise: Promise<TimelineData[]> = Promise.resolve([]);
      let surveyPromise: Promise<TimelineData[]> = Promise.resolve([]);

      if (secitonType === ComparisonType.Sensors) {
        if (selectedFields.length > 0) {
          sensorPromise = getSensorComparisonData(date, selectedUuids[0], selectedFields, timeRange, bucketString);
        }
        if (selectedQuestions.length > 0) {
          surveyPromise = getSurveyQuestionSensorComparisonData(date, selectedUuids[0], selectedQuestions, timeRange);
        }
      } else if (secitonType === ComparisonType.Participants) {
        // One target source: prefer question if set, else field.
        if (selectedQuestions.length > 0) {
          surveyPromise = getSurveyQuestionPersonComparisonData(date, selectedUuids, selectedQuestions[0], timeRange);
        } else if (selectedFields.length > 0) {
          sensorPromise = getPersonComparisonData(date, selectedUuids, selectedFields[0], timeRange, bucketString);
        }
      } else if (secitonType === ComparisonType.Days) {
        if (selectedQuestions.length > 0) {
          surveyPromise = getSurveyQuestionDaysComparisonData(date, selectedUuids[0], selectedQuestions[0], timeRange);
        } else if (selectedFields.length > 0) {
          sensorPromise = getDaysComparisonData(date, selectedUuids[0], selectedFields[0], timeRange, bucketString);
        }
      }

      const [sensorData, surveyData] = await Promise.all([sensorPromise, surveyPromise]);
      setTimeline([...sensorData, ...surveyData]);
      setBucketSize(bucketSize * 1000);
      setLoading(false);
    }

    fetchData();
  }, [
    selectedCampaignId,
    currentComparisonParams,
    timeRange,
    selectedFields,
    selectedQuestions,
    selectedUuids,
    secitonType,
    chartWidth,
    date,
    lastManualSyncTime,
  ]);

  return { timeline, bucketSize, loading, error };
}
