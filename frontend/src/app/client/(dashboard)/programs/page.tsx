"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { userProgramService } from "@/services/user/userProgram.service";
import { 
  Activity, 
  Calendar, 
  ChevronRight, 
  Trophy, 
  Target,
  ArrowRight
} from "lucide-react";

export default function ClientProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await userProgramService.getPrograms();
      setPrograms(res.data || []);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading your journey...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header Area */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Track</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My <span className="text-emerald-600">Programs</span></h1>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
          <Activity size={40} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No active programs</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
            Connect with a nutritionist to start your personalized health journey.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/client/programs/${program.id}`}
              className="group block relative"
            >
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left: Info Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                        {program.status}
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                         Since {new Date(program.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors capitalize">
                        {program.planSnapshot?.title || program.goal.replace('_', ' ')}
                      </h2>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                          <Calendar size={14} />
                          {program.durationDays} Days Plan
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold border-l border-slate-200 pl-4">
                          <Target size={14} className="text-emerald-500" />
                          {program.dietType} diet
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress Section */}
                  <div className="shrink-0 flex items-center gap-8">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Day</p>
                      <div className="flex items-baseline justify-center md:justify-end gap-1">
                        <span className="text-4xl font-black text-slate-900 leading-none">{program.currentDay}</span>
                        <span className="text-sm font-bold text-slate-400">/ {program.durationDays}</span>
                      </div>
                    </div>
                    
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:translate-x-1 transition-all shadow-lg shadow-slate-200 group-hover:shadow-emerald-100">
                      <ArrowRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Bottom: Mini Progress Bar */}
                <div className="mt-8 pt-6 border-t border-slate-50">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion</span>
                      <span className="text-xs font-black text-emerald-600">
                        {Math.round((program.completionPercentage || 0) * 100)}%
                      </span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(program.completionPercentage || 0) * 100}%` }}
                      />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}