
"use client";

import { useId } from "react";

import { SESSION_LIMITS } from "@/constants/common/session-limits.constants";

import {
  SESSION_ERROR_CLASS,
  SESSION_INPUT_CLASS,
  SESSION_LABEL_CLASS,
  SESSION_SECTION_LABEL_CLASS,
} from "./session-form.constants";

import { FormError } from "./FormError";

export interface ScheduleCapacityErrors {
  scheduledAt?: string;
  duration?: string;
  maxParticipants?: string;
}

interface ScheduleCapacitySectionProps {
  scheduledAt: string;
  duration: number;
  maxParticipants: number | undefined;
  errors: ScheduleCapacityErrors;
  minDateTime?: string;
  onScheduledAtChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onParticipantsChange: (value: string) => void;
}

export function ScheduleCapacitySection({
  scheduledAt,
  duration,
  maxParticipants,
  errors,
  minDateTime,
  onScheduledAtChange,
  onDurationChange,
  onParticipantsChange,
}: ScheduleCapacitySectionProps) {
  const ids = useId();

  const { scheduledAt: scheduledAtError, duration: durationError, maxParticipants: participantsError } = errors;

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className={SESSION_SECTION_LABEL_CLASS}>
        Schedule and capacity
      </h2>

      {/* Schedule */}
      <div>
        <label
          htmlFor={`${ids}-scheduled`}
          className={SESSION_LABEL_CLASS}
        >
          Date and time
        </label>

        <input
          id={`${ids}-scheduled`}
          type="datetime-local"
          min={minDateTime}
          value={scheduledAt}
          onChange={(event) => onScheduledAtChange(event.target.value)}
          aria-invalid={!!scheduledAtError}
          aria-describedby={
            scheduledAtError ? `${ids}-scheduled-hint ${ids}-scheduled-error` : `${ids}-scheduled-hint`
          }
          className={`${SESSION_INPUT_CLASS} ${
            scheduledAtError ? SESSION_ERROR_CLASS : ""
          }`}
        />

        <p
          id={`${ids}-scheduled-hint`}
          className="mt-1.5 text-xs text-slate-400"
        >
          Choose a date and time in the future.
        </p>

        <FormError
          message={scheduledAtError}
          id={`${ids}-scheduled-error`}
        />
      </div>

      {/* Duration and participants */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${ids}-duration`}
            className={SESSION_LABEL_CLASS}
          >
            Duration (minutes)
          </label>

          <input
            id={`${ids}-duration`}
            type="number"
            min={SESSION_LIMITS.durationMin}
            max={SESSION_LIMITS.durationMax}
            step={1}
            value={Number.isNaN(duration) ? "" : duration}
            onChange={(event) => onDurationChange(event.target.value)}
            aria-invalid={!!durationError}
            aria-describedby={
              durationError ? `${ids}-duration-hint ${ids}-duration-error` : `${ids}-duration-hint`
            }
            className={`${SESSION_INPUT_CLASS} ${
              durationError ? SESSION_ERROR_CLASS : ""
            }`}
          />

          <p
            id={`${ids}-duration-hint`}
            className="mt-1.5 text-xs text-slate-400"
          >
            {SESSION_LIMITS.durationMin}–
            {SESSION_LIMITS.durationMax} minutes
          </p>

          <FormError
            message={durationError}
            id={`${ids}-duration-error`}
          />
        </div>

        <div>
          <label
            htmlFor={`${ids}-participants`}
            className={SESSION_LABEL_CLASS}
          >
            Maximum participants
          </label>

          <input
            id={`${ids}-participants`}
            type="number"
            min={SESSION_LIMITS.participantsMin}
            max={SESSION_LIMITS.participantsMax}
            step={1}
            value={
              maxParticipants == null || Number.isNaN(maxParticipants)
                ? ""
                : maxParticipants
            }
            onChange={(event) => onParticipantsChange(event.target.value)}
            aria-invalid={!!participantsError}
            aria-describedby={
              participantsError
                ? `${ids}-participants-hint ${ids}-participants-error`
                : `${ids}-participants-hint`
            }
            className={`${SESSION_INPUT_CLASS} ${
              participantsError ? SESSION_ERROR_CLASS : ""
            }`}
          />

          <p
            id={`${ids}-participants-hint`}
            className="mt-1.5 text-xs text-slate-400"
          >
            {SESSION_LIMITS.participantsMin}–
            {SESSION_LIMITS.participantsMax} participants
          </p>

          <FormError
            message={participantsError}
            id={`${ids}-participants-error`}
          />
        </div>
      </div>
    </section>
  );
}
