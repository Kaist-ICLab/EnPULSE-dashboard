"use client";

import { Select, TextInput, Dropdown, DropdownItem, Checkbox } from "flowbite-react";
import { SurveyQuestion, Expression, OperatorType, AnswerType, UnaryExpression } from "@/types/survey";
import useExpressionState from "@/hooks/configuration/useExpressionState";

interface ExpressionBuilderProps {
  expression: Expression | null | undefined;
  question: SurveyQuestion;
  setExpression: (expression: Expression) => void;
}

// Checkbox operators take different value shapes: "Contains" one option index,
// "Equal"/"NotEqual" a set of indexes. Other answer types keep one shape.
const getValueShape = (answerType: AnswerType, op: OperatorType) =>
  answerType === "checkbox" ? (op === "Contains" ? "index" : "set") : "single";

const ExpressionBuilder: React.FC<ExpressionBuilderProps> = ({ expression, question, setExpression }) => {
  const { expressionState, availableOperators, usesIndex } = useExpressionState(question.answer_type, expression);

  const changeOperator = (op: OperatorType) => {
    if (op === "Empty") {
      setExpression({ op: "Empty" });
      return;
    }
    const previousValue = expressionState.op === "Empty" ? undefined : (expressionState as UnaryExpression).value;
    const previousShape = getValueShape(question.answer_type, expressionState.op);
    const nextShape = getValueShape(question.answer_type, op);
    // Keeping a value of the wrong shape (e.g. an index string after "Contains")
    // crashed the multi-select when switching back to "=".
    const value =
      previousShape !== nextShape || previousValue === undefined
        ? nextShape === "set"
          ? []
          : question.answer_type === "text"
            ? ""
            : 0
        : previousValue;
    setExpression({ op, value } as Expression);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      If {usesIndex ? "Answer index" : "Answer"}
      <Select
        value={expressionState.op}
        className="w-32"
        onChange={(e) => changeOperator(e.target.value as OperatorType)}
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

  if (answerType === "numberscale") {
    // The app compares number-scale answers by their value (e.g. 1-5), not by the
    // option's position, so store the value itself.
    return (
      <Select value={String(value)} onChange={(e) => onChange(Number(e.target.value))} className="grow">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  }

  if (answerType === "radio" || answerType === "binary" || (answerType === "checkbox" && op === "Contains")) {
    // Radio, binary and checkbox "Contains" compare the selected option's index.
    return (
      <Select value={value as number} onChange={(e) => onChange(Number(e.target.value))} className="grow">
        {options.map((option, idx) => (
          <option key={idx} value={idx}>
            {option}
          </option>
        ))}
      </Select>
    );
  } else {
    const valueArray = Array.isArray(value) ? value : [];
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
