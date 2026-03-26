"use client";

import { useEffect, useState, useMemo } from "react";
import ProgramCard from "@/components/nutritionist/program/ProgramCard";
import { nutriProgramService } from "@/services/nutritionist/nutriProgram.service";
import { ProgramResponseDTO } from "@/types/program";
import { Search, Sparkles, LayoutGrid, Filter, X, RotateCcw } from "lucide-react";

export const PROGRAM_STATUS = [
  "ACTIVE",
  "UPCOMING",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

type StatusType = (typeof PROGRAM_STATUS)[number];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StatusType>("ACTIVE");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const data = await nutriProgramService.getPrograms();
      setPrograms(data.data || []);
    } catch (error) {
      console.error("Failed to fetch programs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setActiveTab("ACTIVE");
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        p.user.fullName?.toLowerCase().includes(searchLower) ||
        p.planSnapshot?.title?.toLowerCase().includes(searchLower);
      
      const matchesStatus = p.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [programs, searchQuery, activeTab]);

  const getCountByStatus = (status: string) => 
    programs.filter(p => p.status === status).length;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Sparkles size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.15em]">Program Management</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Client <span className="text-emerald-600">Enrollments</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage and track your clients' journey in real-time.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a client or program..." 
            className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-300 outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <Filter size={14} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Filter by status</span>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-[1.5rem] w-fit border border-slate-200/50">
          {PROGRAM_STATUS.map((status) => {
            const isActive = activeTab === status;
            const count = getCountByStatus(status);
            
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`group relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-3 whitespace-nowrap ${
                  isActive 
                    ? "bg-white text-emerald-700 shadow-md shadow-emerald-500/10 ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {status}
                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md text-[10px] transition-colors ${
                    isActive ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                }`}>
                    {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="relative min-h-[500px]">
        {filteredPrograms.length === 0 ? (
          <EmptyState 
            isFiltered={searchQuery.length > 0 || activeTab !== "ACTIVE"} 
            status={activeTab} 
            onReset={handleReset}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
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

function EmptyState({ isFiltered, status, onReset }: { isFiltered: boolean; status: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200/80">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-200 blur-2xl opacity-20 rounded-full" />
        <div className="relative p-8 bg-white rounded-full shadow-2xl shadow-slate-200/50 border border-slate-100">
          <LayoutGrid size={48} className="text-slate-200" />
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">
        No results found
      </h3>
      <p className="text-slate-500 font-medium mt-3 max-w-sm text-center px-6 leading-relaxed">
        {isFiltered 
          ? `We couldn't find any programs matching your current filters in "${status}".` 
          : "Your client programs will appear here once they are generated."}
      </p>

      {isFiltered && (
        <button
          onClick={onReset}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
        >
          <RotateCcw size={16} />
          Clear all filters
        </button>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10 animate-pulse max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-slate-100 rounded-lg" />
          <div className="h-10 w-72 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-14 w-96 bg-slate-100 rounded-2xl" />
      </div>
      <div className="h-16 w-full max-w-3xl bg-slate-50 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem] border border-slate-100" />
        ))}
      </div>
    </div>
  );
}