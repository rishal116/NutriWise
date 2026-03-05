"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { userProgramService } from "@/services/user/userProgram.service";
import { 
  ArrowLeft, 
  ChevronRight, 
  Utensils, 
  Dumbbell, 
  Droplets,
  CheckCircle2,
  Circle
} from "lucide-react";

export default function ClientProgramDaysPage() {
  const { programId } = useParams();
  const router = useRouter();
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (programId) fetchDays();
  }, [programId]);

  const fetchDays = async () => {
    try {
      setLoading(true);
      const res = await userProgramService.getProgramDays(programId as string);
      // Sorting by dayNumber to ensure the timeline is chronological
      const sortedDays = (res.data || []).sort((a: any, b: any) => a.dayNumber - b.dayNumber);
      setDays(sortedDays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest text-xs">Syncing Timeline...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Program <span className="text-emerald-600">Timeline</span></h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a day to view your protocol</p>
        </div>
      </div>

      {/* Days List */}
      <div className="relative space-y-4">
        {/* The Timeline Vertical Line */}
        <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-slate-100 hidden md:block" />

        {days.map((day) => (
          <Link
            key={day.id}
            href={`/client/programs/${programId}/days/${day.id}`}
            className="group block relative z-10"
          >
            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-6 flex items-center gap-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
              
              {/* Day Badge */}
              <div className="shrink-0">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200">
                  <span className="text-[8px] font-black text-slate-400 group-hover:text-emerald-100 uppercase leading-none mb-1">Day</span>
                  <span className="text-xl font-black text-white leading-none tabular-nums">{day.dayNumber}</span>
                </div>
              </div>

              {/* Content Summary */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors capitalize">
                    {day.workouts?.[0]?.title || "Rest & Recovery"}
                  </h3>
                </div>

                {/* Micro-Stats Grid */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Utensils size={12} className="text-teal-500" />
                    <span className="text-[11px] font-bold text-slate-600">{day.meals?.length || 0} Meals</span>
                  </div>
                  
                  {day.workouts?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Dumbbell size={12} className="text-emerald-600" />
                      <span className="text-[11px] font-bold text-slate-600">{day.workouts[0].duration}m Training</span>
                    </div>
                  )}

                  {day.habits?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Droplets size={12} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-slate-600">Habits Set</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Indicator */}
              <div className="shrink-0 flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">View Details</span>
                   <span className="text-[10px] font-black text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                     Open <ChevronRight size={10} strokeWidth={3} />
                   </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </div>

            </div>
          </Link>
        ))}

        {days.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <Circle className="mx-auto text-slate-200 mb-4" size={40} strokeWidth={1} />
            <p className="text-slate-400 font-bold text-sm">No days programmed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}