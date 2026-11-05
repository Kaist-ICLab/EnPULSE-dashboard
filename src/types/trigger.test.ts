import { describe, expect, it } from "vitest";
import { DeviceType } from "./survey";
import {
  BroadcastExtra,
  getTriggerIssue,
  isActionComplete,
  isConditionComplete,
  isExtraValueValid,
  isTriggerComplete,
  loadAction,
  loadActions,
  OPEN_WEBAPP_BROADCAST_ACTION,
  persistAction,
  PersistedTriggerAction,
  TriggerAction,
  TriggerCondition,
} from "./trigger";

const surveys = [{ id: 10 }, { id: 20 }];
const webapps = [{ id: 30 }];
const surveyIds = surveys.map((s) => s.id);
const webappIds = webapps.map((w) => w.id);

const roundTrip = (action: TriggerAction) =>
  loadAction(persistAction(action, surveyIds, webappIds), surveys, webapps);

describe("saving and loading actions", () => {
  it.each<TriggerAction>([
    { kind: "ema", surveyIndex: 1, minIntervalMillis: 5 },
    { kind: "watch_ema", surveyIndex: 0, minIntervalMillis: 5 },
    { kind: "open_webapp", surveyIndex: 1, webappIndex: 0, minIntervalMillis: 5 },
    { kind: "broadcast", action: "custom", extras: [], minIntervalMillis: 5 },
    { kind: "notification", title: "t", description: "d", deviceType: DeviceType.Phone, minIntervalMillis: 5 },
  ])("keeps a $kind action unchanged", (action) => {
    expect(roundTrip(action)).toEqual(action);
  });

  it("stores survey references as real ids", () => {
    const persisted = persistAction({ kind: "ema", surveyIndex: 1, minIntervalMillis: 5 }, surveyIds, webappIds);
    expect(persisted).toEqual({ kind: "ema", survey_id: 20, minIntervalMillis: 5 });
  });

  it("stores Open Web App as the broadcast the phone expects", () => {
    const persisted = persistAction(
      { kind: "open_webapp", surveyIndex: 0, webappIndex: 0, minIntervalMillis: 5 },
      surveyIds,
      webappIds,
    );

    expect(persisted).toEqual({
      kind: "broadcast",
      action: OPEN_WEBAPP_BROADCAST_ACTION,
      extras: [
        { key: "survey_id", valueType: "int", value: "10" },
        { key: "webapp_id", valueType: "int", value: "30" },
      ],
      minIntervalMillis: 5,
    });
  });

  it("marks an action as unselected when its survey no longer exists", () => {
    const action = loadAction({ kind: "ema", survey_id: 99, minIntervalMillis: 5 }, surveys, webapps);
    expect(action).toMatchObject({ kind: "ema", surveyIndex: -1 });
  });

  it("keeps a stale Open Web App row as a broadcast, so its data isn't lost", () => {
    const stale: PersistedTriggerAction = {
      kind: "broadcast",
      action: OPEN_WEBAPP_BROADCAST_ACTION,
      extras: [
        { key: "survey_id", valueType: "int", value: "99" },
        { key: "webapp_id", valueType: "int", value: "30" },
      ],
    };

    expect(loadAction(stale, surveys, webapps)).toEqual(stale);
  });
});

describe("loadActions", () => {
  const stored: PersistedTriggerAction = { kind: "ema", survey_id: 10, minIntervalMillis: 5 };
  const loaded = { kind: "ema", surveyIndex: 0, minIntervalMillis: 5 };

  it("reads a list of actions", () => {
    expect(loadActions([stored, stored], surveys, webapps)).toEqual([loaded, loaded]);
  });

  it("reads an older row holding a single action", () => {
    expect(loadActions(stored, surveys, webapps)).toEqual([loaded]);
  });

  it.each([[null], [undefined], ["text"], [1]])("returns nothing for %j", (raw) => {
    expect(loadActions(raw, surveys, webapps)).toEqual([]);
  });
});

describe("isConditionComplete", () => {
  const low: TriggerCondition = { type: "detection", sensor: "stress", value: "Low" };
  const invalid: TriggerCondition = { type: "detection", sensor: "stress", value: "Nope" };

  it("checks values against the sensor's list", () => {
    expect(isConditionComplete(low, [])).toBe(true);
    expect(isConditionComplete(invalid, [])).toBe(false);
  });

  it("checks timing values against the campaign's schedules", () => {
    const timing: TriggerCondition = { type: "detection", sensor: "timing", value: "morning" };
    expect(isConditionComplete(timing, ["morning"])).toBe(true);
    expect(isConditionComplete(timing, [])).toBe(false);
  });

  it("checks nested conditions", () => {
    const nested = (leaf: TriggerCondition): TriggerCondition => ({
      type: "or",
      children: [low, { type: "not", child: { type: "and", children: [leaf] } }],
    });

    expect(isConditionComplete(nested(low), [])).toBe(true);
    expect(isConditionComplete(nested(invalid), [])).toBe(false);
  });

  it("rejects an empty group", () => {
    expect(isConditionComplete({ type: "and", children: [] }, [])).toBe(false);
  });
});

