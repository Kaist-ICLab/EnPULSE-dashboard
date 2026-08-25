"use client";

import { TimelineSurveyEventPoint, SurveyAnswerType } from "@/types/chart";
import { Modal } from "@/components/common/Modal";
import { useEffect, useMemo, useState } from "react";
import { colors } from "@/utils/timelineUtils";
import { useCampaignStore } from "@/providers/CampaignStoreProvider";
import { Spinner } from "flowbite-react";
import { flattenSurveyQuestions, getSurveyEventsForWholePeriod } from "@/services/chartService";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/date";

type Bin = { label: string; count: number };
type Mode = "selected" | "whole";

const NULL_LABELS = new Set(["(no response)", "(expired)", "(dismissed)"]);

function buildDistribution(events: TimelineSurveyEventPoint[]): Bin[] {
  if (events.length === 0) return [];
  const answerType: SurveyAnswerType = events[0].answerType;

  // Pull null-classified responses out so they don't pollute numeric bins.
  const nullCounts = new Map<string, number>();
  const valid: TimelineSurveyEventPoint[] = [];
  for (const e of events) {
    if (NULL_LABELS.has(e.response)) {
      nullCounts.set(e.response, (nullCounts.get(e.response) ?? 0) + 1);
    } else {
      valid.push(e);
    }
  }
  const trailing = Array.from(nullCounts.entries()).map(([label, count]) => ({ label, count }));

  if (answerType === "number" || answerType === "numberscale") {
    const values = valid.map((e) => Number(e.rawResponse)).filter((v) => Number.isFinite(v));
    if (values.length === 0) return trailing;
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    let bins: Bin[];
    if (lo === hi) {
      bins = [{ label: String(lo), count: values.length }];
    } else {
      const binCount = Math.min(10, Math.max(2, Math.ceil(Math.sqrt(values.length))));
      const step = (hi - lo) / binCount;
      bins = Array.from({ length: binCount }, (_, i) => ({
        label: `${(lo + i * step).toFixed(1)}–${(lo + (i + 1) * step).toFixed(1)}`,
        count: 0,
      }));
      for (const v of values) {
        const idx = Math.min(binCount - 1, Math.floor((v - lo) / step));
        bins[idx].count += 1;
      }
    }
    return [...bins, ...trailing];
  }

  if (answerType === "checkbox") {
    const counts = new Map<string, number>();
    for (const e of valid) {
      const items =
        e.response === "—"
          ? []
          : e.response
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
      for (const item of items) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));
    return [...sorted, ...trailing];
  }

  // binary, radio, text → count by exact response string
  const counts = new Map<string, number>();
  for (const e of valid) {
    counts.set(e.response, (counts.get(e.response) ?? 0) + 1);
  }
  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
  return [...sorted, ...trailing];
}

const DistributionBar: React.FC<{ bin: Bin; max: number; color: string }> = ({ bin, max, color }) => {
  const pct = max === 0 ? 0 : (bin.count / max) * 100;
  const isNullBin = NULL_LABELS.has(bin.label);
  return (
    <div className="flex items-center gap-2 py-0.5 text-sm">
      <div className={`w-32 truncate ${isNullBin ? "text-gray-400 italic" : "text-gray-700"}`} title={bin.label}>
        {bin.label}
      </div>
      <div className="h-4 flex-1 rounded bg-gray-100">
        <div className="h-4 rounded" style={{ width: `${pct}%`, backgroundColor: isNullBin ? "#9CA3AF" : color }} />
      </div>
      <div className="w-10 text-right text-gray-600">{bin.count}</div>
    </div>
  );
};

const ModeToggle: React.FC<{ mode: Mode; setMode: (m: Mode) => void }> = ({ mode, setMode }) => {
  const baseBtn = "px-3 py-1 text-sm";
  const active = "bg-blue-500 text-white";
  const inactive = "bg-gray-100 text-gray-700 hover:bg-gray-200";
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
      <button className={`${baseBtn} ${mode === "selected" ? active : inactive}`} onClick={() => setMode("selected")}>
        Selected timerange
      </button>
      <button className={`${baseBtn} ${mode === "whole" ? active : inactive}`} onClick={() => setMode("whole")}>
        Whole period
      </button>
    </div>
  );
};

