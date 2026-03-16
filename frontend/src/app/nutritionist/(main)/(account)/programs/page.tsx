"use client";

import { useEffect, useState } from "react";
import ProgramCard from "@/components/nutritionist/program/ProgramCard";
import { nutriProgramService } from "@/services/nutritionist/nutriProgram.service";
import { ProgramResponseDTO } from "@/types/program";
import { Search, Users, Sparkles, LayoutGrid } from "lucide-react";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const data = await nutriProgramService.getPrograms();
      console.log(data);
      
      setPrograms(data.data);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.planSnapshot?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active Enrollments</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Client <span className="text-emerald-600">Programs</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Monitor real-time progress of your active clients.</p>
        </div>

        {/* SEARCH BAR - Glass Effect */}
        <div className="relative group sm:w-80 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or plan..." 
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* STATS STRIP (Optional) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 flex flex-col">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Active</span>
          <span className="text-xl font-black text-slate-900">{programs.length}</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Sync</span>
          <span className="text-xl font-black text-slate-900">0</span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="pt-2">
        {filteredPrograms.length === 0 ? (
          <EmptyState isSearch={searchQuery.length > 0} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ SUB-COMPONENTS ============================ */

function LoadingSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-slate-100 rounded" />
          <div className="h-8 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-12 w-80 bg-slate-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-slate-50 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ isSearch }: { isSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
      <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-6">
        <LayoutGrid size={40} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-black text-slate-800">
        {isSearch ? "No matches found" : "No active programs"}
      </h3>
      <p className="text-slate-500 font-medium mt-2 max-w-xs text-center">
        {isSearch 
          ? "We couldn't find any clients matching your search criteria." 
          : "When clients purchase your plans, their progress tracking will appear here."}
      </p>
    </div>
  );
}