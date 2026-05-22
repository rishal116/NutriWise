"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { adminTaskService } from "@/services/admin/adminTask.service";
import { ITask } from "@/types/task";
import {
  Loader2,
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  Target,
  BarChart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Video,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 mb-3`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-black text-slate-800">{value}</p>
    </div>
  );
}

function Badge({ value, type }: { value: string; type: "type" | "difficulty" | "status" }) {
  const styles: any = {
    fitness: "bg-blue-100 text-blue-700 border-blue-200",
    nutrition: "bg-emerald-100 text-emerald-700 border-emerald-200",
    mental: "bg-violet-100 text-violet-700 border-violet-200",
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-red-100 text-red-600 border-red-200",
    draft: "bg-slate-100 text-slate-500 border-slate-200",
    published: "bg-teal-100 text-teal-700 border-teal-200",
  };
  const cls = styles[value?.toLowerCase()] || "bg-slate-50 text-slate-400 border-slate-100";
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cls}`}>
      {type}: {value}
    </span>
  );
}

export default function AdminTaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await adminTaskService.getTaskById(taskId);
        setTask(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    if (taskId) fetchTask();
  }, [taskId]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-teal-500" /></div>;
  if (!task) return <div className="text-center py-20">Task not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/tasks/${taskId}/edit`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <Pencil size={14} />
            Edit Task
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all active:scale-95">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="relative h-64 w-full bg-slate-100">
          {task.coverImage && (
            <Image src={task.coverImage} alt={task.title} fill unoptimized className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge value={task.status} type="status" />
              <Badge value={task.type} type="type" />
              <Badge value={task.difficulty} type="difficulty" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{task.title}</h1>
            <p className="text-white/80 text-sm font-medium mt-2 max-w-2xl">{task.shortDescription}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={<Clock />} label="Estimated Time" value={`${task.estimatedDurationMinutes}m`} color="blue" />
          <StatCard icon={<Target />} label="Objective" value={`${task.targetValue} ${task.unit}`} color="teal" />
          <StatCard icon={<BarChart />} label="Category" value={task.category} color="amber" />
          <StatCard icon={<CheckCircle2 />} label="Day / Order" value={`Day ${task.dayNumber} - #${task.order}`} color="purple" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Instructions */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800">Task Instructions</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Step by step guide</p>
              </div>
            </div>

            <div className="space-y-8">
              {task.instructionSteps.map((step, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.description}</p>
                  
                  {step.media && step.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {step.media.map((m, idx) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                          {m.type === 'image' ? (
                            <Image src={m.url} alt={m.title || ''} fill unoptimized className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900">
                              <Video size={24} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Media & Tips */}
        <div className="space-y-8">
          {/* Main Media */}
          {task.media && task.media.length > 0 && (
            <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Media Resources</h3>
              <div className="grid grid-cols-1 gap-3">
                {task.media.map((m, i) => (
                  <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    {m.type === 'image' ? (
                      <Image src={m.url} alt={m.title || ''} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                        <Video size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white text-xs font-bold">{m.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tips */}
          <section className="bg-amber-50 p-6 rounded-[32px] border border-amber-100/50 space-y-4">
             <div className="flex items-center gap-2 text-amber-700">
               <Lightbulb size={20} />
               <h3 className="font-black text-sm uppercase tracking-widest">AI Tips</h3>
             </div>
             <ul className="space-y-3">
               {task.aiTips.map((tip, i) => (
                 <li key={i} className="flex gap-3 text-sm text-amber-800 font-medium leading-relaxed">
                   <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                   {tip}
                 </li>
               ))}
             </ul>
          </section>

          {/* Safety */}
          <section className="bg-rose-50 p-6 rounded-[32px] border border-rose-100/50 space-y-4">
             <div className="flex items-center gap-2 text-rose-700">
               <AlertTriangle size={20} />
               <h3 className="font-black text-sm uppercase tracking-widest">Safety</h3>
             </div>
             <ul className="space-y-3">
               {task.safetyWarnings.map((warn, i) => (
                 <li key={i} className="flex gap-3 text-sm text-rose-800 font-medium leading-relaxed">
                   <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400" />
                   {warn}
                 </li>
               ))}
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
