"use client";

import { useEffect, useState } from "react";
import { taskService } from "@/services/user/task.service";
import { 
  CheckCircle2, 
  Circle, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  Zap, 
  Award,
  CalendarDays
} from "lucide-react";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [programDay, setProgramDay] = useState<any>(null);
  const [taskLog, setTaskLog] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const fetchTodayTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTodayTasks();
      setProgramDay(data.programDay);
      setTaskLog(data.taskLog);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const toggleMeal = async (mealType: string) => {
    if (!taskLog) return;
    const isCompleted = taskLog.mealsCompleted?.includes(mealType);
    const updatedMeals = isCompleted
      ? taskLog.mealsCompleted.filter((m: string) => m !== mealType)
      : [...(taskLog.mealsCompleted || []), mealType];

    setTaskLog({ ...taskLog, mealsCompleted: updatedMeals });

    try {
      await taskService.updateTodayTasks({ mealsCompleted: updatedMeals });
    } catch (err) {
      fetchTodayTasks(); // rollback on failure
    }
  };

  const toggleWorkout = async (title: string) => {
    if (!taskLog) return;
    const isCompleted = taskLog.workoutsCompleted?.includes(title);
    const updatedWorkouts = isCompleted
      ? taskLog.workoutsCompleted.filter((w: string) => w !== title)
      : [...(taskLog.workoutsCompleted || []), title];

    setTaskLog({ ...taskLog, workoutsCompleted: updatedWorkouts });

    try {
      await taskService.updateTodayTasks({ workoutsCompleted: updatedWorkouts });
    } catch (err) {
      fetchTodayTasks();
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
  if (!programDay) return <NoTaskState />;

  const totalTasks = (programDay.meals?.length || 0) + (programDay.workouts?.length || 0);
  const completedTasks = (taskLog?.mealsCompleted?.length || 0) + (taskLog?.workoutsCompleted?.length || 0);
  const progressPercent = Math.round((completedTasks / totalTasks) * 100) || 0;

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      {/* --- HEADER & PROGRESS --- */}
      <div className="mb-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <CalendarDays size={16} className="text-emerald-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Today's Objectives</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">
          Protocol <span className="text-emerald-600">Day {programDay.dayNumber}</span>
        </h1>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Daily Progress</p>
              <h4 className="text-xl font-black text-slate-800">{progressPercent}% <span className="text-sm font-bold text-slate-300">Complete</span></h4>
            </div>
            <Award className={progressPercent === 100 ? "text-emerald-500 animate-bounce" : "text-slate-200"} size={32} />
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/* --- MEALS SECTION --- */}
        <section>
          <SectionHeader icon={<Utensils size={18} />} title="Nutrition Log" count={programDay.meals?.length} />
          <div className="space-y-3">
            {programDay.meals?.map((meal: any) => (
              <TaskItem 
                key={meal._id}
                title={meal.title}
                subtitle={`${meal.calories} kcal • ${meal.mealType}`}
                isChecked={taskLog?.mealsCompleted?.includes(meal.mealType)}
                onToggle={() => toggleMeal(meal.mealType)}
              />
            ))}
          </div>
        </section>

        {/* --- WORKOUTS SECTION --- */}
        <section>
          <SectionHeader icon={<Dumbbell size={18} />} title="Training Log" count={programDay.workouts?.length} />
          <div className="space-y-3">
            {programDay.workouts?.map((workout: any, i: number) => (
              <TaskItem 
                key={i}
                title={workout.title}
                subtitle={`${workout.duration} min session`}
                isChecked={taskLog?.workoutsCompleted?.includes(workout.title)}
                onToggle={() => toggleWorkout(workout.title)}
                isWorkout
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SectionHeader({ icon, title, count }: any) {
  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">{icon}</div>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
      </div>
      <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-md">{count} Tasks</span>
    </div>
  );
}

function TaskItem({ title, subtitle, isChecked, onToggle, isWorkout }: any) {
  return (
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 text-left
        ${isChecked 
          ? 'bg-emerald-50/50 border-emerald-100' 
          : 'bg-white border-slate-100 hover:border-emerald-200'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`transition-colors duration-300 ${isChecked ? 'text-emerald-500' : 'text-slate-300'}`}>
          {isChecked ? <CheckCircle2 size={24} height="fill" /> : <Circle size={24} />}
        </div>
        <div>
          <h4 className={`font-bold transition-all ${isChecked ? 'text-emerald-900 line-through opacity-50' : 'text-slate-800'}`}>
            {title}
          </h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      {isWorkout && !isChecked && (
        <Zap size={14} className="text-orange-400 animate-pulse" />
      )}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Daily Protocol...</p>
    </div>
  );
}

function NoTaskState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Zap size={40} className="text-slate-200" />
      </div>
      <h3 className="text-xl font-black text-slate-800">No Protocol Assigned</h3>
      <p className="text-slate-500 text-sm mt-2 max-w-xs">Your nutritionist hasn't published today's plan yet. Check back shortly!</p>
    </div>
  );
}