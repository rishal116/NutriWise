"use client";

import { useRouter } from "next/navigation";
import { ProgramResponseDTO } from "@/types/program";
import { Calendar, Target, ChevronRight, Mail, ArrowUpRight } from "lucide-react";

interface Props {
  program: ProgramResponseDTO;
}

export default function ProgramCard({ program }: Props) {
  const router = useRouter();

  const completion = program.completionPercentage <= 1 
    ? Math.round(program.completionPercentage * 100) 
    : Math.round(program.completionPercentage);

  const isActive = program.status === 'ACTIVE';

  return (
    <div
      onClick={() => router.push(`/nutritionist/programs/${program.id}`)}
      className="group relative bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Decorative Blur - Positioned relative to the card container */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/40 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-emerald-100/50 transition-colors" />

      {/* 1. HEADER SECTION: Perfect horizontal alignment */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-emerald-100 ring-4 ring-white">
              {program.user.fullName.charAt(0)}
            </div>
            {isActive && (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm animate-pulse" />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-black text-slate-800 text-[17px] leading-tight group-hover:text-emerald-700 transition-colors">
              {program.user.fullName}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
              <Mail size={12} strokeWidth={2.5} className="shrink-0" />
              <p className="text-[11px] font-bold tracking-tight lowercase truncate max-w-[110px]">
                {program.user.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
          isActive 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {program.status}
        </div>
      </div>

      {/* 2. BODY SECTION: Spacing hierarchy */}
      <div className="flex-1 flex flex-col gap-5 mb-8">
        {/* Goal Block */}
        <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100/50 p-4 rounded-[1.5rem] group-hover:bg-white group-hover:border-emerald-100 transition-all">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
                <Target size={12} className="text-emerald-600" strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Goal</span>
          </div>
          <p className="text-[13px] font-black text-slate-800 capitalize leading-none ml-7">
            {program.goal.replace(/_/g, ' ')}
          </p>
        </div>
        
        {/* Timeline Row */}
        <div className="flex items-center gap-3.5 px-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50/50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/50">
            <Calendar size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Program Timeline</span>
            <p className="text-[11px] font-bold text-slate-600 leading-none">
              {new Date(program.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(program.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* 3. FOOTER SECTION: Visual Weight */}
      <div className="pt-6 border-t border-slate-100/60 mt-auto">
        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Progress</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-emerald-600 tabular-nums leading-none">{completion}</span>
              <span className="text-[10px] font-black text-emerald-600/60 leading-none">%</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 group/text overflow-hidden">
            <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              View Analytics
            </span>
            <ArrowUpRight size={14} strokeWidth={3} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="p-3 bg-slate-900 text-white rounded-[1.2rem] shadow-lg shadow-slate-200 group-hover:bg-emerald-600 group-hover:shadow-emerald-200 transition-all">
            <ChevronRight size={18} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
}