describe("isExtraValueValid", () => {
  const extra = (valueType: BroadcastExtra["valueType"], value: string, key = "k"): BroadcastExtra => ({
    key,
    valueType,
    value,
  });

  it.each([
    extra("string", "anything"),
    extra("int", "-5"),
    extra("long", "5"),
    extra("float", "1.5"),
    extra("double", "-2"),
    extra("boolean", "true"),
  ])("accepts $valueType $value", (e) => {
    expect(isExtraValueValid(e)).toBe(true);
  });

  it.each([
    extra("string", "x", "  "),
    extra("int", "1.5"),
    extra("long", "x"),
    extra("float", "x"),
    extra("boolean", "yes"),
  ])("rejects $valueType $value", (e) => {
    expect(isExtraValueValid(e)).toBe(false);
  });
});

describe("isActionComplete", () => {
  it("requires a selected survey", () => {
    expect(isActionComplete({ kind: "ema", surveyIndex: -1, minIntervalMillis: 0 })).toBe(false);
    expect(isActionComplete({ kind: "ema", surveyIndex: 0, minIntervalMillis: 0 })).toBe(true);
  });

  it("rejects intervals the app can't parse", () => {
    expect(isActionComplete({ kind: "ema", surveyIndex: 0, minIntervalMillis: 1.5 })).toBe(false);
    expect(isActionComplete({ kind: "ema", surveyIndex: 0, minIntervalMillis: -1 })).toBe(false);
  });

  it("allows older broadcasts with no interval", () => {
    expect(isActionComplete({ kind: "broadcast", action: "a", extras: [] })).toBe(true);
  });

  it("requires a notification's title and description", () => {
    const base = { kind: "notification", deviceType: DeviceType.Phone, minIntervalMillis: 0 } as const;
    expect(isActionComplete({ ...base, title: " ", description: "d" })).toBe(false);
    expect(isActionComplete({ ...base, title: "t", description: "d" })).toBe(true);
  });
});

describe("isTriggerComplete", () => {
  it("needs at least one action", () => {
    const condition: TriggerCondition = { type: "detection", sensor: "stress", value: "Low" };
    expect(isTriggerComplete({ condition, actions: [] }, [])).toBe(false);
  });
});

describe("getTriggerIssue", () => {
  const condition: TriggerCondition = { type: "detection", sensor: "stress", value: "Low" };
  const context = {
    timingScheduleValues: [],
    campaignTableNames: new Set(["stress_sensor"]),
    surveys: [
      { title: "Phone survey", device_type: DeviceType.Phone },
      { title: "Watch survey", device_type: DeviceType.Watch },
    ],
  };
  const issue = (actions: TriggerAction[], c: TriggerCondition = condition) =>
    getTriggerIssue({ name: "T", condition: c, actions }, 0, context);

  it("accepts a working trigger", () => {
    expect(issue([{ kind: "ema", surveyIndex: 0, minIntervalMillis: 0 }])).toBeNull();
  });

  it("flags an incomplete trigger, numbering unnamed ones", () => {
    expect(getTriggerIssue({ condition, actions: [] }, 2, context)).toContain('"#3" is incomplete');
  });

  it("flags a sensor the campaign doesn't collect", () => {
    const gesture: TriggerCondition = { type: "detection", sensor: "gesture", value: "Alarm Clock" };
    expect(issue([{ kind: "ema", surveyIndex: 0, minIntervalMillis: 0 }], gesture)).toContain("doesn't collect");
  });

  it("flags a broadcast the app won't deliver", () => {
    expect(issue([{ kind: "broadcast", action: "custom", extras: [] }])).toContain("doesn't deliver");
  });

  it("flags an Open Web App row that no longer matches", () => {
    expect(issue([{ kind: "broadcast", action: OPEN_WEBAPP_BROADCAST_ACTION, extras: [] }])).toContain("no longer");
  });

  it("flags Open Web App with a watch survey", () => {
    expect(issue([{ kind: "open_webapp", surveyIndex: 1, webappIndex: 0, minIntervalMillis: 0 }])).toContain(
      "only works with phone surveys",
    );
  });

  it("flags a survey shown on the wrong device", () => {
    expect(issue([{ kind: "watch_ema", surveyIndex: 0, minIntervalMillis: 0 }])).toContain("on the smartwatch");
    expect(issue([{ kind: "ema", surveyIndex: 1, minIntervalMillis: 0 }])).toContain("on the phone");
  });
});
