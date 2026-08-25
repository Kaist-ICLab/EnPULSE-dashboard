"use client";

import { Select, TextInput, Dropdown, DropdownItem, Checkbox } from "flowbite-react";
import { SurveyQuestion, Expression, OperatorType, AnswerType, UnaryExpression } from "@/types/survey";
import useExpressionState from "@/hooks/configuration/useExpressionState";

interface ExpressionBuilderProps {
  expression: Expression | null | undefined;
  question: SurveyQuestion;
  setExpression: (expression: Expression) => void;
}

const ExpressionBuilder: React.FC<ExpressionBuilderProps> = ({ expression, question, setExpression }) => {
  const { expressionState, availableOperators, usesIndex } = useExpressionState(question.answer_type, expression);

  return (
    <div className="flex flex-row items-center gap-2">
      If {usesIndex ? "Answer index" : "Answer"}
      <Select
        value={expressionState.op}
        className="w-32"
        onChange={(e) => {
          setExpression(
            e.target.value === "Empty"
              ? { op: "Empty" }
              : ({ op: e.target.value, value: (expressionState as UnaryExpression).value ?? "" } as Expression),
          );
        }}
      >
        {availableOperators.map((operator) => (
          <option key={operator.value} value={operator.value}>
            {operator.display}
          </option>
        ))}
      </Select>
      {expressionState.op !== "Empty" && (
        <ValueSelector
          question={question}
          op={expressionState.op}
          value={expressionState.value}
          onChange={(value) => setExpression({ op: expressionState.op, value: value } as Expression)}
        />
      )}
    </div>
  );
};

const BINARY_OPTIONS: string[] = ["Yes", "No"];

function getOptionsForType(question: SurveyQuestion): string[] {
  const cfg = question.config as { options?: string[]; min?: number; max?: number; step?: number } | null | undefined;
  const answerType: AnswerType = question.answer_type;
  if (answerType === "binary") return BINARY_OPTIONS;
  if (answerType === "numberscale") {
    const lo = cfg?.min ?? 0;
    const hi = cfg?.max ?? 10;
    const step = cfg?.step ?? 1;
    const out: string[] = [];
    for (let v = lo; v <= hi; v += step) {
      out.push(String(v));
    }
    return out;
  }
  return cfg?.options ?? [];
}

const ValueSelector: React.FC<{
  question: SurveyQuestion;
  op: OperatorType;
  value: string | number | number[];
  onChange: (value: string | number | number[]) => void;
}> = ({ question, op, value, onChange }) => {
  const answerType = question.answer_type;

  if (answerType === "text" && op !== "Empty") {
    return <TextInput value={(value ?? "") as string} onChange={(e) => onChange(e.target.value)} />;
  } else if (answerType === "number") {
    return <TextInput value={(value ?? "") as number} onChange={(e) => onChange(e.target.value)} />;
  }

  const options = getOptionsForType(question);

  if (
    answerType === "radio" ||
    answerType === "binary" ||
    answerType === "numberscale" ||
    (answerType === "checkbox" && op === "Contains")
  ) {
    return (
      <Select value={value as number} onChange={(e) => onChange(e.target.value)} className="grow">
        {options.map((option, idx) => (
          <option key={idx} value={idx}>
            {option}
          </option>
        ))}
      </Select>
    );
  } else {
    const valueArray = value as number[];
    return (
      <Dropdown
        dismissOnClick={false}
        label={valueArray.length > 0 ? valueArray.map((v) => options[v]).join(", ") : "No option selected"}
      >
        {options.map((option, idx) => (
          <DropdownItem
            key={idx}
            value={idx}
            onClick={() =>
              onChange(valueArray.includes(idx) ? valueArray.filter((v) => v !== idx) : [...valueArray, idx])
            }
          >
            <Checkbox checked={valueArray.includes(idx)} onChange={() => {}} />
            <span className="ml-2">{option}</span>
          </DropdownItem>
        ))}
      </Dropdown>
    );
  }
};

export default ExpressionBuilder;
