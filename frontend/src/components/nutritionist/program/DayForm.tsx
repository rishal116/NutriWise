"use client";

import { useState } from "react";
import { programDayService } from "@/services/nutritionist/programDay.service";
import { 
  Plus, Trash2, Utensils, Dumbbell, Save, 
  Info, Zap, Clock, CheckCircle2, Droplets 
} from "lucide-react";

export default function DayForm({ programId, initialData, onSuccess }: any) {
  const [dayNumber, setDayNumber] = useState(initialData?.dayNumber || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. States mapped to Backend Schema
  const [meals, setMeals] = useState<any[]>(initialData?.meals || [
    { mealType: "breakfast", title: "", calories: 0, description: "" }
  ]);
  const [workouts, setWorkouts] = useState<any[]>(initialData?.workouts || []);
  const [habits, setHabits] = useState<any[]>(initialData?.habits || [
    { title: "Water Intake", targetValue: 3, unit: "Liters" }
  ]);

  // --- Helpers for Meals ---
  const addMeal = () => setMeals([...meals, { mealType: "snack", title: "", calories: 0, description: "" }]);
  const removeMeal = (i: number) => setMeals(meals.filter((_, idx) => idx !== i));
  const updateMeal = (i: number, field: string, value: any) => {
    const newMeals = [...meals];
    newMeals[i][field] = value;
    setMeals(newMeals);
  };

  // --- Helpers for Workouts ---
  const addWorkout = () => setWorkouts([...workouts, { title: "", duration: 30, instructions: "" }]);
  const removeWorkout = (i: number) => setWorkouts(workouts.filter((_, idx) => idx !== i));
  const updateWorkout = (i: number, field: string, value: any) => {
    const newWorkouts = [...workouts];
    newWorkouts[i][field] = value;
    setWorkouts(newWorkouts);
  };

  // --- Helpers for Habits (New) ---
  const addHabit = () => setHabits([...habits, { title: "", targetValue: 0, unit: "" }]);
  const removeHabit = (i: number) => setHabits(habits.filter((_, idx) => idx !== i));
  const updateHabit = (i: number, field: string, value: any) => {
    const newHabits = [...habits];
    newHabits[i][field] = value;
    setHabits(newHabits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { 
        userProgramId: programId, 
        dayNumber, 
        meals, 
        workouts,
        habits
      };

      if (initialData?.id || initialData?._id) {
        await programDayService.updateProgramDay(initialData.id || initialData._id, payload);
      } else {
        await programDayService.createProgramDay(programId, payload);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
          <Info size={16} /> {error}
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center gap-6">
        <div className="w-24">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Day #</label>
          <input
            type="number"
            value={dayNumber}
            onChange={(e) => setDayNumber(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-emerald-600 outline-none"
            required
          />
        </div>
      </div>

      {/* 2. Habits Section (New) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-tight">
            <CheckCircle2 size={16} className="text-emerald-500" /> Daily Habits
          </h4>
          <button type="button" onClick={addHabit} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit, i) => (
            <div key={i} className="group bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-2xl relative flex items-center gap-3">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={habit.title}
                  placeholder="Habit (e.g. Steps)"
                  onChange={(e) => updateHabit(i, "title", e.target.value)}
                  className="col-span-1 bg-white border border-slate-200 rounded-xl p-2 text-xs outline-none"
                />
                <input
                  type="number"
                  value={habit.targetValue}
                  placeholder="Goal"
                  onChange={(e) => updateHabit(i, "targetValue", Number(e.target.value))}
                  className="col-span-1 bg-white border border-slate-200 rounded-xl p-2 text-xs outline-none"
                />
                <input
                  type="text"
                  value={habit.unit}
                  placeholder="Unit (e.g. km)"
                  onChange={(e) => updateHabit(i, "unit", e.target.value)}
                  className="col-span-1 bg-white border border-slate-200 rounded-xl p-2 text-xs outline-none"
                />
              </div>
              <button type="button" onClick={() => removeHabit(i)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Meals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-tight">
            <Utensils size={16} className="text-teal-500" /> Nutrition Plan
          </h4>
          <button type="button" onClick={addMeal} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
        
        {meals.map((meal, i) => (
          <div key={i} className="group bg-slate-50/50 border border-slate-100 p-5 rounded-[1.5rem] relative grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <select 
                value={meal.mealType}
                onChange={(e) => updateMeal(i, "mealType", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-[10px] font-black uppercase text-slate-500 outline-none"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div className="md:col-span-6">
              <input
                type="text"
                value={meal.title}
                onChange={(e) => updateMeal(i, "title", e.target.value)}
                placeholder="Meal Name"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
                required
              />
            </div>
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={meal.calories}
                  onChange={(e) => updateMeal(i, "calories", Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 pl-7 text-sm outline-none"
                />
                <Zap size={12} className="absolute left-2 top-3.5 text-orange-400" />
              </div>
              <button type="button" onClick={() => removeMeal(i)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Workouts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-tight">
            <Dumbbell size={16} className="text-emerald-500" /> Active Training
          </h4>
          <button type="button" onClick={addWorkout} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
        
        {workouts.map((workout, i) => (
          <div key={i} className="group bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] relative space-y-3">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={workout.title}
                  onChange={(e) => updateWorkout(i, "title", e.target.value)}
                  placeholder="Workout (e.g. HIIT)"
                  className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
                  required
                />
                <div className="relative">
                  <input
                    type="number"
                    value={workout.duration}
                    onChange={(e) => updateWorkout(i, "duration", Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 pl-7 text-sm outline-none"
                  />
                  <Clock size={12} className="absolute left-2 top-3.5 text-emerald-500" />
                </div>
             </div>
             <textarea
                value={workout.instructions}
                onChange={(e) => updateWorkout(i, "instructions", e.target.value)}
                placeholder="Instructions..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs outline-none min-h-[60px]"
              />
              <button type="button" onClick={() => removeWorkout(i)} className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-sm text-red-400">
                <Trash2 size={14} />
              </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-950 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-slate-300"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={18} /> Update Daily Strategy</>}
      </button>
    </form>
  );
}