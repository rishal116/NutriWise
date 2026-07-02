"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Utensils,
  Dumbbell,
  Sparkles,
  Calendar,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { taskService } from "@/services/user/task.service";

/* ── TYPES ── */
interface MealDTO {
  _id: string;
  mealType: string;
  title: string;
  description?: string;
  calories?: number;
  order?: number;
  completed: boolean;
}

interface WorkoutDTO {
  _id: string;
  title: string;
  instructions?: string;
  order?: number;
  completed: boolean;
}

interface HabitDTO {
  _id: string;
  title: string;
  targetValue?: number;
  unit?: string;
  order?: number;
  value: number;
}

interface TaskLogDTO {
  id: string;
  userProgramId: string;
  programDayId: string;
  date: string;
  meals: MealDTO[];
  workouts: WorkoutDTO[];
  habits: HabitDTO[];
}

/* ── REUSABLE SECTION WRAPPER ── */
function Section({
  icon,
  label,
  iconBg,
  iconColor,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className={`${iconBg} p-1.5 rounded-lg flex-shrink-0`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <h2 className="text-sm font-extrabold text-gray-900">{label}</h2>
      </div>
      <div className="p-5 space-y-2.5">{children}</div>
    </div>
  );
}

/* ── EMPTY SLOT ── */
function EmptySlot({ message }: { message: string }) {
  return (
    <p className="text-xs text-gray-400 font-medium italic py-2">{message}</p>
  );
}

/* ── PAGE ── */
export default function DayDetailsPage() {
  const { programId, dayNumber } = useParams();
  const router = useRouter();
  const programIdStr = Array.isArray(programId) ? programId[0] : programId;

  const [taskLog, setTaskLog] = useState<TaskLogDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDayTasks() {
      setLoading(true);
      setError(null);
      try {
        const log = await taskService.getTodayLog(
          programIdStr!,
          Number(dayNumber),
        );
        console.log(log);

        setTaskLog(log);
      } catch (err: any) {
        console.error("Failed to fetch task log:", err);
        setError(err.message || "Something went wrong");
        setTaskLog(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDayTasks();
  }, [programIdStr, dayNumber]);

  const handleComplete = async (
    type: "meals" | "workouts" | "habits",
    value: string,
    title?: string,
  ) => {
    try {
      const updated = await taskService.updateTodayTasks({
        programId: String(programIdStr), // 🔥 REQUIRED
        dayNumber: Number(dayNumber), // 🔥 OPTIONAL but recommended
        type,
        value,
        title,
      });

      setTaskLog(updated);
    } catch (err: any) {
      console.error("Failed to update task:", err);
    }
  };
  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin mx-auto" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Loading your journey…
          </p>
        </div>
      </div>
    );
  }

  /* ── ERROR ── */
  if (error) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center max-w-sm w-full space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto">
            <AlertCircle className="text-red-400" size={22} />
          </div>
          <p className="text-red-600 font-semibold text-sm">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-xs text-emerald-600 hover:underline font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!taskLog) {
    return (
      <div className="flex items-center justify-center py-24 px-4">
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm font-medium">
            No tasks found for this day.
          </p>
          <button
            onClick={() => router.back()}
            className="text-xs text-emerald-600 hover:underline font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  /* ── STATS ── */
  const totalTasks =
    taskLog.meals.length + taskLog.workouts.length + taskLog.habits.length;
  const completedTasks =
    taskLog.meals.filter((m) => m.completed).length +
    taskLog.workouts.filter((w) => w.completed).length +
    taskLog.habits.filter((h) => h.value > 0).length;
  const completionPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="font-sans pb-12 space-y-6">
      {/* ── BACK + TITLE ── */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-3 group font-medium"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
          />
          Back
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Calendar size={14} className="flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Programme Schedule
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-tight">
              Day {dayNumber}
            </h1>
          </div>

          {/* Completion pill */}
          <div className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3 text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-0.5">
              Today
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {completionPct}%
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              {completedTasks}/{totalTasks} done
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* ── MEALS ── */}
      <Section
        icon={<Utensils size={13} />}
        label="Nutrition Plan"
        iconBg="bg-orange-100"
        iconColor="text-orange-500"
      >
        {taskLog.meals.length ? (
          taskLog.meals.map((meal) => (
            <div
              key={meal._id}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                meal.completed
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-gray-50 border-gray-100 hover:border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    meal.completed ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">
                    {meal.mealType}
                  </p>
                  <p
                    className={`text-sm font-semibold truncate ${
                      meal.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {meal.title}
                  </p>
                  {meal.calories && (
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {meal.calories} kcal
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleComplete("meals", meal._id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  meal.completed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                }`}
              >
                <CheckCircle2 size={12} className="flex-shrink-0" />
                {meal.completed ? "Done" : "Complete"}
              </button>
            </div>
          ))
        ) : (
          <EmptySlot message="Rest day for nutrition." />
        )}
      </Section>

      {/* ── WORKOUTS ── */}
      <Section
        icon={<Dumbbell size={13} />}
        label="Training"
        iconBg="bg-blue-100"
        iconColor="text-blue-500"
      >
        {taskLog.workouts.length ? (
          taskLog.workouts.map((workout) => (
            <div
              key={workout._id}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                workout.completed
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-gray-50 border-gray-100 hover:border-emerald-200"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    workout.completed ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      workout.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {workout.title}
                  </p>
                  {workout.instructions && (
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                      {workout.instructions}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleComplete("workouts", workout._id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  workout.completed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                }`}
              >
                <CheckCircle2 size={12} className="flex-shrink-0" />
                {workout.completed ? "Logged" : "Log"}
              </button>
            </div>
          ))
        ) : (
          <EmptySlot message="No scheduled workouts. Active recovery encouraged!" />
        )}
      </Section>

      {/* ── HABITS ── */}
      <Section
        icon={<Sparkles size={13} />}
        label="Daily Habits"
        iconBg="bg-purple-100"
        iconColor="text-purple-500"
      >
        {taskLog.habits.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {taskLog.habits.map((habit) => {
              const done = habit.value > 0;
              return (
                <div
                  key={habit._id}
                  className={`flex flex-col justify-between p-4 rounded-xl border-l-2 border border-gray-100 transition-all duration-200 ${
                    done
                      ? "bg-emerald-50 border-l-emerald-500"
                      : "bg-gray-50 border-l-gray-300 hover:border-l-emerald-300"
                  }`}
                >
                  <div className="mb-3 min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${
                        done ? "text-gray-400 line-through" : "text-gray-800"
                      }`}
                    >
                      {habit.title}
                    </p>
                    {habit.targetValue && (
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        Goal: {habit.targetValue} {habit.unit}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleComplete("habits", habit._id, habit.title)
                    }
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black transition-all duration-200 ${
                      done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                  >
                    <CheckCircle2 size={12} className="flex-shrink-0" />
                    {done ? "Completed" : "Mark Done"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptySlot message="No specific habits set for today." />
        )}
      </Section>
    </div>
  );
}
