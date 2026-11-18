"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Save,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { nutriProgramDayService } from "@/services/nutritionist/nutri-program-day.service";

import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ACTIVITY_VALUE_TYPES,
  type ProgramActivityCategory,
  type ActivityValueType,
} from "@/types/program-activity.types";

import type { NutriProgramDayResponseDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-response.dto";
import type { UpdateNutriProgramDayDTO } from "@/dtos/nutritionist/program-day/nutri-program-day-request.dto";

interface EditProgramDayProps {
  programId: string;
  dayId: string;
}

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

const NEEDS_TARGET_AND_UNIT: ActivityValueType[] = [
  "number",
  "duration",
];

const NEEDS_ESTIMATED_DURATION: ActivityValueType[] = [
  "boolean",
  "duration",
];

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

const optionalPositiveNumber = z.preprocess(
  (value) => {
    if (value === "" || value === undefined || value === null) {
      return undefined;
    }

    return Number(value);
  },
  z.number().positive("Must be greater than zero").optional(),
);

const optionalPositiveInteger = z.preprocess(
  (value) => {
    if (value === "" || value === undefined || value === null) {
      return undefined;
    }

    return Number(value);
  },
  z
    .number()
    .int("Must be a whole number")
    .positive("Must be greater than zero")
    .optional(),
);

const optionalTime = z.preprocess(
  (value) => {
    if (value === "" || value === undefined || value === null) {
      return undefined;
    }

    return value;
  },
  z.string().regex(TIME_REGEX, "Use HH:mm format").optional(),
);

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
    { message: "Select a response type" },
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
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-slate-500";

const errorClass = "mt-1 text-[11px] font-medium text-rose-600";

function emptyActivity(): ActivityInput {
  return {
    category: "meal",
    title: "",
    description: "",
    instructions: "",
    valueType: "boolean",
    targetValue: undefined,
    unit: "",
    estimatedDurationMinutes: undefined,
    scheduledTime: "",
    isRequired: false,
  };
}

function mapDayToForm(
  day: NutriProgramDayResponseDTO,
): FormInput {
  return {
    activities: [...day.activities]
      .sort((first, second) => first.order - second.order)
      .map((activity) => ({
        category: activity.category,
        title: activity.title,
        description: activity.description ?? "",
        instructions: activity.instructions ?? "",
        valueType: activity.valueType,
        targetValue: activity.targetValue,
        unit: activity.unit ?? "",
        estimatedDurationMinutes:
          activity.estimatedDurationMinutes,
        scheduledTime: activity.scheduledTime ?? "",
        isRequired: activity.isRequired,
      })),
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

export function EditProgramDay({
  programId,
  dayId,
}: EditProgramDayProps) {
  const router = useRouter();

  const [day, setDay] =
    useState<NutriProgramDayResponseDTO | null>(null);

  const [loading, setLoading] = useState(true);

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

  const {
    fields,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "activities",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchDay = async () => {
      try {
        const result =
          await nutriProgramDayService.getProgramDayDetails(dayId);

        if (cancelled) return;

        setDay(result);
        reset(mapDayToForm(result));
      } catch {
        if (cancelled) return;

        setDay(null);
        toast.error("Couldn't load this day.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!programId || !dayId) {
      setLoading(false);
      return;
    }

    void fetchDay();

    return () => {
      cancelled = true;
    };
  }, [programId, dayId, reset]);

  const goBack = () => {
    router.push(
      `/nutritionist/programs/${programId}/days/${dayId}`,
    );
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
      setValue(
        `activities.${index}.estimatedDurationMinutes`,
        undefined,
      );
    }
  };

  const applyCategoryChange = (
    index: number,
    category: ProgramActivityCategory,
  ) => {
    const defaultValueType =
      CATEGORY_DEFAULT_VALUE_TYPE[category];

    setValue(
      `activities.${index}.valueType`,
      defaultValueType,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    applyValueTypeChange(index, defaultValueType);
  };

  const onSave = async (values: FormValues) => {
    if (!day) return;

    const payload: UpdateNutriProgramDayDTO = {
      activities: values.activities.map((activity, index) => {
        const showTargetAndUnit =
          NEEDS_TARGET_AND_UNIT.includes(activity.valueType);

        const showEstimatedDuration =
          NEEDS_ESTIMATED_DURATION.includes(activity.valueType);

        return {
          category: activity.category,
          title: activity.title.trim(),
          description: activity.description?.trim() || undefined,
          instructions: activity.instructions?.trim() || undefined,
          valueType: activity.valueType,
          targetValue: showTargetAndUnit
            ? activity.targetValue
            : undefined,
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
      await nutriProgramDayService.updateProgramDay(
        dayId,
        payload,
      );

      toast.success("Day updated successfully.");

      router.push(
        `/nutritionist/programs/${programId}/days/${dayId}`,
      );
      router.refresh();
    } catch {
      toast.error("Couldn't save changes. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to day details
        </button>

        {loading ? (
          <DetailSkeleton />
        ) : !day ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">
              Day not found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              This day may have been removed or the link is incorrect.
            </p>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Back to day details
            </button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Edit Day {day.dayNumber}
              </h1>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Manage activities, schedules, and requirements for this day.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSave)}
              className="space-y-5"
            >
              <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-900">
                      Activities ({fields.length})
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Add, edit, remove, or reorder activities.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => append(emptyActivity())}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <Plus size={14} />
                    Add activity
                  </button>
                </div>

                {errors.activities?.message && (
                  <p className={errorClass}>
                    {errors.activities.message}
                  </p>
                )}

                {fields.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
                    <p className="text-xs font-medium text-slate-400">
                      No activities added yet.
                    </p>

                    <button
                      type="button"
                      onClick={() => append(emptyActivity())}
                      className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Add your first activity
                    </button>
                  </div>
                )}

                {fields.map((field, index) => {
                  const valueType = watch(
                    `activities.${index}.valueType`,
                  );

                  const showTargetAndUnit =
                    NEEDS_TARGET_AND_UNIT.includes(valueType);

                  const showEstimatedDuration =
                    NEEDS_ESTIMATED_DURATION.includes(valueType);

                  const activityErrors =
                    errors.activities?.[index];

                  return (
                    <div
                      key={field.id}
                      className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 pt-1.5 text-slate-300">
                          <GripVertical size={15} />
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
                                    const category =
                                      event.target.value as ProgramActivityCategory;

                                    categoryField.onChange(category);
                                    applyCategoryChange(index, category);
                                  }}
                                  className={inputClass}
                                >
                                  {PROGRAM_ACTIVITY_CATEGORIES.map(
                                    (category) => (
                                      <option
                                        key={category}
                                        value={category}
                                      >
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
                              placeholder="Enter activity title"
                              {...register(`activities.${index}.title`)}
                              className={inputClass}
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
                                    const nextValueType =
                                      event.target.value as ActivityValueType;

                                    valueTypeField.onChange(nextValueType);
                                    applyValueTypeChange(
                                      index,
                                      nextValueType,
                                    );
                                  }}
                                  className={inputClass}
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
                                  placeholder="Enter target"
                                  {...register(
                                    `activities.${index}.targetValue`,
                                  )}
                                  className={inputClass}
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
                                  {...register(
                                    `activities.${index}.unit`,
                                  )}
                                  className={inputClass}
                                />
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
                                className={inputClass}
                              />

                              {activityErrors?.estimatedDurationMinutes && (
                                <p className={errorClass}>
                                  {
                                    activityErrors
                                      .estimatedDurationMinutes.message
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
                              {...register(
                                `activities.${index}.scheduledTime`,
                              )}
                              className={inputClass}
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
                                {...register(
                                  `activities.${index}.isRequired`,
                                )}
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
                            aria-label={`Move activity ${index + 1} up`}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ChevronUp size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => move(index, index + 1)}
                            disabled={
                              index === fields.length - 1 || isSubmitting
                            }
                            aria-label={`Move activity ${index + 1} down`}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ChevronDown size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={isSubmitting}
                            aria-label={`Remove activity ${index + 1}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
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
                            placeholder="Describe this activity"
                            {...register(
                              `activities.${index}.description`,
                            )}
                            className={inputClass}
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
                            placeholder="Provide instructions"
                            {...register(
                              `activities.${index}.instructions`,
                            )}
                            className={inputClass}
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
              </section>

              <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || loading || !day}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={15} />
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}