"use client";

import { Controller } from "react-hook-form";
import type { ChangeEvent } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Trash2,
} from "lucide-react";

import {
  CHALLENGE_ACTIVITY_TYPES,
  CHALLENGE_ACTIVITY_VALUE_TYPES,
} from "@/types/admin/challenge-day/challenge-day.types";

import type {
  ChallengeActivityType,
  ChallengeActivityValueType,
} from "@/types/admin/challenge-day/challenge-day.types";

import type { FormInput } from "../validation/challenge-day-form.schema";

import MediaCard from "./media-card";

import {
  errorClass,
  inputClass,
  labelClass,
} from "../style/challenge-day-form.styles";

type ChallengeActivity = FormInput["activities"][number];

export interface ActivityCardProps {
  index: number;
  totalActivities: number;
  activity: ChallengeActivity;
  control: Control<FormInput>;
  register: UseFormRegister<FormInput>;
  setValue: UseFormSetValue<FormInput>;
  errors: FieldErrors<FormInput>;
  saving: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  onImageChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onVideoChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveImage: (index: number) => void;
  onRemoveVideo: (index: number) => void;
}

export const ACTIVITY_TYPE_LABELS: Record<
  ChallengeActivityType,
  string
> = {
  exercise: "Exercise",
  nutrition: "Nutrition",
  hydration: "Hydration",
  meditation: "Meditation",
  breathing: "Breathing",
  sleep: "Sleep",
  healthy_habit: "Healthy Habit",
  education: "Education",
  stretching: "Stretching",
  recovery: "Recovery",
  measurement: "Measurement",
};

const VALUE_TYPE_LABELS: Record<
  ChallengeActivityValueType,
  string
> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
};

