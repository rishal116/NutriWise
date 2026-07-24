"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { nutriProgramDayService } from "@/services/nutritionist/nutriProgramDay.service";
import type {
  CreateProgramDayDTO,
  HabitDTO,
  MealDTO,
  WorkoutDTO,
} from "@/dtos/nutritionist/program/program-day-request.dto";

// The DTOs have no client-side id to key React lists on, so each draft row
// carries a local `_key` that is stripped before the payload is sent.
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

function emptyMeal(key: string): DraftMeal {
  return { _key: key, mealType: "breakfast", title: "", order: 0 };
}

function emptyWorkout(key: string): DraftWorkout {
  return { _key: key, title: "", duration: 30, order: 0 };
}

function emptyHabit(key: string): DraftHabit {
  return { _key: key, title: "", order: 0 };
}

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

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10";
const labelClass = "text-xs font-semibold text-slate-500";

export default function CreateProgramDayPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();
  const nextKey = useLocalKey();

  const [dayNumber, setDayNumber] = useState(1);
  const [meals, setMeals] = useState<DraftMeal[]>([]);
  const [workouts, setWorkouts] = useState<DraftWorkout[]>([]);
  const [habits, setHabits] = useState<DraftHabit[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addMeal = () => setMeals((prev) => [...prev, emptyMeal(nextKey())]);
  const addWorkout = () =>
    setWorkouts((prev) => [...prev, emptyWorkout(nextKey())]);
  const addHabit = () => setHabits((prev) => [...prev, emptyHabit(nextKey())]);

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

  const handleSubmit = async () => {
    if (dayNumber < 1) {
      toast.error("Day number must be at least 1.");
      return;
    }
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

    // `order` reflects final position in each list (1-based) — this is an
    // assumption pending confirmation of what the backend expects it to mean.
    const payload: CreateProgramDayDTO = {
      dayNumber,
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

    setSubmitting(true);
    try {
      await nutriProgramDayService.createProgramDay(programId, payload);
      toast.success(`Day ${dayNumber} created.`);
      router.push(`/nutritionist/programs/${programId}/days`);
    } catch {
      toast.error("Couldn't create this day. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() =>
            router.push(`/nutritionist/program/${programId}/days`)
          }
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to days
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Add a program day
          </h1>
          <p className="text-sm text-slate-500">
            Set up the meals, workouts, and habits for this day.
          </p>
        </div>

        {/* Day number */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className={labelClass}>Day number</label>
          <input
            type="number"
            min={1}
            value={dayNumber}
            onChange={(e) => setDayNumber(Number(e.target.value))}
            className={`${inputClass} mt-1.5 sm:w-40`}
          />
        </div>

        {/* Meals */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader title="Meals" onAdd={addMeal} addLabel="Add meal" />
          {meals.length === 0 && (
            <p className="text-xs text-slate-400">No meals added yet.</p>
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
                          mealType: e.target.value as MealDTO["mealType"],
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
                        updateMeal(meal._key, { title: e.target.value })
                      }
                      placeholder="Grilled chicken salad"
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
                <label className={labelClass}>Description (optional)</label>
                <textarea
                  value={meal.description ?? ""}
                  onChange={(e) =>
                    updateMeal(meal._key, { description: e.target.value })
                  }
                  rows={2}
                  className={`${inputClass} mt-1`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Workouts */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Workouts"
            onAdd={addWorkout}
            addLabel="Add workout"
          />
          {workouts.length === 0 && (
            <p className="text-xs text-slate-400">No workouts added yet.</p>
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
                        updateWorkout(workout._key, { title: e.target.value })
                      }
                      placeholder="Full body strength"
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
                <RemoveButton onClick={() => removeWorkout(workout._key)} />
              </div>
              <div>
                <label className={labelClass}>Instructions (optional)</label>
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
        </div>

        {/* Habits */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Habits"
            onAdd={addHabit}
            addLabel="Add habit"
          />
          {habits.length === 0 && (
            <p className="text-xs text-slate-400">No habits added yet.</p>
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
                      updateHabit(habit._key, { title: e.target.value })
                    }
                    placeholder="Drink water"
                    className={`${inputClass} mt-1`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Target (optional)</label>
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
                      updateHabit(habit._key, { unit: e.target.value })
                    }
                    placeholder="litres"
                    className={`${inputClass} mt-1`}
                  />
                </div>
              </div>
              <RemoveButton onClick={() => removeHabit(habit._key)} />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(`/nutritionist/program/${programId}/days`)
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create day"}
          </button>
        </div>
      </div>
    </div>
  );
}