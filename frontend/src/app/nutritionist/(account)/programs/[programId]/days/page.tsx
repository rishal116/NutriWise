"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { nutriProgramService } from "@/services/nutritionist/nutriProgram.service";
import ProgramDayCard from "@/components/nutritionist/program/ProgramDayCard";
import Link from "next/link";
import { ArrowLeft, Plus, CalendarDays, LayoutGrid, ListFilter, Sparkles } from "lucide-react";

export default function ProgramDaysPage() {
  const params = useParams();
  const programId = params.programId as string;
  
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (programId) fetchDays();
  }, [programId]);

  const fetchDays = async () => {
    try {
      setLoading(true);
      const res = await nutriProgramService.getProgramDays(programId);
      const data = res.data || res;
      setDays(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch days:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-5">
          <Link 
            href={`/nutritionist/programs/${programId}`}
            className="mt-1 p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curated Journey</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Timeline <span className="text-emerald-600">Builder</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all shadow-sm">
            <ListFilter size={20} />
          </button>
          <Link
            href={`/nutritionist/programs/${programId}/days/create`}
            className="flex items-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95 group"
          >
            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Protocol Day</span>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Sequencing Days...</p>
          </div>
        ) : days.length === 0 ? (
          <EmptyState programId={programId} />
        ) : (
          <div className="grid gap-6 relative">
            {/* The Timeline Connector Line (Desktop Only) */}
            <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-100 via-slate-100 to-transparent hidden md:block" />
            
            {days.map((day, index) => (
              <ProgramDayCard key={day.id || index} day={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ programId }: { programId: string }) {
  return (
    <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
      <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mx-auto mb-6 text-slate-300">
        <CalendarDays size={40} />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2">The timeline is empty</h3>
      <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto text-sm leading-relaxed">
        Your client is waiting for their first nutritional milestone. Let's build Day 1.
      </p>
      <Link
        href={`/nutritionist/programs/${programId}/days/create`}
        className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200"
      >
        <Plus size={16} strokeWidth={3} />
        Start Building
      </Link>
    </div>
  );
}