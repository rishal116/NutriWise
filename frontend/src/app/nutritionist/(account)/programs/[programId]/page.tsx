"use client";

import { useEffect, useState } from "react";
import { nutriProgramService } from "@/services/nutritionist/nutriProgram.service";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, Target, User, 
  ChevronRight, Zap, Activity, ArrowUpRight, 
  ClipboardList, Leaf, Clock, ShieldCheck
} from "lucide-react";

export default function ProgramDetailsPage() {
  const { programId } = useParams();
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    fetchProgram();
  }, [programId]);

  const fetchProgram = async () => {
    try {
      const res = await nutriProgramService.getProgramById(programId as string);
      setProgram(res.data);
    } catch (error) {
      console.error("Error fetching program:", error);
    }
  };

  if (!program) return <LoadingState />;

  const completion = program.completionPercentage <= 1 
    ? Math.round(program.completionPercentage * 100) 
    : program.completionPercentage;
  const safeCompletion = Math.min(100, Math.max(0, Number(completion ?? 0)));

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. TOP NAVIGATION & HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <Link 
            href="/nutritionist/programs"
            className="mt-1 p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              <span>Clients</span>
              <ChevronRight size={10} />
              <span className="text-emerald-600">Deep Dive</span>
            </nav>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {program.planSnapshot?.title || "Wellness Strategy"}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-700 font-black uppercase tracking-wider">Active</span>
              </div>
            </h1>
          </div>
        </div>

        <Link
          href={`/nutritionist/programs/${programId}/days`}
          className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-200/50 active:scale-95 group sm:w-auto w-full"
        >
          <Calendar size={18} strokeWidth={2.5} />
          <span>Timeline Builder</span>
          <ArrowUpRight size={16} strokeWidth={3} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2. CORE ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<User size={20} />} 
          label="Primary Client" 
          value={program.user.fullName} 
          subValue={program.user.email} 
          theme="emerald"
        />
        <StatCard 
          icon={<Target size={20} />} 
          label="Objective" 
          value={program.goal?.replace('_', ' ')} 
          subValue={`${program.activityLevel} Activity`} 
          theme="teal"
          capitalize
        />
        <StatCard 
          icon={<Clock size={20} />} 
          label="Duration" 
          value={`${program.durationDays} Days`} 
          subValue={`Ends ${new Date(program.endDate).toLocaleDateString()}`} 
          theme="orange"
        />

        {/* Progress Card - High Contrast */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Progression</span>
              <Activity size={18} className="text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-black tabular-nums">{safeCompletion}%</span>
                <span className="text-[10px] font-bold text-emerald-400/80 mb-1">Day {program.currentDay}</span>
              </div>
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                  style={{ width: `${safeCompletion}%` }}
                />
              </div>
            </div>
          </div>
          <Activity size={120} className="absolute -right-4 -bottom-4 text-white/[0.03] rotate-12 transition-transform group-hover:scale-110" />
        </div>
      </div>

      {/* 3. INFORMATION ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Strategy */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <ClipboardList size={20} strokeWidth={2.5} />
              </div>
              <h4 className="text-xl font-black text-slate-800 tracking-tight">Strategy & Focus</h4>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {program.focusAreas?.map((area: string, idx: number) => (
                <span key={idx} className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-wider border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
                  {area}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Practitioner Notes</span>
              <div className="p-7 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-slate-600 text-[13px] leading-relaxed italic relative">
                <span className="absolute top-4 left-4 text-4xl text-emerald-100 font-serif leading-none">“</span>
                <p className="relative z-10 pl-4">
                  {program.notes || "Monitor daily adherence to the low-carb protocol. Focus on protein-dense meals during the first 14-day window."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Dietary Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                <Leaf size={20} strokeWidth={2.5} />
              </div>
              <h4 className="text-lg font-black text-slate-800 tracking-tight">Dietary Profile</h4>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-50">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Protocol</p>
                    <span className="font-bold text-slate-800 capitalize leading-none">{program.dietType} Diet</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                <div className="flex gap-3">
                  <Zap size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-orange-800 font-bold leading-relaxed">
                    Meal generations for this client are strictly locked to {program.dietType} recipes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Snapshot Minimal Card */}
          <div className="bg-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-8 -mt-8 blur-2xl" />
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Commercial Snapshot</h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[11px] text-white/40 font-bold uppercase tracking-tighter">Plan Name</span>
                <span className="text-xs font-bold truncate max-w-[140px]">{program.planSnapshot?.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-white/40 font-bold uppercase tracking-tighter">Investment</span>
                <span className="text-sm font-black text-emerald-400 tracking-tight">
                  {program.planSnapshot?.currency} {program.planSnapshot?.price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ HELPERS ============================ */

function StatCard({ icon, label, value, subValue, theme, capitalize = false }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    teal: "bg-teal-50 text-teal-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-emerald-100 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 ${colors[theme]} rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className={`font-bold text-slate-800 truncate leading-tight ${capitalize ? 'capitalize' : ''}`}>
            {value}
          </h3>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 font-bold truncate pl-1">{subValue}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Intelligence...</p>
    </div>
  );
}