export default function ActivityCard({
  index,
  totalActivities,
  activity,
  control,
  register,
  setValue,
  errors,
  saving,
  onMove,
  onRemove,
  onImageChange,
  onVideoChange,
  onRemoveImage,
  onRemoveVideo,
}: ActivityCardProps) {
  const activityErrors = errors.activities?.[index];

  const showTarget =
    activity.valueType === "number" ||
    activity.valueType === "duration";

  const existingImageUrl = activity.removeImage
    ? undefined
    : activity.existingImageUrl;

  const existingVideoUrl = activity.removeVideo
    ? undefined
    : activity.existingVideoUrl;

  const handleValueTypeChange = (
    value: ChallengeActivityValueType | "",
    onChange: (value: ChallengeActivityValueType | "") => void,
  ) => {
    onChange(value);

    if (value === "boolean") {
      setValue(`activities.${index}.targetValue`, undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue(`activities.${index}.maxValue`, undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue(`activities.${index}.unit`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface-hover">
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-surface px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-admin-pastel-green text-admin-accent">
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-admin-muted">
              Activity {index + 1}
            </p>

            <p className="truncate text-sm font-semibold text-admin-text">
              {activity.title || "New activity"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={index === 0 || saving}
            onClick={() => onMove(index, index - 1)}
            aria-label="Move activity up"
            className="rounded-lg p-1.5 text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={index === totalActivities - 1 || saving}
            onClick={() => onMove(index, index + 1)}
            aria-label="Move activity down"
            className="rounded-lg p-1.5 text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onRemove(index)}
            aria-label="Remove activity"
            className="rounded-lg p-1.5 text-admin-muted transition-colors hover:bg-admin-danger-soft hover:text-admin-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-danger/50 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelClass}>Activity Type</label>

            <Controller
              control={control}
              name={`activities.${index}.type`}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value ?? ""}
                  disabled={saving}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select activity type
                  </option>

                  {CHALLENGE_ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ACTIVITY_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              )}
            />

            {activityErrors?.type && (
              <p className={errorClass}>{activityErrors.type.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Activity Title</label>

            <input
              type="text"
              disabled={saving}
              {...register(`activities.${index}.title`)}
              placeholder="Drink 2 liters of water"
              className={inputClass}
            />

            {activityErrors?.title && (
              <p className={errorClass}>{activityErrors.title.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Value Type</label>

            <Controller
              control={control}
              name={`activities.${index}.valueType`}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value ?? ""}
                  disabled={saving}
                  onChange={(event) =>
                    handleValueTypeChange(
                      event.target.value as ChallengeActivityValueType | "",
                      field.onChange,
                    )
                  }
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select value type
                  </option>

                  {CHALLENGE_ACTIVITY_VALUE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {VALUE_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              )}
            />

            {activityErrors?.valueType && (
              <p className={errorClass}>
                {activityErrors.valueType.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Estimated Duration (minutes)
            </label>

            <input
              type="number"
              min={1}
              max={1440}
              step={1}
              disabled={saving}
              {...register(
                `activities.${index}.estimatedDurationMinutes`,
                {
                  setValueAs: (value: unknown) =>
                    value === "" || value == null
                      ? undefined
                      : Number(value),
                },
              )}
              placeholder="Optional"
              className={inputClass}
            />

            {activityErrors?.estimatedDurationMinutes && (
              <p className={errorClass}>
                {activityErrors.estimatedDurationMinutes.message}
              </p>
            )}
          </div>
        </div>

        {showTarget && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Target Value</label>

              <input
                type="number"
                min={0}
                step="any"
                disabled={saving}
                {...register(`activities.${index}.targetValue`, {
                  setValueAs: (value: unknown) =>
                    value === "" || value == null
                      ? undefined
                      : Number(value),
                })}
                placeholder="30"
                className={inputClass}
              />

              {activityErrors?.targetValue && (
                <p className={errorClass}>
                  {activityErrors.targetValue.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Maximum Value</label>

              <input
                type="number"
                min={0}
                step="any"
                disabled={saving}
                {...register(`activities.${index}.maxValue`, {
                  setValueAs: (value: unknown) =>
                    value === "" || value == null
                      ? undefined
                      : Number(value),
                })}
                placeholder="Optional"
                className={inputClass}
              />

              {activityErrors?.maxValue && (
                <p className={errorClass}>
                  {activityErrors.maxValue.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Unit</label>

              <input
                type="text"
                maxLength={30}
                disabled={saving}
                {...register(`activities.${index}.unit`)}
                placeholder="ml, reps, minutes"
                className={inputClass}
              />

              {activityErrors?.unit && (
                <p className={errorClass}>
                  {activityErrors.unit.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-admin-text">
            <input
              type="checkbox"
              disabled={saving}
              {...register(`activities.${index}.isRequired`)}
              className="h-4 w-4 rounded border-admin-border accent-admin-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/40"
            />
            Required activity
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Description</label>

            <textarea
              rows={3}
              disabled={saving}
              {...register(`activities.${index}.description`)}
              placeholder="Explain the goal of this activity..."
              className={`${inputClass} resize-none`}
            />

            {activityErrors?.description && (
              <p className={errorClass}>
                {activityErrors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Instructions</label>

            <textarea
              rows={3}
              disabled={saving}
              {...register(`activities.${index}.instructions`)}
              placeholder="Explain how the participant should complete it..."
              className={`${inputClass} resize-none`}
            />

            {activityErrors?.instructions && (
              <p className={errorClass}>
                {activityErrors.instructions.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <MediaCard
            type="image"
            file={activity.imageFile ?? null}
            existingUrl={existingImageUrl}
            onSelect={(event) => onImageChange(index, event)}
            onRemove={() => onRemoveImage(index)}
            disabled={saving}
            cropRequired={Boolean(activity.imageFile)}
          />

          <MediaCard
            type="video"
            file={activity.videoFile ?? null}
            existingUrl={existingVideoUrl}
            onSelect={(event) => onVideoChange(index, event)}
            onRemove={() => onRemoveVideo(index)}
            disabled={saving}
          />
        </div>
      </div>
    </article>
  );
}