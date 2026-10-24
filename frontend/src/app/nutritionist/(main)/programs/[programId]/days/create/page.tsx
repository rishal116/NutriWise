"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";

import { nutriProgramDayService } from "@/services/nutritionist/nutri-program-day.service";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ACTIVITY_VALUE_TYPES,
  type ProgramActivityCategory,
  type ActivityValueType,
} from "@/types/program-activity.types";
import type { CreateNutriProgramDayDTO } from "@/dtos/nutritionist/program/nutri-program-day-request.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useEffect, useState } from "react";

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
  category: z.enum(PROGRAM_ACTIVITY_CATEGORIES, {
    message: "Select a category",
  }),
  valueType: z.enum(ACTIVITY_VALUE_TYPES, {
    message: "Select a response type",
  }),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).optional(),
  instructions: z.string().trim().max(1000).optional(),
  targetValue: optionalPositiveNumber,
  unit: z.string().trim().max(30).optional(),
  estimatedDurationMinutes: optionalPositiveInteger,
  scheduledTime: optionalTime,
  isRequired: z.boolean(),
});

const formSchema = z.object({
  dayNumber: z.coerce
    .number()
    .int("Day number must be a whole number")
    .min(1, "Day number must be at least 1"),
  activities: z
    .array(activitySchema)
    .min(1, "Add at least one activity for this day"),
});

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;
type ActivityInput = FormInput["activities"][number];

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

const CATEGORY_VALUE_TYPE_OPTIONS: Record<
  ProgramActivityCategory,
  ActivityValueType[]
> = {
  meal: ["boolean", "text", "photo"],
  exercise: ["boolean", "duration", "number", "photo"],
  habit: ["boolean", "text"],
  water: ["number"],
  supplement: ["boolean", "number", "photo"],
  meditation: ["boolean", "duration"],
  sleep: ["duration", "number"],
  reading: ["boolean", "duration", "text", "photo"],
  appointment: ["boolean", "text"],
  measurement: ["number", "photo"],
  task: ["boolean", "text", "photo"],
};

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

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

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

