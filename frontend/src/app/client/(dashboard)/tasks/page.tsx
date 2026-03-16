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
  CalendarDays,
  Plus,
  User
} from "lucide-react";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [programDay, setProgramDay] = useState<any>(null);
  const [taskLog, setTaskLog] = useState<any>(null);
  const [program, setProgram] = useState<any>(null); // To store activityLevel and dietType
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
      setProgram(data.program);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (key: 'mealsCompleted' | 'workoutsCompleted', value: string) => {
    if (!taskLog) return;
    const currentList = taskLog[key] || [];
    const isCompleted = currentList.includes(value);
    const updatedList = isCompleted
      ? currentList.filter((item: string) => item !== value)
      : [...currentList, value];

    setTaskLog({ ...taskLog, [key]: updatedList });

    try {
      await taskService.updateTodayTasks({ [key]: updatedList });
    } catch (err) {
      fetchTodayTasks(); // Rollback
    }
  };

  const updateHabit = async (habitId: string, targetValue: number) => {
    if (!taskLog) return;
    const existingHabits = taskLog.habitsProgress || [];
    const habitRecord = existingHabits.find((h: any) => h.habitId === habitId);
    const currentVal = habitRecord ? habitRecord.currentValue : 0;

    if (currentVal >= targetValue) return;

    const updatedHabits = habitRecord
      ? existingHabits.map((h: any) => 
          h.habitId === habitId ? { ...h, currentValue: h.currentValue + 1 } : h
        )
      : [...existingHabits, { habitId, currentValue: 1 }];

    setTaskLog({ ...taskLog, habitsProgress: updatedHabits });

    try {
      await taskService.updateTodayTasks({ habitsProgress: updatedHabits });
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
    <div className="max-w-2xl mx-auto pb-20 px-4 pt-8">
      {/* --- PROFILE MINI-HEADER --- */}
      {program && (
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-2 whitespace-nowrap">
            <User size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter">
              {program.activityLevel} • {program.dietType}
            </span>
          </div>
        </div>
      )}

      {/* --- MAIN HEADER --- */}
      <div className="mb-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <CalendarDays size={16} className="text-emerald-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily Protocol</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-6">
          Phase <span className="text-emerald-600">Day {programDay.dayNumber}</span>
        </h1>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm shadow-emerald-100/20">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion Rate</p>
              <h4 className="text-2xl font-black text-slate-800">{progressPercent}%</h4>
            </div>
            <div className={`p-3 rounded-2xl transition-all ${progressPercent === 100 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-300'}`}>
                <Award size={24} className={progressPercent === 100 ? "animate-bounce" : ""} />
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {/* --- HABITS SECTION --- */}
        {programDay.habits?.length > 0 && (
          <section>
            <SectionHeader icon={<Droplets size={18} />} title="Daily Habits" count={programDay.habits.length} />
            <div className="space-y-3">
              {programDay.habits.map((habit: any) => {
                const progress = taskLog?.habitsProgress?.find((h: any) => h.habitId === habit._id);
                const currentCount = progress ? progress.currentValue : 0;
                const isDone = currentCount >= habit.targetValue;

                return (
                  <div key={habit._id} className={`group p-5 rounded-[1.5rem] border transition-all flex justify-between items-center ${isDone ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl transition-transform group-hover:scale-105 ${isDone ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isDone ? <CheckCircle2 size={20} /> : <Droplets size={20} />}
                      </div>
                      <div>
                        <h4 className={`font-bold ${isDone ? 'text-emerald-900' : 'text-slate-800'}`}>{habit.title}</h4>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                          {currentCount} / {habit.targetValue} {habit.unit}
                        </p>
                      </div>
                    </div>
                    <button 
                      disabled={isDone}
                      onClick={() => updateHabit(habit._id, habit.targetValue)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isDone ? 'bg-slate-50 text-slate-200' : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-90 shadow-sm'}`}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* --- MEALS --- */}
        {programDay.meals?.length > 0 && (
          <section>
            <SectionHeader icon={<Utensils size={18} />} title="Nutrition Log" count={programDay.meals.length} />
            <div className="space-y-3">
              {programDay.meals.map((meal: any) => (
                <TaskItem 
                  key={meal._id}
                  title={meal.title}
                  subtitle={`${meal.calories} kcal • ${meal.mealType}`}
                  description={meal.description}
                  isChecked={taskLog?.mealsCompleted?.includes(meal.mealType)}
                  onToggle={() => toggleTask('mealsCompleted', meal.mealType)}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- WORKOUTS --- */}
        {programDay.workouts?.length > 0 && (
          <section>
            <SectionHeader icon={<Dumbbell size={18} />} title="Training Log" count={programDay.workouts.length} />
            <div className="space-y-3">
              {programDay.workouts.map((workout: any) => (
                <TaskItem 
                  key={workout._id}
                  title={workout.title}
                  subtitle={`${workout.duration} min session`}
                  description={workout.instructions}
                  isChecked={taskLog?.workoutsCompleted?.includes(workout.title)}
                  onToggle={() => toggleTask('workoutsCompleted', workout.title)}
                  isWorkout
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


// --- SUB-COMPONENTS ---

function SectionHeader({ icon, title, count }: any) {
  return (
    <div className="flex items-center justify-between mb-5 px-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">{icon}</div>
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.15em]">{title}</h2>
      </div>
      <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase">{count} assigned</span>
    </div>
  );
}

function TaskItem({ title, subtitle, description, isChecked, onToggle, isWorkout }: any) {
  return (
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-5 rounded-[1.8rem] border transition-all duration-400 text-left
        ${isChecked 
          ? 'bg-emerald-50/40 border-emerald-100 opacity-80' 
          : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-1 transition-all duration-300 ${isChecked ? 'text-emerald-500 scale-110' : 'text-slate-200'}`}>
          {isChecked ? <CheckCircle2 size={26} fill="currentColor" className="text-emerald-500 fill-emerald-50" /> : <Circle size={26} />}
        </div>
        <div>
          <h4 className={`font-bold text-base transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {title}
          </h4>
          <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">{subtitle}</p>
          {description && !isChecked && (
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{description}</p>
          )}
        </div>
      </div>
      {isWorkout && !isChecked && (
        <div className="bg-orange-50 p-2 rounded-full">
            <Zap size={14} className="text-orange-500 animate-pulse" />
        </div>
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