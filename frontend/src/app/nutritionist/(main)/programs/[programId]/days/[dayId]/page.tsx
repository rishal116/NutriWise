"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Clock,
  Target,
} from "lucide-react";
import { toast } from "sonner";

import { nutriProgramDayService } from "@/services/nutritionist/nutri-program-day.service";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ACTIVITY_VALUE_TYPES,
  type ProgramActivityCategory,
  type ActivityValueType,
} from "@/types/program-activity.types";
import type { NutriProgramDayResponseDTO } from "@/dtos/nutritionist/program/nutri-program-day-response.dto";
import type { UpdateNutriProgramDayDTO } from "@/dtos/nutritionist/program/nutri-program-day-request.dto";

const CATEGORY_LABELS: Record<ProgramActivityCategory, string> = {
  meal: "Meal",
  exercise: "Exercise",
  habit: "Habit",
  water: "Water",
  supplement: "Supplement",
  meditation: "Meditation",
  sleep: "Sleep",
  reading: "Reading",
  appointment: "Appointment",
  measurement: "Measurement",
  task: "Task",
};

const VALUE_TYPE_LABELS: Record<ActivityValueType, string> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
  photo: "Photo",
  text: "Text",
};

const NEEDS_TARGET_AND_UNIT: ActivityValueType[] = ["number", "duration"];

const NEEDS_ESTIMATED_DURATION: ActivityValueType[] = ["boolean", "duration"];

const CATEGORY_DEFAULT_VALUE_TYPE: Record<
  ProgramActivityCategory,
  ActivityValueType
> = {
  meal: "boolean",
  exercise: "duration",
  habit: "boolean",
  water: "number",
  supplement: "boolean",
  meditation: "duration",
  sleep: "duration",
  reading: "boolean",
  appointment: "boolean",
  measurement: "number",
  task: "boolean",
};

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const optionalPositiveNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().positive("Must be greater than zero").optional());

const optionalPositiveInteger = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().int("Must be a whole number").positive("Must be greater than zero").optional());

const optionalTime = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return value;
}, z.string().regex(TIME_REGEX, "Use HH:mm format").optional());

const activitySchema = z.object({
  category: z.enum(
    PROGRAM_ACTIVITY_CATEGORIES as unknown as [
      ProgramActivityCategory,
      ...ProgramActivityCategory[],
    ],
    { message: "Select a category" },
  ),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).optional(),
  instructions: z.string().trim().max(1000).optional(),
  valueType: z.enum(
    ACTIVITY_VALUE_TYPES as unknown as [
      ActivityValueType,
      ...ActivityValueType[],
    ],
    { message: "Select a value type" },
  ),
  targetValue: optionalPositiveNumber,
  unit: z.string().trim().max(30).optional(),
  estimatedDurationMinutes: optionalPositiveInteger,
  scheduledTime: optionalTime,
  isRequired: z.boolean(),
});

const formSchema = z.object({
  activities: z
    .array(activitySchema)
    .min(1, "A day needs at least one activity"),
});

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;
type ActivityInput = FormInput["activities"][number];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-slate-500";

const errorClass = "mt-1 text-[11px] font-medium text-rose-600";

