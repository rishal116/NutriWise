
"use client";

import { ListChecks } from "lucide-react";

import SectionHeader from "./section-header";

interface ChallengeStructureSectionProps {
  goals: string;
  benefits: string;
  tags: string;
  durationDays: number;
  goalsError?: string;
  onGoalsChange: (value: string) => void;
  onGoalsBlur: (value: string) => void;
  onBenefitsChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

const textareaClassName =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const errorClassName = "mt-1.5 text-xs font-medium text-red-600";

export default function ChallengeStructureSection({
  goals,
  benefits,
  tags,
  durationDays,
  goalsError,
  onGoalsChange,
  onGoalsBlur,
  onBenefitsChange,
  onTagsChange,
}: ChallengeStructureSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeader
        icon={ListChecks}
        title="Challenge Structure"
        description="Add goals, benefits, and tags for your challenge."
      />

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="goals"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Goals <span className="text-red-500">*</span>
          </label>

          <textarea
            id="goals"
            rows={4}
            value={goals}
            onChange={(event) => onGoalsChange(event.target.value)}
            onBlur={(event) => onGoalsBlur(event.target.value)}
            placeholder="Drink 2 litres of water daily, Build a hydration habit"
            aria-invalid={Boolean(goalsError)}
            aria-describedby={goalsError ? "goals-error" : "goals-hint"}
            className={textareaClassName}
          />

          {goalsError ? (
            <p id="goals-error" role="alert" className={errorClassName}>
              {goalsError}
            </p>
          ) : (
            <p id="goals-hint" className="mt-1 text-xs text-slate-400">
              Separate each goal with a comma. At least one goal is required.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="benefits"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Benefits{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>

          <textarea
            id="benefits"
            rows={3}
            value={benefits}
            onChange={(event) => onBenefitsChange(event.target.value)}
            placeholder="Improved hydration, Better daily habits"
            className={textareaClassName}
          />

          <p className="mt-1 text-xs text-slate-400">
            Separate each benefit with a comma.
          </p>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tags{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>

          <textarea
            id="tags"
            rows={3}
            value={tags}
            onChange={(event) => onTagsChange(event.target.value)}
            placeholder="hydration, healthy habits, water"
            className={textareaClassName}
          />

          <p className="mt-1 text-xs text-slate-400">
            Separate each tag with a comma.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-sm leading-6 text-emerald-900">
            This challenge will contain{" "}
            <span className="font-semibold">
              {durationDays} {durationDays === 1 ? "day" : "days"}
            </span>
            . After saving, you can add and manage the activities for each
            day.
          </p>
        </div>
      </div>
    </section>
  );
}
