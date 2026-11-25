"use client";

import { useId } from "react";

import type { SessionType } from "@/constants/common/session.constants";

import {
  SESSION_ERROR_CLASS,
  SESSION_INPUT_CLASS,
  SESSION_LABEL_CLASS,
  SESSION_SECTION_LABEL_CLASS,
  SESSION_TYPE_LABELS,
  SESSION_TYPE_OPTIONS,
  SESSION_FORM_LIMITS,
} from "./session-form.constants";

import { FormError } from "./FormError";

export interface BasicDetailsErrors {
  title?: string;
  description?: string;
  type?: string;
}

interface BasicDetailsSectionProps {
  title: string;
  description: string;
  type: SessionType | "";
  errors: BasicDetailsErrors;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: SessionType) => void;
}

export function BasicDetailsSection({
  title,
  description,
  type,
  errors,
  onTitleChange,
  onDescriptionChange,
  onTypeChange,
}: BasicDetailsSectionProps) {
  const ids = useId();

  const titleError = errors.title;
  const descriptionError = errors.description;
  const typeError = errors.type;

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className={SESSION_SECTION_LABEL_CLASS}>Basic details</h2>

      {/* Session title */}
      <div>
        <label htmlFor={`${ids}-title`} className={SESSION_LABEL_CLASS}>
          Session title
        </label>

        <input
          id={`${ids}-title`}
          value={title}
          maxLength={SESSION_FORM_LIMITS.titleMax}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="e.g. Healthy Eating for Beginners"
          aria-invalid={!!titleError}
          aria-describedby={
            titleError
              ? `${ids}-title-hint ${ids}-title-error`
              : `${ids}-title-hint`
          }
          className={`${SESSION_INPUT_CLASS} ${
            titleError ? SESSION_ERROR_CLASS : ""
          }`}
        />

        <div className="mt-1.5 flex justify-between gap-3">
          <p id={`${ids}-title-hint`} className="text-xs text-slate-400">
            {SESSION_FORM_LIMITS.titleMin}–{SESSION_FORM_LIMITS.titleMax}{" "}
            characters
          </p>

          <span className="text-xs text-slate-400">
            {title.length}/{SESSION_FORM_LIMITS.titleMax}
          </span>
        </div>

        <FormError message={titleError} id={`${ids}-title-error`} />
      </div>

      {/* Description */}
      <div>
        <label htmlFor={`${ids}-description`} className={SESSION_LABEL_CLASS}>
          Description
        </label>

        <textarea
          id={`${ids}-description`}
          rows={5}
          value={description}
          maxLength={SESSION_FORM_LIMITS.descriptionMax}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="What will participants learn from this session?"
          aria-invalid={!!descriptionError}
          aria-describedby={
            descriptionError
              ? `${ids}-description-hint ${ids}-description-error`
              : `${ids}-description-hint`
          }
          className={`${SESSION_INPUT_CLASS} resize-y ${
            descriptionError ? SESSION_ERROR_CLASS : ""
          }`}
        />

        <div className="mt-1.5 flex justify-between gap-3">
          <p id={`${ids}-description-hint`} className="text-xs text-slate-400">
            {SESSION_FORM_LIMITS.descriptionMin}–
            {SESSION_FORM_LIMITS.descriptionMax} characters
          </p>

          <span className="text-xs text-slate-400">
            {description.length}/{SESSION_FORM_LIMITS.descriptionMax}
          </span>
        </div>

        <FormError message={descriptionError} id={`${ids}-description-error`} />
      </div>

      {/* Session type */}
      <div>
        <p className={SESSION_LABEL_CLASS}>Session type</p>

        <div
          role="radiogroup"
          aria-label="Session type"
          aria-describedby={typeError ? `${ids}-type-error` : undefined}
          className="flex flex-wrap gap-2"
        >
          {SESSION_TYPE_OPTIONS.map((sessionType) => (
            <button
              key={sessionType}
              type="button"
              role="radio"
              aria-checked={type === sessionType}
              onClick={() => onTypeChange(sessionType)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                type === sessionType
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {SESSION_TYPE_LABELS[sessionType]}
            </button>
          ))}
        </div>

        <FormError message={typeError} id={`${ids}-type-error`} />
      </div>
    </section>
  );
}