function emptyActivity(): ActivityInput {
  return {
    category: "meal",
    title: "",
    description: "",
    instructions: "",
    valueType: CATEGORY_DEFAULT_VALUE_TYPE.meal,
    targetValue: undefined,
    unit: "",
    estimatedDurationMinutes: undefined,
    scheduledTime: "",
    isRequired: false,
  };
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

export default function ProgramDayDetailsPage() {
  const { programId, dayId } = useParams<{
    programId: string;
    dayId: string;
  }>();

  const router = useRouter();

  const [day, setDay] = useState<NutriProgramDayResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activities: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  useEffect(() => {
    if (!dayId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;

    const fetchDay = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const result = await nutriProgramDayService.getProgramDayDetails(dayId);

        if (cancelled) return;

        setDay(result);
      } catch {
        if (cancelled) return;

        setDay(null);
        setNotFound(true);
        toast.error("Couldn't load this day.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchDay();

    return () => {
      cancelled = true;
    };
  }, [dayId]);

  const goToList = () => {
    router.push(`/nutritionist/programs/${programId}/days`);
  };

  const startEditing = () => {
    if (!day) return;

    reset({
      activities: day.activities.map((activity) => ({
        category: activity.category,
        title: activity.title,
        description: activity.description ?? "",
        instructions: activity.instructions ?? "",
        valueType: activity.valueType,
        targetValue: activity.targetValue,
        unit: activity.unit ?? "",
        estimatedDurationMinutes: activity.estimatedDurationMinutes,
        scheduledTime: activity.scheduledTime ?? "",
        isRequired: activity.isRequired,
      })),
    });

    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (day) {
      reset({
        activities: day.activities.map((activity) => ({
          category: activity.category,
          title: activity.title,
          description: activity.description ?? "",
          instructions: activity.instructions ?? "",
          valueType: activity.valueType,
          targetValue: activity.targetValue,
          unit: activity.unit ?? "",
          estimatedDurationMinutes: activity.estimatedDurationMinutes,
          scheduledTime: activity.scheduledTime ?? "",
          isRequired: activity.isRequired,
        })),
      });
    }

    setIsEditing(false);
  };

  const applyValueTypeChange = (
    index: number,
    valueType: ActivityValueType,
  ) => {
    if (!NEEDS_TARGET_AND_UNIT.includes(valueType)) {
      setValue(`activities.${index}.targetValue`, undefined);
      setValue(`activities.${index}.unit`, "");
    }

    if (!NEEDS_ESTIMATED_DURATION.includes(valueType)) {
      setValue(`activities.${index}.estimatedDurationMinutes`, undefined);
    }
  };

  const applyCategoryChange = (
    index: number,
    category: ProgramActivityCategory,
  ) => {
    const defaultValueType = CATEGORY_DEFAULT_VALUE_TYPE[category];

    setValue(`activities.${index}.valueType`, defaultValueType, {
      shouldDirty: true,
      shouldValidate: true,
    });

    applyValueTypeChange(index, defaultValueType);
  };

  const onSave = async (values: FormValues) => {
    if (!day) return;

    const payload: UpdateNutriProgramDayDTO = {
      activities: values.activities.map((activity, index) => {
        const showTargetAndUnit = NEEDS_TARGET_AND_UNIT.includes(
          activity.valueType,
        );

        const showEstimatedDuration = NEEDS_ESTIMATED_DURATION.includes(
          activity.valueType,
        );

        return {
          category: activity.category,
          title: activity.title.trim(),
          description: activity.description?.trim() || undefined,
          instructions: activity.instructions?.trim() || undefined,
          valueType: activity.valueType,
          targetValue: showTargetAndUnit ? activity.targetValue : undefined,
          unit: showTargetAndUnit
            ? activity.unit?.trim() || undefined
            : undefined,
          estimatedDurationMinutes: showEstimatedDuration
            ? activity.estimatedDurationMinutes
            : undefined,
          scheduledTime: activity.scheduledTime || undefined,
          isRequired: activity.isRequired,
          order: index,
        };
      }),
    };

    try {
      await nutriProgramDayService.updateProgramDay(dayId, payload);

      const updatedDay =
        await nutriProgramDayService.getProgramDayDetails(dayId);

      setDay(updatedDay);
      reset({
        activities: updatedDay.activities.map((activity) => ({
          category: activity.category,
          title: activity.title,
          description: activity.description ?? "",
          instructions: activity.instructions ?? "",
          valueType: activity.valueType,
          targetValue: activity.targetValue,
          unit: activity.unit ?? "",
          estimatedDurationMinutes: activity.estimatedDurationMinutes,
          scheduledTime: activity.scheduledTime ?? "",
          isRequired: activity.isRequired,
        })),
      });

      setIsEditing(false);
      toast.success("Day updated.");
    } catch {
      toast.error("Couldn't save changes. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={goToList}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors duration-150 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to days
        </button>

        {loading ? (
          <DetailSkeleton />
        ) : notFound || !day ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">Day not found</p>
            <p className="text-xs font-medium text-slate-400">
              This day may have been removed or the link is incorrect.
            </p>
            <button
              type="button"
              onClick={goToList}
              className="mt-3 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Back to days
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Day {day.dayNumber}
                </h1>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  View and manage this day&apos;s activities.
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-emerald-800"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50"
                >
                  <X size={13} />
                  Cancel
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Activities ({day.activities.length})
                </h2>

                {day.activities.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
                    <p className="text-xs font-medium text-slate-400">
                      No activities for this day.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...day.activities]
                      .sort((a, b) => a.order - b.order)
                      .map((activity) => (
                        <div
                          key={activity._id}
                          className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                                {CATEGORY_LABELS[activity.category]}
                              </span>

                              {activity.isRequired && (
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                  Required
                                </span>
                              )}
                            </div>

                            <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                              {VALUE_TYPE_LABELS[activity.valueType]}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-bold text-slate-800">
                            {activity.title}
                          </p>

                          {activity.description && (
                            <p className="mt-1 whitespace-pre-wrap text-xs font-medium text-slate-500">
                              {activity.description}
                            </p>
                          )}

                          {activity.instructions && (
                            <p className="mt-1 whitespace-pre-wrap text-xs font-medium italic text-slate-400">
                              {activity.instructions}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                            {activity.targetValue != null && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <Target size={12} className="text-slate-400" />
                                {activity.targetValue}
                                {activity.unit ? ` ${activity.unit}` : ""}
                              </span>
                            )}

                            {activity.estimatedDurationMinutes != null && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <Clock size={12} className="text-slate-400" />
                                {activity.estimatedDurationMinutes} min
                              </span>
                            )}

                            {activity.scheduledTime && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <Clock size={12} className="text-slate-400" />
                                {activity.scheduledTime}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSave)}
                className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900">
                      Edit activities
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Reorder activities or change their details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => append(emptyActivity())}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors duration-150 hover:bg-emerald-100"
                  >
                    <Plus size={13} />
                    Add activity
                  </button>
                </div>

                {errors.activities?.message && (
                  <p className={errorClass}>{errors.activities.message}</p>
                )}

                {fields.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
                    <p className="text-xs font-medium text-slate-400">
                      No activities added yet.
                    </p>
                  </div>
                )}

                {fields.map((field, index) => {
                  const valueType = watch(`activities.${index}.valueType`);

                  const showTargetAndUnit =
                    NEEDS_TARGET_AND_UNIT.includes(valueType);

                  const showEstimatedDuration =
                    NEEDS_ESTIMATED_DURATION.includes(valueType);

                  const activityErrors = errors.activities?.[index];

                  return (
                    <div
                      key={field.id}
                      className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 pt-1.5 text-slate-300">
                          <GripVertical size={14} />
                          <span className="text-[10px] font-bold text-slate-400">
                            {index + 1}
                          </span>
                        </div>

                        <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`activity-${index}-category`}
                            >
                              Category
                            </label>

                            <Controller
                              control={control}
                              name={`activities.${index}.category`}
                              render={({ field: categoryField }) => (
                                <select
                                  {...categoryField}
                                  id={`activity-${index}-category`}
                                  onChange={(event) => {
                                    const category = event.target
                                      .value as ProgramActivityCategory;

                                    categoryField.onChange(category);
                                    applyCategoryChange(index, category);
                                  }}
                                  className={`${inputClass} mt-1`}
                                >
                                  {PROGRAM_ACTIVITY_CATEGORIES.map(
                                    (category) => (
                                      <option key={category} value={category}>
                                        {CATEGORY_LABELS[category]}
                                      </option>
                                    ),
                                  )}
                                </select>
                              )}
                            />
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`activity-${index}-title`}
                            >
                              Title
                            </label>
                            <input
                              id={`activity-${index}-title`}
                              type="text"
                              maxLength={120}
                              {...register(`activities.${index}.title`)}
                              className={`${inputClass} mt-1`}
                            />
                            {activityErrors?.title && (
                              <p className={errorClass}>
                                {activityErrors.title.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`activity-${index}-value-type`}
                            >
                              Response type
                            </label>

                            <Controller
                              control={control}
                              name={`activities.${index}.valueType`}
                              render={({ field: valueTypeField }) => (
                                <select
                                  {...valueTypeField}
                                  id={`activity-${index}-value-type`}
                                  onChange={(event) => {
                                    const nextValueType = event.target
                                      .value as ActivityValueType;

                                    valueTypeField.onChange(nextValueType);
                                    applyValueTypeChange(index, nextValueType);
                                  }}
                                  className={`${inputClass} mt-1`}
                                >
                                  {ACTIVITY_VALUE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                      {VALUE_TYPE_LABELS[type]}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          </div>

                          {showTargetAndUnit && (
                            <>
                              <div>
                                <label
                                  className={labelClass}
                                  htmlFor={`activity-${index}-target`}
                                >
                                  Target value
                                </label>
                                <input
                                  id={`activity-${index}-target`}
                                  type="number"
                                  min={0}
                                  step="any"
                                  {...register(
                                    `activities.${index}.targetValue`,
                                  )}
                                  className={`${inputClass} mt-1`}
                                />
                                {activityErrors?.targetValue && (
                                  <p className={errorClass}>
                                    {activityErrors.targetValue.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  className={labelClass}
                                  htmlFor={`activity-${index}-unit`}
                                >
                                  Unit
                                </label>
                                <input
                                  id={`activity-${index}-unit`}
                                  type="text"
                                  maxLength={30}
                                  placeholder="mins, ml, reps..."
                                  {...register(`activities.${index}.unit`)}
                                  className={`${inputClass} mt-1`}
                                />
                                {activityErrors?.unit && (
                                  <p className={errorClass}>
                                    {activityErrors.unit.message}
                                  </p>
                                )}
                              </div>
                            </>
                          )}

                          {showEstimatedDuration && (
                            <div>
                              <label
                                className={labelClass}
                                htmlFor={`activity-${index}-duration`}
                              >
                                Estimated duration (min)
                              </label>
                              <input
                                id={`activity-${index}-duration`}
                                type="number"
                                min={1}
                                step={1}
                                placeholder="Optional"
                                {...register(
                                  `activities.${index}.estimatedDurationMinutes`,
                                )}
                                className={`${inputClass} mt-1`}
                              />
                              {activityErrors?.estimatedDurationMinutes && (
                                <p className={errorClass}>
                                  {
                                    activityErrors.estimatedDurationMinutes
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                          )}

                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`activity-${index}-time`}
                            >
                              Scheduled time
                            </label>
                            <input
                              id={`activity-${index}-time`}
                              type="time"
                              {...register(`activities.${index}.scheduledTime`)}
                              className={`${inputClass} mt-1`}
                            />
                            {activityErrors?.scheduledTime && (
                              <p className={errorClass}>
                                {activityErrors.scheduledTime.message}
                              </p>
                            )}
                          </div>

                          <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                              <input
                                type="checkbox"
                                {...register(`activities.${index}.isRequired`)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                              />
                              Required activity
                            </label>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => move(index, index - 1)}
                            disabled={index === 0 || isSubmitting}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`Move activity ${index + 1} up`}
                          >
                            <ChevronUp size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => move(index, index + 1)}
                            disabled={
                              index === fields.length - 1 || isSubmitting
                            }
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`Move activity ${index + 1} down`}
                          >
                            <ChevronDown size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={isSubmitting}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Remove activity ${index + 1}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`activity-${index}-description`}
                          >
                            Description (optional)
                          </label>
                          <textarea
                            id={`activity-${index}-description`}
                            rows={2}
                            maxLength={500}
                            {...register(`activities.${index}.description`)}
                            className={`${inputClass} mt-1`}
                          />
                          {activityErrors?.description && (
                            <p className={errorClass}>
                              {activityErrors.description.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            className={labelClass}
                            htmlFor={`activity-${index}-instructions`}
                          >
                            Instructions (optional)
                          </label>
                          <textarea
                            id={`activity-${index}-instructions`}
                            rows={2}
                            maxLength={1000}
                            {...register(`activities.${index}.instructions`)}
                            className={`${inputClass} mt-1`}
                          />
                          {activityErrors?.instructions && (
                            <p className={errorClass}>
                              {activityErrors.instructions.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
