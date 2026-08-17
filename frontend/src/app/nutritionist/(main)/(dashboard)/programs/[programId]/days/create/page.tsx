"use client";

import { useRouter, useParams } from "next/navigation";
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
} from "react-hook-form";
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
import { nutriProgramDayService } from "@/services/nutritionist/nutriProgramDay.service";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ACTIVITY_VALUE_TYPES,
  type ProgramActivityCategory,
  type ActivityValueType,
} from "@/dtos/nutritionist/program/program-day-response.dto";
import type { CreateProgramDayDTO } from "@/dtos/nutritionist/program/program-day-request.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const optionalPositiveNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  return Number(value);
}, z.number().positive().optional());

const optionalPositiveInteger = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  return z.number().int().positive().parse(Number(value));
}, z.number().int().positive().optional());

const optionalTime = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return undefined;
  return value;
}, z.string().regex(TIME_REGEX, "Use HH:mm format").optional());

const activitySchema = z.object({
  category: z.enum(PROGRAM_ACTIVITY_CATEGORIES, {
    message: "Select a category",
  }),
  valueType: z.enum(ACTIVITY_VALUE_TYPES, { message: "Select a value type" }),
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).optional(),
  instructions: z.string().trim().max(1000).optional(),
  targetValue: optionalPositiveNumber,
  unit: z.string().trim().max(30).optional(),
  estimatedDurationMinutes: optionalPositiveInteger,
  scheduledTime: optionalTime,
  isRequired: z.boolean(),
  configuration: z.record(z.string(), z.unknown()).default({}),
});

const formSchema = z.object({
  dayNumber: z.coerce.number().int().min(1, "Day number must be at least 1"),
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
  custom: "boolean",
};

const CATEGORY_VALUE_TYPE_OPTIONS: Record<
  ProgramActivityCategory,
  ActivityValueType[]
> = {
  meal: ["boolean", "text"],
  exercise: ["boolean", "duration", "number"],
  habit: ["boolean", "text"],
  water: ["number"],
  supplement: ["boolean", "number"],
  meditation: ["boolean", "duration"],
  sleep: ["boolean", "duration", "number"],
  reading: ["boolean", "duration"],
  appointment: ["boolean", "text"],
  measurement: ["number", "text"],
  task: ["boolean", "text"],
  custom: ["boolean", "number", "duration", "photo", "text"],
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
  custom: "Custom",
};

const VALUE_TYPE_LABELS: Record<ActivityValueType, string> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
  photo: "Photo",
  text: "Text",
};

const CATEGORY_CONFIG_TITLES: Partial<Record<ProgramActivityCategory, string>> =
  {
    water: "Water settings",
    exercise: "Exercise settings",
    habit: "Habit settings",
    meal: "Meal settings",
    meditation: "Meditation settings",
    sleep: "Sleep settings",
    measurement: "Measurement settings",
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
    configuration: {},
  };
}

/* ------------------------------------------------------------------ */
/* Category-specific configuration                                    */
/* ------------------------------------------------------------------ */

type ConfigurationProps = {
  control: Control<FormInput, unknown, FormValues>;
  index: number;
};

interface WaterConfigValue {
  trackingMethod?: "daily_total" | "per_serving";
  reminderIntervalMinutes?: number;
}

function WaterConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as WaterConfigValue;
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Tracking method</label>
              <select
                value={config.trackingMethod ?? "daily_total"}
                onChange={(e) =>
                  field.onChange({
                    ...config,
                    trackingMethod: e.target.value as
                      | "daily_total"
                      | "per_serving",
                  })
                }
                className={`${inputClass} mt-1`}
              >
                <option value="daily_total">Daily total</option>
                <option value="per_serving">Per serving</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Reminder interval (min, optional)
              </label>
              <input
                type="number"
                min={0}
                value={
                  typeof config.reminderIntervalMinutes === "number"
                    ? config.reminderIntervalMinutes
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = { ...config };
                  if (raw === "") {
                    delete next.reminderIntervalMinutes;
                  } else {
                    next.reminderIntervalMinutes = Number(raw);
                  }
                  field.onChange(next);
                }}
                placeholder="60"
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      }}
    />
  );
}

