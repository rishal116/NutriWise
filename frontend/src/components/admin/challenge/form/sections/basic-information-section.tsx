
"use client";

import { ClipboardList } from "lucide-react";
import SectionHeader from "./section-header";

type BasicInformationField = "title" | "description" | "instructions";

interface BasicInformationSectionProps {
  title: string;
  description: string;
  instructions: string;
  errors: Partial<Record<BasicInformationField, string | undefined>>;
  onChange: (field: BasicInformationField, value: string) => void;
  onBlur: (field: BasicInformationField, value: string) => void;
}

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const textareaClassName =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const errorClassName = "mt-1.5 text-xs font-medium text-red-600";

export default function BasicInformationSection({
  title,
  description,
  instructions,
  errors,
  onChange,
  onBlur,
}: BasicInformationSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeader
        icon={ClipboardList}
        title="Basic Information"
        description="Add the basic details for your challenge."
      />

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="title"
              className="text-sm font-medium text-slate-700"
            >
              Challenge Title
            </label>
            <span className="text-xs text-slate-400">{title.length}/150</span>
          </div>

          <input
            id="title"
            maxLength={150}
            value={title}
            onChange={(event) => onChange("title", event.target.value)}
            onBlur={(event) => onBlur("title", event.target.value)}
            placeholder="7-Day Hydration Challenge"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={inputClassName}
          />

          {errors.title && (
            <p id="title-error" role="alert" className={errorClassName}>
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <span className="text-xs text-slate-400">
              {description.length}/3000
            </span>
          </div>

          <textarea
            id="description"
            maxLength={3000}
            rows={4}
            value={description}
            onChange={(event) => onChange("description", event.target.value)}
            onBlur={(event) => onBlur("description", event.target.value)}
            placeholder="Drink enough water every day for 7 days."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            className={textareaClassName}
          />

          {errors.description && (
            <p id="description-error" role="alert" className={errorClassName}>
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="instructions"
              className="text-sm font-medium text-slate-700"
            >
              Instructions
              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>
            <span className="text-xs text-slate-400">
              {instructions.length}/5000
            </span>
          </div>

          <textarea
            id="instructions"
            maxLength={5000}
            rows={5}
            value={instructions}
            onChange={(event) => onChange("instructions", event.target.value)}
            onBlur={(event) => onBlur("instructions", event.target.value)}
            placeholder="Explain how participants should approach this challenge..."
            aria-invalid={Boolean(errors.instructions)}
            aria-describedby={
              errors.instructions ? "instructions-error" : undefined
            }
            className={textareaClassName}
          />

          {errors.instructions && (
            <p id="instructions-error" role="alert" className={errorClassName}>
              {errors.instructions}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
