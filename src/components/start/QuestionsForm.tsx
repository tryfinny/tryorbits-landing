"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Questions, QuestionField } from "@/lib/start/schemas";
import { CtaButton } from "./CtaButton";
import { LocationAutocomplete } from "./LocationAutocomplete";

// Strip stray template/brace characters an LLM occasionally leaks into copy
// (e.g. a placeholder coming back as "e.g. Emily Smith}.{").
const clean = (s: string) => s.replace(/[{}]/g, "").trim();

export function QuestionsForm({
  questions,
  onSubmit,
}: {
  questions: Questions;
  onSubmit: (answers: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of questions.fields) init[f.id] = f.value ?? "";
    return init;
  });
  const set = (id: string, v: string) => setValues((s) => ({ ...s, [id]: v }));
  const complete = questions.fields.every((f) => (values[f.id] ?? "").trim().length > 0);

  const submit = () => {
    const byLabel: Record<string, string> = {};
    for (const f of questions.fields) byLabel[clean(f.label)] = values[f.id] ?? "";
    onSubmit(byLabel);
  };

  return (
    <div className="flex flex-1 flex-col px-5 pt-10 pb-6">
      <h2 className="text-2xl font-semibold tracking-tight">{clean(questions.title)}</h2>
      <p className="mt-1 text-base text-muted-foreground">Here&apos;s what I&apos;ve got — change anything.</p>

      <div className="mt-6 flex flex-col gap-5">
        {questions.fields.map((f) => (
          <Field key={f.id} field={f} value={values[f.id] ?? ""} onChange={(v) => set(f.id, v)} />
        ))}
      </div>

      <div className="mt-auto pt-8">
        <CtaButton disabled={!complete} onClick={submit}>
          Looks good
        </CtaButton>
      </div>
    </div>
  );
}

function Field({
  field, value, onChange,
}: {
  field: QuestionField;
  value: string;
  onChange: (v: string) => void;
}) {
  const placeholder = field.placeholder ? clean(field.placeholder) : undefined;

  if (field.type === "location") {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={field.id}>{clean(field.label)}</Label>
        <LocationAutocomplete id={field.id} value={value} placeholder={placeholder} onChange={onChange} />
      </div>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div className="flex flex-col gap-2">
        <Label>{clean(field.label)}</Label>
        <Select value={value} onValueChange={(v) => onChange(v as string)}>
          <SelectTrigger aria-label={clean(field.label)}>
            <SelectValue placeholder={placeholder ?? "Select…"} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{clean(opt)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.id}>{clean(field.label)}</Label>
      <Input
        id={field.id}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