export const SurveyDistributionModal: React.FC<{
  open: boolean;
  onClose: () => void;
  events: TimelineSurveyEventPoint[];
  chartTitle: string;
  participantUuid: string;
}> = ({ open, onClose, events, chartTitle, participantUuid }) => {
  const { campaign } = useCampaignStore((state) => state);
  const [mode, setMode] = useState<Mode>("selected");
  const [wholePeriodEvents, setWholePeriodEvents] = useState<TimelineSurveyEventPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionIds = useMemo(() => {
    const seen = new Set<number>();
    const out: number[] = [];
    for (const e of events)
      if (!seen.has(e.questionId)) {
        seen.add(e.questionId);
        out.push(e.questionId);
      }
    return out;
  }, [events]);

  // Reset cached whole-period data when the chart's question set changes.
  const questionIdsKey = questionIds.join(",");
  useEffect(() => {
    setWholePeriodEvents(null);
    setMode("selected");
  }, [questionIdsKey]);

  useEffect(() => {
    if (!open || mode !== "whole" || wholePeriodEvents !== null || !campaign) return;
    const flat = flattenSurveyQuestions(campaign.survey);
    const start = dayjs(campaign.start_time).startOf("day").format(DATE_FORMAT);
    const end = dayjs(campaign.end_time).endOf("day").format(DATE_FORMAT);
    setLoading(true);
    setError(null);
    getSurveyEventsForWholePeriod(participantUuid, questionIds, flat, start, end)
      .then(setWholePeriodEvents)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [open, mode, wholePeriodEvents, campaign, participantUuid, questionIds]);

  const activeEvents = useMemo(
    () => (mode === "selected" ? events : (wholePeriodEvents ?? [])),
    [mode, events, wholePeriodEvents],
  );
  const isLoadingWhole = mode === "whole" && loading;

  const grouped = useMemo(() => {
    const m = new Map<number, { title: string; events: TimelineSurveyEventPoint[] }>();
    for (const e of activeEvents) {
      const existing = m.get(e.questionId);
      if (existing) existing.events.push(e);
      else m.set(e.questionId, { title: e.questionTitle, events: [e] });
    }
    return Array.from(m.entries()).map(([questionId, v], idx) => ({
      questionId,
      title: v.title,
      color: colors[idx % colors.length],
      bins: buildDistribution(v.events),
      total: v.events.length,
    }));
  }, [activeEvents]);

  if (!open) return null;

  return (
    <Modal onClose={onClose} title={`Response distribution — ${chartTitle}`} className="w-full max-w-3xl">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <ModeToggle mode={mode} setMode={setMode} />
          {mode === "whole" && !loading && wholePeriodEvents && (
            <span className="text-xs text-gray-500">
              Campaign: {dayjs(campaign?.start_time).format("YYYY-MM-DD")} –{" "}
              {dayjs(campaign?.end_time).format("YYYY-MM-DD")}
            </span>
          )}
        </div>
        {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
        {isLoadingWhole ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-sm text-gray-500">No responses to summarize.</div>
        ) : (
          <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2">
            {grouped.map((g) => {
              const max = Math.max(0, ...g.bins.map((b) => b.count));
              return (
                <div key={g.questionId}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-800">{g.title}</h3>
                    <span className="text-xs text-gray-500">
                      {g.total} response{g.total === 1 ? "" : "s"}
                    </span>
                  </div>
                  {g.bins.length === 0 ? (
                    <div className="text-sm text-gray-400">No data</div>
                  ) : (
                    <div className="flex flex-col">
                      {g.bins.map((bin, i) => (
                        <DistributionBar key={i} bin={bin} max={max} color={g.color} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
