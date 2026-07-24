"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { nutriProgramDayService } from "@/services/nutritionist/nutriProgramDay.service";
import type {
  HabitDTO,
  MealDTO,
  UpdateProgramDayDTO,
  WorkoutDTO,
} from "@/dtos/nutritionist/program/program-day-request.dto";
import { ProgramDayDetailsDTO } from "@/dtos/nutritionist/program/program-day-response.dto";

type DraftMeal = MealDTO & { _key: string };
type DraftWorkout = WorkoutDTO & { _key: string };
type DraftHabit = HabitDTO & { _key: string };

const MEAL_TYPES: MealDTO["mealType"][] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

function useLocalKey(): () => string {
  const counter = useRef(0);
  return () => {
    counter.current += 1;
    return `key-${counter.current}`;
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10";
const labelClass = "text-xs font-semibold text-slate-500";

function SectionHeader({
  title,
  onAdd,
  addLabel,
}: {
  title: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
      >
        <Plus size={13} />
        {addLabel}
      </button>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
      aria-label="Remove"
    >
      <Trash2 size={15} />
    </button>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

function toDraftMeals(
  day: ProgramDayDetailsDTO,
  keyFn: () => string,
): DraftMeal[] {
  return day.meals.map((m) => ({
    _key: keyFn(),
    mealType: m.mealType,
    title: m.title,
    description: m.description,
    calories: m.calories,
    order: m.order,
  }));
}

function toDraftWorkouts(
  day: ProgramDayDetailsDTO,
  keyFn: () => string,
): DraftWorkout[] {
  return day.workouts.map((w) => ({
    _key: keyFn(),
    title: w.title,
    duration: w.duration,
    instructions: w.instructions,
    order: w.order,
  }));
}

function toDraftHabits(
  day: ProgramDayDetailsDTO,
  keyFn: () => string,
): DraftHabit[] {
  return day.habits.map((h) => ({
    _key: keyFn(),
    title: h.title,
    targetValue: h.targetValue,
    unit: h.unit,
    order: h.order,
  }));
}

export default function ProgramDayDetailsPage() {
  const { programId, dayId } = useParams<{
    programId: string;
    dayId: string;
  }>();
  const router = useRouter();
  const nextKey = useLocalKey();

  const [day, setDay] = useState<ProgramDayDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [meals, setMeals] = useState<DraftMeal[]>([]);
  const [workouts, setWorkouts] = useState<DraftWorkout[]>([]);
  const [habits, setHabits] = useState<DraftHabit[]>([]);

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

  const startEditing = () => {
    if (!day) return;
    setMeals(toDraftMeals(day, nextKey));
    setWorkouts(toDraftWorkouts(day, nextKey));
    setHabits(toDraftHabits(day, nextKey));
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const addMeal = () =>
    setMeals((prev) => [
      ...prev,
      { _key: nextKey(), mealType: "breakfast", title: "", order: 0 },
    ]);
  const addWorkout = () =>
    setWorkouts((prev) => [
      ...prev,
      { _key: nextKey(), title: "", duration: 30, order: 0 },
    ]);
  const addHabit = () =>
    setHabits((prev) => [...prev, { _key: nextKey(), title: "", order: 0 }]);

  const updateMeal = (key: string, patch: Partial<MealDTO>) =>
    setMeals((prev) =>
      prev.map((m) => (m._key === key ? { ...m, ...patch } : m)),
    );
  const updateWorkout = (key: string, patch: Partial<WorkoutDTO>) =>
    setWorkouts((prev) =>
      prev.map((w) => (w._key === key ? { ...w, ...patch } : w)),
    );
  const updateHabit = (key: string, patch: Partial<HabitDTO>) =>
    setHabits((prev) =>
      prev.map((h) => (h._key === key ? { ...h, ...patch } : h)),
    );

  const removeMeal = (key: string) =>
    setMeals((prev) => prev.filter((m) => m._key !== key));
  const removeWorkout = (key: string) =>
    setWorkouts((prev) => prev.filter((w) => w._key !== key));
  const removeHabit = (key: string) =>
    setHabits((prev) => prev.filter((h) => h._key !== key));

  const handleSave = async () => {
    if (!day) return;
    if (meals.some((m) => !m.title.trim())) {
      toast.error("Every meal needs a title.");
      return;
    }
    if (workouts.some((w) => !w.title.trim())) {
      toast.error("Every workout needs a title.");
      return;
    }
    if (habits.some((h) => !h.title.trim())) {
      toast.error("Every habit needs a title.");
      return;
    }

    const payload: UpdateProgramDayDTO = {
      meals: meals.map(({ _key, ...meal }, i) => ({ ...meal, order: i + 1 })),
      workouts: workouts.map(({ _key, ...workout }, i) => ({
        ...workout,
        order: i + 1,
      })),
      habits: habits.map(({ _key, ...habit }, i) => ({
        ...habit,
        order: i + 1,
      })),
    };

    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await nutriProgramDayService.deleteProgramDay(dayId);
      toast.success("Day deleted.");
      router.push(`/nutritionist/program/${programId}/days`);
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
          onClick={() => router.push(`/nutritionist/program/${programId}/days`)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to days
        </button>

        {loading ? (
          <DetailSkeleton />
        ) : notFound || !day ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">Day not found</p>
            <p className="text-xs text-slate-400">
              This day may have been removed or the link is incorrect.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Day {day.dayNumber}
              </h1>

              {!isEditing ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
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
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {deleting ? "Deleting…" : "Confirm delete"}
                  </button>
                </div>
              </div>
            )}

            {/* Meals */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {isEditing ? (
                <SectionHeader
                  title="Meals"
                  onAdd={addMeal}
                  addLabel="Add meal"
                />
              ) : (
                <h2 className="text-sm font-bold text-slate-900">Meals</h2>
              )}

              {!isEditing &&
                (day.meals.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No meals for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-800">
                            {meal.title}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            {meal.mealType}
                          </span>
                        </div>
                        {meal.description && (
                          <p className="mt-1 text-xs text-slate-500">
                            {meal.description}
                          </p>
                        )}
                        {meal.calories != null && (
                          <p className="mt-1 text-xs font-medium text-slate-400">
                            {meal.calories} kcal
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

              {isEditing && (
                <>
                  {meals.length === 0 && (
                    <p className="text-xs text-slate-400">
                      No meals added yet.
                    </p>
                  )}
                  {meals.map((meal) => (
                    <div
                      key={meal._key}
                      className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="col-span-2 sm:col-span-1">
                            <label className={labelClass}>Type</label>
                            <select
                              value={meal.mealType}
                              onChange={(e) =>
                                updateMeal(meal._key, {
                                  mealType: e.target
                                    .value as MealDTO["mealType"],
                                })
                              }
                              className={`${inputClass} mt-1`}
                            >
                              {MEAL_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2 sm:col-span-2">
                            <label className={labelClass}>Title</label>
                            <input
                              type="text"
                              value={meal.title}
                              onChange={(e) =>
                                updateMeal(meal._key, {
                                  title: e.target.value,
                                })
                              }
                              className={`${inputClass} mt-1`}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Calories</label>
                            <input
                              type="number"
                              min={0}
                              value={meal.calories ?? ""}
                              onChange={(e) =>
                                updateMeal(meal._key, {
                                  calories: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                })
                              }
                              className={`${inputClass} mt-1`}
                            />
                          </div>
                        </div>
                        <RemoveButton onClick={() => removeMeal(meal._key)} />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Description (optional)
                        </label>
                        <textarea
                          value={meal.description ?? ""}
                          onChange={(e) =>
                            updateMeal(meal._key, {
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className={`${inputClass} mt-1`}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Workouts */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {isEditing ? (
                <SectionHeader
                  title="Workouts"
                  onAdd={addWorkout}
                  addLabel="Add workout"
                />
              ) : (
                <h2 className="text-sm font-bold text-slate-900">Workouts</h2>
              )}

              {!isEditing &&
                (day.workouts.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No workouts for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.workouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-800">
                            {workout.title}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {workout.duration} min
                          </span>
                        </div>
                        {workout.instructions && (
                          <p className="mt-1 text-xs text-slate-500">
                            {workout.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

              {isEditing && (
                <>
                  {workouts.length === 0 && (
                    <p className="text-xs text-slate-400">
                      No workouts added yet.
                    </p>
                  )}
                  {workouts.map((workout) => (
                    <div
                      key={workout._key}
                      className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                          <div className="col-span-2">
                            <label className={labelClass}>Title</label>
                            <input
                              type="text"
                              value={workout.title}
                              onChange={(e) =>
                                updateWorkout(workout._key, {
                                  title: e.target.value,
                                })
                              }
                              className={`${inputClass} mt-1`}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Duration (min)</label>
                            <input
                              type="number"
                              min={0}
                              value={workout.duration}
                              onChange={(e) =>
                                updateWorkout(workout._key, {
                                  duration: Number(e.target.value),
                                })
                              }
                              className={`${inputClass} mt-1`}
                            />
                          </div>
                        </div>
                        <RemoveButton
                          onClick={() => removeWorkout(workout._key)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Instructions (optional)
                        </label>
                        <textarea
                          value={workout.instructions ?? ""}
                          onChange={(e) =>
                            updateWorkout(workout._key, {
                              instructions: e.target.value,
                            })
                          }
                          rows={2}
                          className={`${inputClass} mt-1`}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Habits */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {isEditing ? (
                <SectionHeader
                  title="Habits"
                  onAdd={addHabit}
                  addLabel="Add habit"
                />
              ) : (
                <h2 className="text-sm font-bold text-slate-900">Habits</h2>
              )}

              {!isEditing &&
                (day.habits.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No habits for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.habits.map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                      >
                        <span className="text-sm font-bold text-slate-800">
                          {habit.title}
                        </span>
                        {habit.targetValue != null && (
                          <span className="text-xs font-semibold text-slate-500">
                            {habit.targetValue} {habit.unit ?? ""}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

              {isEditing && (
                <>
                  {habits.length === 0 && (
                    <p className="text-xs text-slate-400">
                      No habits added yet.
                    </p>
                  )}
                  {habits.map((habit) => (
                    <div
                      key={habit._key}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                    >
                      <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="col-span-2 sm:col-span-2">
                          <label className={labelClass}>Title</label>
                          <input
                            type="text"
                            value={habit.title}
                            onChange={(e) =>
                              updateHabit(habit._key, {
                                title: e.target.value,
                              })
                            }
                            className={`${inputClass} mt-1`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Target (optional)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={habit.targetValue ?? ""}
                            onChange={(e) =>
                              updateHabit(habit._key, {
                                targetValue: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className={`${inputClass} mt-1`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Unit (optional)</label>
                          <input
                            type="text"
                            value={habit.unit ?? ""}
                            onChange={(e) =>
                              updateHabit(habit._key, {
                                unit: e.target.value,
                              })
                            }
                            className={`${inputClass} mt-1`}
                          />
                        </div>
                      </div>
                      <RemoveButton onClick={() => removeHabit(habit._key)} />
                    </div>
                  ))}
                </>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
