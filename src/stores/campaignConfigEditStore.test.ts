import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCampaignConfigEditStore } from "./campaignConfigEditStore";

const createWithQuestion = () => {
  const store = createCampaignConfigEditStore();
  store.getState().addSurvey();
  store.getState().addSurveyQuestion(0, []);
  return store;
};

const questions = (store: ReturnType<typeof createWithQuestion>) => store.getState().surveys[0].survey_question;

describe("survey questions addressed by questionPath", () => {
  it("adds a top-level question", () => {
    const store = createWithQuestion();
    store.getState().addSurveyQuestion(0, []);

    expect(questions(store).map((q) => q.question)).toEqual(["Question 1", "Question 2"]);
  });

  it("adds and updates a question nested under a branching rule", () => {
    const store = createWithQuestion();
    store.getState().addSurveyQuestionTrigger(0, [0]);
    store.getState().addSurveyQuestion(0, [0], 0);
    store.getState().updateSurveyQuestion(0, [0, 0, 0], { question: "Nested" });

    expect(questions(store)[0].question).toBe("Question 1");
    expect(questions(store)[0].survey_question_trigger[0].survey_question[0].question).toBe("Nested");
  });

  it("removes only the question at the given path", () => {
    const store = createWithQuestion();
    store.getState().addSurveyQuestionTrigger(0, [0]);
    store.getState().addSurveyQuestion(0, [0], 0);
    store.getState().removeSurveyQuestion(0, [0, 0, 0]);

    expect(questions(store)).toHaveLength(1);
    expect(questions(store)[0].survey_question_trigger[0].survey_question).toEqual([]);
  });

  it("remembers a saved question's id, so the next save can delete it", () => {
    const store = createWithQuestion();
    store.getState().updateSurveyQuestion(0, [0], { id: 42 });
    store.getState().removeSurveyQuestion(0, [0]);

    expect(store.getState().removedEntries.question).toContain(42);
  });
});

describe("undo", () => {
  // The store merges edits made within 300 ms into one undo step.
  const pause = () => vi.advanceTimersByTime(301);

  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("undoes separate edits one at a time", () => {
    const store = createWithQuestion();
    pause();
    store.getState().updateSurveyQuestion(0, [0], { question: "First" });
    pause();
    store.getState().updateSurveyQuestion(0, [0], { question: "Second" });

    store.temporal.getState().undo();
    expect(questions(store)[0].question).toBe("First");

    store.temporal.getState().undo();
    expect(questions(store)[0].question).toBe("Question 1");
  });

  it("undoes quick edits together", () => {
    const store = createWithQuestion();
    pause();
    store.getState().updateSurveyQuestion(0, [0], { question: "First" });
    store.getState().updateSurveyQuestion(0, [0], { question: "Second" });

    store.temporal.getState().undo();
    expect(questions(store)[0].question).toBe("Question 1");
  });
});
