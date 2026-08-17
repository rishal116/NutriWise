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

import { nutriProgramDayService } from "@/services/nutritionist/nutriProgramDay.service";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ACTIVITY_VALUE_TYPES,
  type ProgramActivityCategory,
  type ActivityValueType,
  type ProgramDayResponseDTO,
} from "@/dtos/nutritionist/program/program-day-response.dto";
import type { UpdateProgramDayDTO } from "@/dtos/nutritionist/program/program-day-request.dto";

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

// Spec's canonical "Dynamic form behavior summary" drives visibility here,
// same as the create-day form — keep these two in sync if the spec changes.
const NEEDS_TARGET_AND_UNIT: ActivityValueType[] = ["number", "duration"];
const NEEDS_ESTIMATED_DURATION: ActivityValueType[] = ["boolean", "duration"];

const CATEGORY_DEFAULT_VALUE_TYPE: Record<ProgramActivityCategory, ActivityValueType> = {
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

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const optionalTime = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) return undefined;
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
  targetValue: z.coerce.number().positive().optional(),
  unit: z.string().trim().max(30).optional(),
  estimatedDurationMinutes: z.coerce.number().int().positive().optional(),
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
const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-slate-500";
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

  const [day, setDay] = useState<ProgramDayResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    if (!dayId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await nutriProgramDayService.getProgramDayDetails(dayId);
        if (cancelled) return;
        setDay(res);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          toast.error("Couldn't load this day.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dayId]);

  const goToList = () =>
    router.push(`/nutritionist/programs/${programId}/days`);

  const startEditing = () => {
    if (!day) return;
    reset({
      activities: day.activities.map((a) => ({
        category: a.category,
        title: a.title,
        description: a.description ?? "",
        instructions: a.instructions ?? "",
        valueType: a.valueType,
        targetValue: a.targetValue,
        unit: a.unit ?? "",
        estimatedDurationMinutes: a.estimatedDurationMinutes,
        scheduledTime: a.scheduledTime ?? "",
        isRequired: a.isRequired,
      })),
    });
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  // Rule #6: clear fields that no longer apply when valueType changes.
  const applyValueTypeChange = (index: number, valueType: ActivityValueType) => {
    if (!NEEDS_TARGET_AND_UNIT.includes(valueType)) {
      setValue(`activities.${index}.targetValue`, undefined);
      setValue(`activities.${index}.unit`, "");
    }
    if (!NEEDS_ESTIMATED_DURATION.includes(valueType)) {
      setValue(`activities.${index}.estimatedDurationMinutes`, undefined);
    }
  };

  const applyCategoryChange = (index: number, category: ProgramActivityCategory) => {
    const defaultValueType = CATEGORY_DEFAULT_VALUE_TYPE[category];
    setValue(`activities.${index}.valueType`, defaultValueType);
    applyValueTypeChange(index, defaultValueType);
  };

  const onSave = async (values: FormValues) => {
    if (!day) return;

    const payload: UpdateProgramDayDTO = {
      activities: values.activities.map((activity, index) => {
        const showTargetAndUnit = NEEDS_TARGET_AND_UNIT.includes(activity.valueType);
        const showEstimatedDuration = NEEDS_ESTIMATED_DURATION.includes(activity.valueType);

        return {
          category: activity.category,
          title: activity.title.trim(),
          description: activity.description?.trim() || undefined,
          instructions: activity.instructions?.trim() || undefined,
          valueType: activity.valueType,
          targetValue: showTargetAndUnit ? activity.targetValue : undefined,
          unit: showTargetAndUnit ? activity.unit?.trim() || undefined : undefined,
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
      const updated = await nutriProgramDayService.updateProgramDay(
        dayId,
        payload,
      );
      setDay(updated);
      setIsEditing(false);
      toast.success("Day updated.");
    } catch {
      toast.error("Couldn't save changes. Please try again.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await nutriProgramDayService.deleteProgramDay(dayId);
      toast.success("Day deleted.");
      goToList();
    } catch {
      toast.error("Couldn't delete this day. Please try again.");
      setDeleting(false);
      setConfirmingDelete(false);
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
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-xs">
            <p className="text-sm font-bold text-slate-700">Day not found</p>
            <p className="text-xs font-medium text-slate-400">
              This day may have been removed or the link is incorrect.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Day {day.dayNumber}
              </h1>

              {!isEditing ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-emerald-800"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 transition-colors duration-150 hover:bg-rose-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50"
                >
                  <X size={13} />
                  Cancel
                </button>
              )}
            </div>

            {confirmingDelete && (
              <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-semibold text-rose-700">
                  Delete Day {day.dayNumber}? This can&apos;t be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors duration-150 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-rose-700 disabled:opacity-60"
                  >
                    {deleting ? "Deleting…" : "Confirm delete"}
                  </button>
                </div>
              </div>
            )}

            {!isEditing ? (
              /* ---------- VIEW MODE ---------- */
              <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
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
                            <div className="flex items-center gap-2">
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                                {CATEGORY_LABELS[activity.category]}
                              </span>
                              {activity.isRequired && (
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                  Required
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {VALUE_TYPE_LABELS[activity.valueType]}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-bold text-slate-800">
                            {activity.title}
                          </p>

                          {activity.description && (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {activity.description}
                            </p>
                          )}
                          {activity.instructions && (
                            <p className="mt-1 text-xs font-medium italic text-slate-400">
                              {activity.instructions}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap gap-3">
                            {activity.targetValue != null && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <Target size={12} className="text-slate-400" />
                                {activity.targetValue} {activity.unit ?? ""}
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
              /* ---------- EDIT MODE ---------- */
              <form
                onSubmit={handleSubmit(onSave)}
                className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
              >
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

                {errors.activities?.message && (
                  <p className={errorClass}>{errors.activities.message}</p>
                )}

                {fields.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
                    <p className="text-xs font-medium text-slate-400">No activities added yet.</p>
                  </div>
                )}

                {fields.map((field, index) => {
                  const valueType = watch(`activities.${index}.valueType`);
                  const showTargetAndUnit = NEEDS_TARGET_AND_UNIT.includes(valueType);
                  const showEstimatedDuration = NEEDS_ESTIMATED_DURATION.includes(valueType);
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
                                    const category = e.target.value as ProgramActivityCategory;
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
                                    const nextValueType = e.target.value as ActivityValueType;
                                    f.onChange(nextValueType);
                                    applyValueTypeChange(index, nextValueType);
                                  }}
                                  className={`${inputClass} mt-1`}
                                >
                                  {ACTIVITY_VALUE_TYPES.map((v) => (
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
                              <label className={labelClass}>Est. duration (min)</label>
                              <input
                                type="number"
                                min={0}
                                {...register(`activities.${index}.estimatedDurationMinutes`)}
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
                              index < fields.length - 1 &&
                              move(index, index + 1)
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
                          <label className={labelClass}>Description (optional)</label>
                          <textarea
                            {...register(`activities.${index}.description`)}
                            rows={2}
                            className={`${inputClass} mt-1`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Instructions (optional)</label>
                          <textarea
                            {...register(`activities.${index}.instructions`)}
                            rows={2}
                            className={`${inputClass} mt-1`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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