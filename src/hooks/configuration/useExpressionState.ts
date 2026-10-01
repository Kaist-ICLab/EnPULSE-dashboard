import { AnswerType, Expression } from "@/types/survey";
import { useMemo } from "react";

export default function useExpressionState(answerType: AnswerType, expression: Expression | null | undefined) {
  const expressionState = useMemo<Expression>(() => {
    if (expression) return expression;
    if (answerType === "checkbox") {
      return { op: "Equal", value: [] } as Expression;
    } else if (answerType === "text") {
      return { op: "Equal", value: "" } as Expression;
    } else {
      return { op: "Equal", value: 0 } as Expression;
    }
  }, [answerType, expression]);

  const availableOperators = useMemo(() => {
    const operators = [
      { value: "Equal", display: "=" },
      { value: "NotEqual", display: "≠" },
    ]; // We will think about binary operators later;
    if (answerType === "checkbox") {
      operators.push({ value: "Contains", display: "Contains" });
    } else if (answerType === "text") {
      operators.push({ value: "Empty", display: "isEmpty" });
    } else if (answerType === "binary") {
      // Yes/No isn't ordered — only equality operators apply.
    } else {
      operators.push(
        { value: "GreaterThan", display: ">" },
        { value: "GreaterThanOrEqual", display: "≥" },
        { value: "LessThan", display: "<" },
        { value: "LessThanOrEqual", display: "≤" },
      );
    }
    return operators;
  }, [answerType]);

  const usesIndex = useMemo(() => {
    // Number-scale rules store the scale value itself, so only radio compares an index.
    if (
      answerType === "text" ||
      answerType === "number" ||
      answerType === "checkbox" ||
      answerType === "binary" ||
      answerType === "numberscale"
    )
      return false;
    return ["GreaterThan", "GreaterThanOrEqual", "LessThan", "LessThanOrEqual"].includes(expressionState.op);
  }, [answerType, expressionState]);

  return { expressionState, availableOperators, usesIndex };
}