export default function CreateProgramDayPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

  const [durationDays, setDurationDays] = useState<number | null>(null);
  const [durationLoaded, setDurationLoaded] = useState(false);

  useEffect(() => {
    setDurationLoaded(false);
    setDurationDays(null);

    if (!programId) {
      setDurationLoaded(true);
      return;
    }

    const storedDuration = sessionStorage.getItem(
      `nutriwise:program-duration:${programId}`,
    );

    if (storedDuration !== null) {
      const duration = Number(storedDuration);

      if (Number.isInteger(duration) && duration >= 1) {
        setDurationDays(duration);
      }
    }

    setDurationLoaded(true);
  }, [programId]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dayNumber: 1,
      activities: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  const goBack = () => {
    router.push(`/nutritionist/programs/${programId}/days`);
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

  const onSubmit = async (values: FormValues) => {
    if (durationDays === null) {
      toast.error(
        "Program duration is unavailable. Open program details first.",
      );
      return;
    }

    if (values.dayNumber < 1 || values.dayNumber > durationDays) {
      toast.error(`Day number must be between 1 and ${durationDays}.`);
      return;
    }

    const payload: CreateNutriProgramDayDTO = {
      dayNumber: values.dayNumber,
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
      await nutriProgramDayService.createProgramDay(programId, payload);

      toast.success(`Day ${values.dayNumber} created.`);
      router.push(`/nutritionist/programs/${programId}/days`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message || "Couldn't create this day. Please try again.");
    }
  };

  const onInvalid = () => {
    toast.error("Please fix the validation errors before submitting.");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors duration-150 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to days
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Add a program day
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Build the list of activities scheduled for this day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <label className={labelClass} htmlFor="dayNumber">
              Day number
            </label>

            <p className="mt-1 text-xs text-slate-500">
              Program duration:{" "}
              {durationDays !== null ? `${durationDays} days` : "Unavailable"}
            </p>

            <input
              id="dayNumber"
              type="number"
              min={1}
              max={durationDays ?? undefined}
              step={1}
              disabled={
                !durationLoaded || durationDays === null || isSubmitting
              }
              {...register("dayNumber", { valueAsNumber: true })}
              className={`${inputClass} mt-1.5 sm:w-40`}
            />

            {errors.dayNumber && (
              <p className={errorClass}>{errors.dayNumber.message}</p>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Activities
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add and arrange the activities for this day.
                </p>
              </div>

              <button
                type="button"
                onClick={() => append(emptyActivity())}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
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
                <button
                  type="button"
                  onClick={() => append(emptyActivity())}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <Plus size={13} />
                  Add your first activity
                </button>
              </div>
            )}

            {fields.map((field, index) => {
              const category = watch(`activities.${index}.category`);
              const valueType = watch(`activities.${index}.valueType`);

              const valueTypeOptions = CATEGORY_VALUE_TYPE_OPTIONS[category];

              const showTargetAndUnit =
                NEEDS_TARGET_AND_UNIT.includes(valueType);

              const showEstimatedDuration =
                NEEDS_ESTIMATED_DURATION.includes(valueType);

              const activityErrors = errors.activities?.[index];

              return (
                <div
                  key={field.id}
                  className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex shrink-0 flex-col items-center gap-1 pt-2 text-slate-300">
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
                                const nextCategory = event.target
                                  .value as ProgramActivityCategory;

                                categoryField.onChange(nextCategory);
                                applyCategoryChange(index, nextCategory);
                              }}
                              className={`${inputClass} mt-1`}
                            >
                              {PROGRAM_ACTIVITY_CATEGORIES.map((item) => (
                                <option key={item} value={item}>
                                  {CATEGORY_LABELS[item]}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {activityErrors?.category && (
                          <p className={errorClass}>
                            {activityErrors.category.message}
                          </p>
                        )}
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
                          placeholder="Morning walk"
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
                          htmlFor={`activity-${index}-valueType`}
                        >
                          Response type
                        </label>
                        <Controller
                          control={control}
                          name={`activities.${index}.valueType`}
                          render={({ field: valueTypeField }) => (
                            <select
                              {...valueTypeField}
                              id={`activity-${index}-valueType`}
                              onChange={(event) => {
                                const nextValueType = event.target
                                  .value as ActivityValueType;

                                valueTypeField.onChange(nextValueType);
                                applyValueTypeChange(index, nextValueType);
                              }}
                              className={`${inputClass} mt-1`}
                            >
                              {valueTypeOptions.map((item) => (
                                <option key={item} value={item}>
                                  {VALUE_TYPE_LABELS[item]}
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

                      {showTargetAndUnit && (
                        <>
                          <div>
                            <label
                              className={labelClass}
                              htmlFor={`activity-${index}-targetValue`}
                            >
                              Target value
                            </label>
                            <input
                              id={`activity-${index}-targetValue`}
                              type="number"
                              min="0"
                              step="any"
                              {...register(`activities.${index}.targetValue`)}
                              placeholder="30"
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
                              {...register(`activities.${index}.unit`)}
                              placeholder="ml, reps, minutes..."
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
                            {...register(
                              `activities.${index}.estimatedDurationMinutes`,
                            )}
                            placeholder="Optional"
                            className={`${inputClass} mt-1`}
                          />
                          {activityErrors?.estimatedDurationMinutes && (
                            <p className={errorClass}>
                              {activityErrors.estimatedDurationMinutes.message}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label
                          className={labelClass}
                          htmlFor={`activity-${index}-scheduledTime`}
                        >
                          Scheduled time
                        </label>
                        <input
                          id={`activity-${index}-scheduledTime`}
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
                        aria-label={`Move activity ${index + 1} up`}
                        className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronUp size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => move(index, index + 1)}
                        disabled={index === fields.length - 1 || isSubmitting}
                        aria-label={`Move activity ${index + 1} down`}
                        className="rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronDown size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                        aria-label={`Remove activity ${index + 1}`}
                        className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
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
                        placeholder="Briefly describe this activity"
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
                        placeholder="Steps or guidance to follow"
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
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting || !durationLoaded || durationDays === null
              }
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating…" : "Create day"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
