"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { userProgramService } from "@/services/user/userProgram.service";
import { 
  ArrowLeft, Utensils, Dumbbell, Droplets, 
  Flame, Clock, CheckCircle2, ChevronRight, 
  Zap, Info 
} from "lucide-react";

export default function ClientDayViewPage() {
  const { dayId } = useParams();
  const router = useRouter();
  const [day, setDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dayId) fetchDay();
  }, [dayId]);

  const fetchDay = async () => {
    try {
      setLoading(true);
      const res = await userProgramService.getProgramDayById(dayId as string);
      setDay(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPulse />;
  if (!day) return <p className="p-10 text-center">Protocol not found.</p>;

  const totalCalories = day.meals?.reduce((acc: number, m: any) => acc + (m.calories || 0), 0) || 0;

  return (
    <div className="max-w-2xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-right">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Protocol</span>
          <h1 className="text-2xl font-black text-slate-900">Day {day.dayNumber}</h1>
        </div>
      </div>

      {/* Quick Summary Pill */}
      <div className="bg-slate-900 rounded-[2rem] p-6 mb-8 flex justify-around items-center shadow-xl shadow-slate-200">
        <div className="text-center">
          <Flame size={20} className="text-orange-500 mx-auto mb-1" />
          <p className="text-[10px] font-black text-slate-500 uppercase">Energy</p>
          <p className="text-sm font-black text-white">{totalCalories} <span className="text-[8px] opacity-50 uppercase">kcal</span></p>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="text-center">
          <Clock size={20} className="text-emerald-400 mx-auto mb-1" />
          <p className="text-[10px] font-black text-slate-500 uppercase">Training</p>
          <p className="text-sm font-black text-white">{day.workouts?.[0]?.duration || 0} <span className="text-[8px] opacity-50 uppercase">min</span></p>
        </div>
        <div className="w-px h-8 bg-slate-800" />
        <div className="text-center">
          <Droplets size={20} className="text-blue-400 mx-auto mb-1" />
          <p className="text-[10px] font-black text-slate-500 uppercase">Water</p>
          <p className="text-sm font-black text-white">{day.habits?.[0]?.targetValue || 0} <span className="text-[8px] opacity-50 uppercase">{day.habits?.[0]?.unit || 'L'}</span></p>
        </div>
      </div>

      <div className="space-y-8">
        {/* --- NUTRITION SECTION --- */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Utensils size={18} className="text-teal-500" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Daily Nutrition</h2>
          </div>
          <div className="space-y-3">
            {day.meals?.map((meal: any, idx: number) => (
              <div key={idx} className="bg-white border border-slate-100 p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors uppercase">
                    {meal.mealType?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 capitalize leading-none mb-1">{meal.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{meal.description || "Eat as per guidance"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-700">{meal.calories}</span>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Kcal</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- WORKOUT SECTION --- */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell size={18} className="text-emerald-600" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Training Module</h2>
          </div>
          {day.workouts?.length > 0 ? (
            day.workouts.map((work: any, idx: number) => (
              <div key={idx} className="bg-emerald-950 rounded-[2rem] p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{work.title}</h3>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {work.duration} Minutes
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-xs text-emerald-100/80 leading-relaxed italic">
                      "{work.instructions}"
                    </p>
                  </div>
                </div>
                <Zap size={100} className="absolute -right-6 -bottom-6 text-white/5 -rotate-12" />
              </div>
            ))
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center">
              <p className="text-slate-400 text-sm font-bold">Active Recovery Day</p>
            </div>
          )}
        </section>

        {/* --- HABITS SECTION --- */}
        <section className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 size={18} className="text-blue-600" />
            <h2 className="text-sm font-black text-blue-900 tracking-widest uppercase">Target Habits</h2>
          </div>
          <div className="space-y-3">
            {day.habits?.map((habit: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-blue-100 shadow-sm">
                <span className="text-sm font-bold text-slate-700">{habit.title}</span>
                <span className="text-xs font-black text-blue-600">Goal: {habit.targetValue} {habit.unit}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="max-w-2xl mx-auto p-10 space-y-6">
      <div className="h-10 w-32 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="h-32 w-full bg-slate-100 rounded-[2rem] animate-pulse" />
      <div className="h-64 w-full bg-slate-100 rounded-[2rem] animate-pulse" />
    </div>
  );
}