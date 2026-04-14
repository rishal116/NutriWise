"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { programDayService } from "@/services/nutritionist/programDay.service";
import { 
  ArrowLeft, Utensils, Dumbbell, Clock, 
  Flame, Droplets, Edit3, ChevronRight,
  Zap, Info, CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function ProgramDayViewPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;
  const dayId = params.dayId as string;

  const [day, setDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dayId) fetchDay();
  }, [dayId]);

  const fetchDay = async () => {
    try {
      setLoading(true);
      const res = await programDayService.getProgramDayById(dayId);
      // Accessing res.data based on your console log structure
      setDay(res.data || res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!day) return <NotFound router={router} />;

  const totalCalories = day.meals?.reduce((acc: number, m: any) => acc + (m.calories || 0), 0) || 0;

  return (
    <div className="min-h-screen pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              <span>Timeline</span>
              <ChevronRight size={10} />
              <span className="text-emerald-600">Day {day.dayNumber}</span>
            </nav>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {day.meals?.[0]?.title ? `Focus: ${day.meals[0].title}` : `Day ${day.dayNumber} Protocol`}
            </h1>
          </div>
        </div>

        <Link
          href={`/nutritionist/programs/${programId}/days/${dayId}/edit`}
          className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95 group"
        >
          <Edit3 size={18} />
          <span>Edit Protocol</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN: CONTENT --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Meals Section */}
          <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                  <Utensils size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Nutritional Intake</h2>
              </div>
              <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">
                {day.meals?.length || 0} Meals Scheduled
              </span>
            </div>

            <div className="space-y-4">
              {day.meals?.map((meal: any, idx: number) => (
                <div key={idx} className="group flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white border border-transparent hover:border-emerald-100 rounded-[2rem] transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 uppercase text-[10px] font-black">
                      {meal.mealType|| 'M'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">{meal.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{meal.description || "No specific prep instructions provided."}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-black text-slate-700">{meal.calories}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Workouts Section */}
          <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Dumbbell size={22} />
              </div>
              <h2 className="text-xl font-black text-slate-800">Training Module</h2>
            </div>

            {day.workouts?.length > 0 ? (
              <div className="space-y-4">
                {day.workouts.map((work: any, idx: number) => (
                  <div key={idx} className="p-6 bg-emerald-950 rounded-[2rem] text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold">{work.title}</h4>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                          <Clock size={12} className="text-emerald-400" />
                          <span className="text-[10px] font-black uppercase">{work.duration} Min</span>
                        </div>
                      </div>
                      <p className="text-emerald-100/70 text-sm leading-relaxed italic">
                        &ldquo;{work.instructions || "Focus on form and consistent tempo throughout the sets."}&rdquo;
                      </p>
                    </div>
                    <Zap size={80} className="absolute -right-4 -bottom-4 text-white/5 -rotate-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                <p className="text-slate-400 text-sm font-medium">No workout scheduled. Active recovery day.</p>
              </div>
            )}
          </section>
        </div>

        {/* --- RIGHT COLUMN: STATS --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Day Summary</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <Flame size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-600">Total Energy</span>
                </div>
                <span className="font-black text-slate-900">{totalCalories} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Droplets size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-600">Hydration</span>
                </div>
                <span className="font-black text-slate-900">
                  {day.habits?.[0]?.targetValue || 0} {day.habits?.[0]?.unit || 'L'}
                </span>
              </div>
            </div>
          </div>

          {/* Habit Checklist */}
          <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Habit Stacking</h4>
            </div>
            <div className="space-y-3">
              {day.habits?.map((habit: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-bold text-slate-700">{habit.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white">
            <div className="flex gap-4">
              <Info size={20} className="text-emerald-400 shrink-0" />
              <p className="text-[11px] leading-relaxed text-slate-400">
                Any edits made here will notify the client immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting Protocol...</span>
    </div>
  );
}

function NotFound({ router }: { router: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
      <div className="bg-slate-50 p-6 rounded-full">
        <Info size={40} className="text-slate-300" />
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-800">Day Not Found</h3>
        <p className="text-slate-500 text-sm">This day hasn't been programmed yet.</p>
      </div>
      <button
        onClick={() => router.back()}
        className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition shadow-lg shadow-emerald-200"
      >
        Return to Timeline
      </button>
    </div>
  );
}