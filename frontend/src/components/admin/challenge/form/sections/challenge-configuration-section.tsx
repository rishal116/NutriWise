
"use client";

import { Settings2 } from "lucide-react";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
} from "@/types/admin/challenge/challenge.types";

import type { ChallengeFormState } from "../challenge-form.types";

import SectionHeader from "./section-header";

type ConfigurationField =
  | "category"
  | "difficulty"
  | "accessType"
  | "durationDays";

interface ChallengeConfigurationSectionProps {
  form: ChallengeFormState;
  errors: Partial<Record<ConfigurationField, string | undefined>>;
  onChange: <K extends keyof ChallengeFormState>(
    field: K,
    value: ChallengeFormState[K],
  ) => void;
  onBlur: (field: ConfigurationField, value: unknown) => void;
}

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const selectClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const errorClassName = "mt-1.5 text-xs font-medium text-red-600";

export default function ChallengeConfigurationSection({
  form,
  errors,
  onChange,
  onBlur,
}: ChallengeConfigurationSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeader
        icon={Settings2}
        title="Challenge Configuration"
        description="Define the category, difficulty, access, and duration."
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="category"
            value={form.category}
            onChange={(event) =>
              onChange(
                "category",
                event.target.value as ChallengeFormState["category"],
              )
            }
            onBlur={(event) => onBlur("category", event.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
            className={selectClassName}
          >
            <option value="" disabled>
              Select category
            </option>

            {CHALLENGE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          {errors.category && (
            <p id="category-error" role="alert" className={errorClassName}>
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="difficulty"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Difficulty
          </label>

          <select
            id="difficulty"
            value={form.difficulty}
            onChange={(event) =>
              onChange(
                "difficulty",
                event.target.value as ChallengeFormState["difficulty"],
              )
            }
            onBlur={(event) => onBlur("difficulty", event.target.value)}
            aria-invalid={Boolean(errors.difficulty)}
            aria-describedby={
              errors.difficulty ? "difficulty-error" : undefined
            }
            className={selectClassName}
          >
            <option value="" disabled>
              Select difficulty
            </option>

            {CHALLENGE_DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>

          {errors.difficulty && (
            <p id="difficulty-error" role="alert" className={errorClassName}>
              {errors.difficulty}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="accessType"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Access Type
          </label>

          <select
            id="accessType"
            value={form.accessType}
            onChange={(event) =>
              onChange(
                "accessType",
                event.target.value as ChallengeFormState["accessType"],
              )
            }
            onBlur={(event) => onBlur("accessType", event.target.value)}
            aria-invalid={Boolean(errors.accessType)}
            aria-describedby={
              errors.accessType ? "accessType-error" : undefined
            }
            className={selectClassName}
          >
            <option value="" disabled>
              Select access type
            </option>

            {CHALLENGE_ACCESS_TYPES.map((accessType) => (
              <option key={accessType} value={accessType}>
                {accessType}
              </option>
            ))}
          </select>

          {errors.accessType && (
            <p id="accessType-error" role="alert" className={errorClassName}>
              {errors.accessType}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="durationDays"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Duration
          </label>

          <div className="relative">
            <input
              id="durationDays"
              type="number"
              min={1}
              max={365}
              step={1}
              value={form.durationDays || ""}
              onChange={(event) =>
                onChange(
                  "durationDays",
                  event.target.value ? Number(event.target.value) : 0,
                )
              }
              onBlur={(event) =>
                onBlur(
                  "durationDays",
                  event.target.value ? Number(event.target.value) : 0,
                )
              }
              onKeyDown={(event) => {
                if (["e", "E", "+", "-"].includes(event.key)) {
                  event.preventDefault();
                }
              }}
              aria-invalid={Boolean(errors.durationDays)}
              aria-describedby={
                errors.durationDays ? "durationDays-error" : undefined
              }
              className={`${inputClassName} pr-16`}
            />

            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-slate-400">
              days
            </span>
          </div>

          {errors.durationDays && (
            <p id="durationDays-error" role="alert" className={errorClassName}>
              {errors.durationDays}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
