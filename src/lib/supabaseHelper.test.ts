import { describe, expect, it } from "vitest";
import { groupByTimestamp, groupByTimestampAndBitmask } from "./supabaseHelper";

const bucket = "2026-01-01T00:00:00Z";
const time = new Date(bucket).getTime();

describe("groupByTimestamp", () => {
  it("returns nothing for no data", () => {
    expect(groupByTimestamp(null)).toEqual([]);
  });

  it("groups categories by time with a running total", () => {
    const grouped = groupByTimestamp([
      { bucket, category: "a", count: 2 },
      { bucket, category: "b", count: 3 },
      { bucket: "2026-01-02T00:00:00Z", category: "a", count: 1 },
    ]);

    expect(grouped).toHaveLength(2);
    expect(grouped[0]).toEqual({
      timestamp: time,
      value: [
        { category: "a", count: 2, aggregated: 2 },
        { category: "b", count: 3, aggregated: 5 },
      ],
    });
  });
});

describe("groupByTimestampAndBitmask", () => {
  it("returns nothing for no data", () => {
    expect(groupByTimestampAndBitmask(null)).toEqual([]);
  });

  it("counts how often each bit is set", () => {
    // 5 is binary 101 (bits 0 and 2), and 3 is binary 11 (bits 0 and 1).
    const [result] = groupByTimestampAndBitmask([
      { bucket, category: "5", count: 2 },
      { bucket, category: "3", count: 4 },
    ]);

    const counts = Object.fromEntries(result.value.map((v) => [v.bitIndex, v.count]));
    expect(result.timestamp).toBe(time);
    expect(counts).toEqual({ 0: 6, 1: 4, 2: 2 });
  });
});
