"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { userProgramService } from "@/services/user/userProgram.service";
import { 
  ArrowLeft, Calendar, User, Target, 
  ChevronRight, Award, Zap, Info, Clock,
  CalendarCheck
} from "lucide-react";

export default function ClientProgramDetailsPage() {
  const { programId } = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (programId) fetchProgram();
  }, [programId]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const res = await userProgramService.getProgramById(programId as string);
      setProgram(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!program) return <p className="p-10 text-center text-slate-500">Program data not found.</p>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Program Overview</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
            {program.planSnapshot?.title || program.goal.replace('_', ' ')}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT: PRIMARY INFO --- */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Hero Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-emerald-400" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Personalized Goal</span>
              </div>
              <h2 className="text-4xl font-black mb-4 leading-tight">
                Mastering <span className="text-emerald-400">{program.goal.split('_')[0]}</span> Efficiency
              </h2>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold">
                  {program.dietType} Diet
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold capitalize">
                  {program.activityLevel} Activity
                </div>
              </div>
            </div>
            <Zap size={120} className="absolute -right-10 -bottom-10 text-white/5 -rotate-12" />
          </div>

          {/* Action Navigation */}
          <Link
            href={`/client/programs/${programId}/days`}
            className="flex items-center justify-between p-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] transition-all shadow-xl shadow-emerald-100 group"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <CalendarCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Daily Schedule</h3>
                <p className="text-emerald-100/70 text-xs font-bold uppercase tracking-widest">Access Meal & Training Plans</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ChevronRight size={24} />
            </div>
          </Link>

          {/* Focus Areas Section */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Focus Milestones</h4>
            <div className="flex flex-wrap gap-3">
              {program.focusAreas?.map((area: string, i: number) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold text-sm">
                  <Target size={14} className="text-emerald-500" />
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR STATS --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Nutritionist Contact Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <User size={32} />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 tracking-tight">{program.nutritionist?.fullName}</h4>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Your Expert Nutritionist</p>
                </div>
             </div>
             <button onClick={()=> router.push("/client/messages")} className="w-full py-4 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-100">
                Message Expert
             </button>
          </div>

          {/* Timeline Data */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                         <Calendar size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Duration</span>
                   </div>
                   <span className="font-black text-slate-900">{program.durationDays} Days</span>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                         <Clock size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-600">Start Date</span>
                   </div>
                   <span className="font-black text-slate-900">
                     {new Date(program.startDate).toLocaleDateString()}
                   </span>
                </div>
             </div>
          </div>

          {/* Program Info Note */}
          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem]">
             <div className="flex gap-4">
                <Info size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-emerald-800 font-medium">
                  Your program ends on <span className="font-black">{new Date(program.endDate).toLocaleDateString()}</span>. 
                  Ensure you complete your daily habits to maintain your streak.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constructing Plan...</span>
    </div>
  );
}