
"use client";

import { Plus } from "lucide-react";
import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import type { FormInput } from "../validation/challenge-day-form.schema";
import type { ActivityCardProps } from "./activity-card";

import ActivityCard from "./activity-card";
import { errorClass } from "../style/challenge-day-form.styles";

interface ActivitiesSectionProps {
  fields: FieldArrayWithId<FormInput, "activities">[];
  activities: FormInput["activities"];
  control: Control<FormInput>;
  register: UseFormRegister<FormInput>;
  errors: FieldErrors<FormInput>;
  setValue: UseFormSetValue<FormInput>;
  saving: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onImageChange: ActivityCardProps["onImageChange"];
  onVideoChange: ActivityCardProps["onVideoChange"];
  onRemoveImage: (index: number) => void;
  onRemoveVideo: (index: number) => void;
}

export default function ActivitiesSection({
  fields,
  activities,
  control,
  register,
  errors,
  setValue,
  saving,
  onAdd,
  onRemove,
  onMove,
  onImageChange,
  onVideoChange,
  onRemoveImage,
  onRemoveVideo,
}: ActivitiesSectionProps) {
  const activitiesError = errors.activities?.root?.message;

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5">
      <div className="flex flex-col gap-4 border-b border-admin-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-bold text-admin-text">
            Activities
          </h2>

          <p className="mt-1 text-xs text-admin-muted">
            Add at least one activity. Activities can include text, images,
            videos, and targets.
          </p>

          {activitiesError && (
            <p className={errorClass}>{activitiesError}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-admin-pastel-green px-4 py-2 text-xs font-bold text-admin-accent transition-colors hover:bg-admin-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </button>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        {fields.map((field, index) => {
          const activity = activities[index];

          if (!activity) return null;

          return (
            <ActivityCard
              key={field.id}
              index={index}
              totalActivities={fields.length}
              activity={activity}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              saving={saving}
              onMove={onMove}
              onRemove={onRemove}
              onImageChange={onImageChange}
              onVideoChange={onVideoChange}
              onRemoveImage={onRemoveImage}
              onRemoveVideo={onRemoveVideo}
            />
          );
        })}
      </div>
    </section>
  );
}