interface ExerciseConfigValue {
  exerciseType?: string;
  intensity?: string;
}

const EXERCISE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "walking", label: "Walking" },
  { value: "running", label: "Running" },
  { value: "cycling", label: "Cycling" },
  { value: "strength", label: "Strength" },
  { value: "stretching", label: "Stretching" },
  { value: "other", label: "Other" },
];

const INTENSITY_OPTIONS: { value: string; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

function ExerciseConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as ExerciseConfigValue;
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Exercise type</label>
              <select
                value={config.exerciseType ?? "walking"}
                onChange={(e) =>
                  field.onChange({ ...config, exerciseType: e.target.value })
                }
                className={`${inputClass} mt-1`}
              >
                {EXERCISE_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Intensity</label>
              <select
                value={config.intensity ?? "moderate"}
                onChange={(e) =>
                  field.onChange({ ...config, intensity: e.target.value })
                }
                className={`${inputClass} mt-1`}
              >
                {INTENSITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }}
    />
  );
}

interface HabitConfigValue {
  prompts?: string[];
}

function HabitConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as HabitConfigValue;
        const prompts = config.prompts ?? [];

        const updatePrompts = (next: string[]) => {
          field.onChange({ ...config, prompts: next });
        };

        return (
          <div className="space-y-2">
            <label className={labelClass}>Reflection prompts (optional)</label>
            <div className="space-y-2">
              {prompts.map((prompt, promptIndex) => (
                <div key={promptIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => {
                      const next = [...prompts];
                      next[promptIndex] = e.target.value;
                      updatePrompts(next);
                    }}
                    placeholder="What went well today?"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updatePrompts(
                        prompts.filter((_, pi) => pi !== promptIndex),
                      )
                    }
                    className="rounded-lg p-1.5 text-slate-300 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Remove prompt"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updatePrompts([...prompts, ""])}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors duration-150 hover:bg-emerald-100"
            >
              <Plus size={13} />
              Add prompt
            </button>
          </div>
        );
      }}
    />
  );
}

interface MealConfigValue {
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  caloriesTarget?: number;
  proteinTarget?: number;
}

function MealConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as MealConfigValue;
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Meal type</label>
              <select
                value={config.mealType ?? "breakfast"}
                onChange={(e) =>
                  field.onChange({
                    ...config,
                    mealType: e.target.value as MealConfigValue["mealType"],
                  })
                }
                className={`${inputClass} mt-1`}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Calories target (optional)</label>
              <input
                type="number"
                min={0}
                value={
                  typeof config.caloriesTarget === "number"
                    ? config.caloriesTarget
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = { ...config };
                  if (raw === "") {
                    delete next.caloriesTarget;
                  } else {
                    next.caloriesTarget = Number(raw);
                  }
                  field.onChange(next);
                }}
                placeholder="600"
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Protein target (optional)</label>
              <input
                type="number"
                min={0}
                value={
                  typeof config.proteinTarget === "number"
                    ? config.proteinTarget
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = { ...config };
                  if (raw === "") {
                    delete next.proteinTarget;
                  } else {
                    next.proteinTarget = Number(raw);
                  }
                  field.onChange(next);
                }}
                placeholder="30"
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      }}
    />
  );
}

interface MeditationConfigValue {
  technique?: string;
  guided?: boolean;
}

const MEDITATION_TECHNIQUE_OPTIONS: { value: string; label: string }[] = [
  { value: "breathing", label: "Breathing" },
  { value: "body_scan", label: "Body scan" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "guided", label: "Guided" },
];

function MeditationConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as MeditationConfigValue;
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Technique</label>
              <select
                value={config.technique ?? "breathing"}
                onChange={(e) =>
                  field.onChange({ ...config, technique: e.target.value })
                }
                className={`${inputClass} mt-1`}
              >
                {MEDITATION_TECHNIQUE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <input
                  type="checkbox"
                  checked={config.guided ?? false}
                  onChange={(e) =>
                    field.onChange({ ...config, guided: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                />
                Guided
              </label>
            </div>
          </div>
        );
      }}
    />
  );
}

interface SleepConfigValue {
  bedtime?: string;
  wakeTime?: string;
}

function SleepConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as SleepConfigValue;
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Bedtime (optional)</label>
              <input
                type="time"
                value={config.bedtime ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = { ...config };
                  if (raw === "") {
                    delete next.bedtime;
                  } else {
                    next.bedtime = raw;
                  }
                  field.onChange(next);
                }}
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label className={labelClass}>Wake time (optional)</label>
              <input
                type="time"
                value={config.wakeTime ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const next = { ...config };
                  if (raw === "") {
                    delete next.wakeTime;
                  } else {
                    next.wakeTime = raw;
                  }
                  field.onChange(next);
                }}
                className={`${inputClass} mt-1`}
              />
            </div>
          </div>
        );
      }}
    />
  );
}

interface MeasurementConfigValue {
  measurementType?: string;
}

const MEASUREMENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "weight", label: "Weight" },
  { value: "waist", label: "Waist" },
  { value: "blood_pressure", label: "Blood pressure" },
  { value: "custom", label: "Custom" },
];

function MeasurementConfiguration({ control, index }: ConfigurationProps) {
  return (
    <Controller
      control={control}
      name={`activities.${index}.configuration`}
      render={({ field }) => {
        const config = (field.value ?? {}) as MeasurementConfigValue;
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Measurement type</label>
              <select
                value={config.measurementType ?? "weight"}
                onChange={(e) =>
                  field.onChange({
                    ...config,
                    measurementType: e.target.value,
                  })
                }
                className={`${inputClass} mt-1`}
              >
                {MEASUREMENT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }}
    />
  );
}

function ActivityConfiguration({
  category,
  control,
  index,
}: { category: ProgramActivityCategory } & ConfigurationProps) {
  const body = (() => {
    switch (category) {
      case "water":
        return <WaterConfiguration control={control} index={index} />;
      case "exercise":
        return <ExerciseConfiguration control={control} index={index} />;
      case "habit":
        return <HabitConfiguration control={control} index={index} />;
      case "meal":
        return <MealConfiguration control={control} index={index} />;
      case "meditation":
        return <MeditationConfiguration control={control} index={index} />;
      case "sleep":
        return <SleepConfiguration control={control} index={index} />;
      case "measurement":
        return <MeasurementConfiguration control={control} index={index} />;
      default:
        return null;
    }
  })();

  if (!body) return null;

  return (
    <div className="space-y-2 border-t border-slate-200/80 pt-3">
      <h3 className={labelClass}>{CATEGORY_CONFIG_TITLES[category]}</h3>
      {body}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Submit payload helpers                                             */
/* ------------------------------------------------------------------ */

function cleanConfiguration(
  configuration: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!configuration) return {};
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(configuration)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) => !(typeof item === "string" && item.trim() === ""),
      );
      if (filtered.length === 0) continue;
      cleaned[key] = filtered;
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

type ActivityPayload = CreateProgramDayDTO["activities"][number] & {
  configuration: Record<string, unknown>;
};

type ProgramDayPayload = Omit<CreateProgramDayDTO, "activities"> & {
  activities: ActivityPayload[];
};

export default function CreateProgramDayPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

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
    setValue(`activities.${index}.valueType`, defaultValueType);
    applyValueTypeChange(index, defaultValueType);
    setValue(`activities.${index}.configuration`, {});
  };

  const onSubmit = async (values: FormValues) => {
    const payload: ProgramDayPayload = {
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
          configuration: cleanConfiguration(activity.configuration),
        };
      }),
    };
    try {
      await nutriProgramDayService.createProgramDay(programId, payload);
      toast.success(`Day ${values.dayNumber} created.`);
      router.push(`/nutritionist/programs/${programId}/days`);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to create program day:", message);
      toast.error(message || "Couldn't create this day. Please try again.");
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    console.error("Program day validation failed:", formErrors);
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
          <p className="text-sm font-medium text-slate-500">
            Build the list of activities scheduled for this day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
        >
          {/* Day number */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <label className={labelClass}>Day number</label>
            <input
              type="number"
              min={1}
              {...register("dayNumber")}
              className={`${inputClass} mt-1.5 sm:w-40`}
            />
            {errors.dayNumber && (
              <p className={errorClass}>{errors.dayNumber.message}</p>
            )}
          </div>

          {/* Activities */}
          <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-tight text-slate-900">
                Activities
              </h2>
              <button
                type="button"
                onClick={() => append(emptyActivity())}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors duration-150 hover:bg-emerald-100"
              >
                <Plus size={13} />
                Add activity
              </button>
            </div>

            {errors.activities?.root && (
              <p className={errorClass}>{errors.activities.root.message}</p>
            )}
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
              const category = watch(`activities.${index}.category`);
              const valueType = watch(`activities.${index}.valueType`);
              const showTargetAndUnit =
                NEEDS_TARGET_AND_UNIT.includes(valueType);
              const showEstimatedDuration =
                NEEDS_ESTIMATED_DURATION.includes(valueType);
              const valueTypeOptions = CATEGORY_VALUE_TYPE_OPTIONS[category];
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

                    <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className={labelClass}>Category</label>
                        <Controller
                          control={control}
                          name={`activities.${index}.category`}
                          render={({ field: f }) => (
                            <select
                              {...f}
                              onChange={(e) => {
                                const category = e.target
                                  .value as ProgramActivityCategory;
                                f.onChange(category);
                                applyCategoryChange(index, category);
                              }}
                              className={`${inputClass} mt-1`}
                            >
                              {PROGRAM_ACTIVITY_CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                  {CATEGORY_LABELS[c]}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-2">
                        <label className={labelClass}>Title</label>
                        <input
                          type="text"
                          {...register(`activities.${index}.title`)}
                          placeholder="Grilled chicken salad"
                          className={`${inputClass} mt-1`}
                        />
                        {activityErrors?.title && (
                          <p className={errorClass}>
                            {activityErrors.title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Response type</label>
                        <Controller
                          control={control}
                          name={`activities.${index}.valueType`}
                          render={({ field: f }) => (
                            <select
                              {...f}
                              onChange={(e) => {
                                const nextValueType = e.target
                                  .value as ActivityValueType;
                                f.onChange(nextValueType);
                                applyValueTypeChange(index, nextValueType);
                              }}
                              className={`${inputClass} mt-1`}
                            >
                              {valueTypeOptions.map((v) => (
                                <option key={v} value={v}>
                                  {VALUE_TYPE_LABELS[v]}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                      </div>

                      {showTargetAndUnit && (
                        <>
                          <div>
                            <label className={labelClass}>Target value</label>
                            <input
                              type="number"
                              min={0}
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
                            <label className={labelClass}>Unit</label>
                            <input
                              type="text"
                              {...register(`activities.${index}.unit`)}
                              placeholder="mins, ml, reps..."
                              className={`${inputClass} mt-1`}
                            />
                          </div>
                        </>
                      )}

                      {showEstimatedDuration && (
                        <div>
                          <label className={labelClass}>
                            Est. duration (min)
                          </label>
                          <input
                            type="number"
                            min={0}
                            {...register(
                              `activities.${index}.estimatedDurationMinutes`,
                            )}
                            placeholder="Optional"
                            className={`${inputClass} mt-1`}
                          />
                        </div>
                      )}

                      <div>
                        <label className={labelClass}>Scheduled time</label>
                        <input
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

                      <div className="col-span-2 flex items-end gap-2 pb-0.5 sm:col-span-1">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <input
                            type="checkbox"
                            {...register(`activities.${index}.isRequired`)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                          />
                          Required
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => index > 0 && move(index, index - 1)}
                        disabled={index === 0}
                        className="rounded-lg p-1 text-slate-300 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move up"
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          index < fields.length - 1 && move(index, index + 1)
                        }
                        disabled={index === fields.length - 1}
                        className="rounded-lg p-1 text-slate-300 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Move down"
                      >
                        <ChevronDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-lg p-1.5 text-slate-300 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Remove activity"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Description (optional)
                      </label>
                      <textarea
                        {...register(`activities.${index}.description`)}
                        rows={2}
                        className={`${inputClass} mt-1`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Instructions (optional)
                      </label>
                      <textarea
                        {...register(`activities.${index}.instructions`)}
                        rows={2}
                        className={`${inputClass} mt-1`}
                      />
                    </div>
                  </div>

                  <ActivityConfiguration
                    category={category}
                    control={control}
                    index={index}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Creating…" : "Create day"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
