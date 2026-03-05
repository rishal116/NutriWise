"use client";

import { useState, useEffect } from "react";
import DayForm from "@/components/nutritionist/program/DayForm";
import { programDayService } from "@/services/nutritionist/programDay.service";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { ArrowLeft, Sparkles } from "lucide-react";

export default function ProgramDayPage({ params }: { params: { programId: string } }) {
  const [dayData, setDayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchDay = async () => {
      try {
        const data = await programDayService.getProgramDayById(params.programId);
        setDayData(data);
      } catch (err) {
        console.log("New day creation mode");
      } finally {
        setLoading(false);
      }
    };
    fetchDay();
  }, [params.programId]);

  // Success Handler
  const handleSuccess = () => {
    // You can replace this with a toast notification library like sonner or react-hot-toast
    console.log("Day saved successfully!"); 
    
    // Redirect back to the days list page
    router.push(`/nutritionist/programs/${params.programId}/days`);
    router.refresh(); // Refresh to show new data
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading NutriPlan...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href={`/nutritionist/programs/${params.programId}/days`}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {dayData ? "Edit Schedule" : "Create Daily Plan"}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Define meals and activities for this program day.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-emerald-600 p-4 flex items-center justify-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            NutriWise Protocol
          </div>
          <div className="p-8 lg:p-10">
            <DayForm
              programId={params.programId}
              initialData={dayData}
              onSuccess={handleSuccess} // Passes the redirect logic
            />
          </div>
        </div>
      </div>
    </div>
  );
}