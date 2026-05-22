"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  LayoutGrid,
  Calendar,
  Target,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { adminTaskService } from "@/services/admin/adminTask.service";
import { ChallengeTaskListDTO } from "@/types/task";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    fitness: "bg-blue-100 text-blue-700 border-blue-200",
    nutrition: "bg-emerald-100 text-emerald-700 border-emerald-200",
    mental: "bg-violet-100 text-violet-700 border-violet-200",
    recovery: "bg-rose-100 text-rose-700 border-rose-200",
    productivity: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const cls = styles[type.toLowerCase()] || "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
      {type}
    </span>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-red-100 text-red-600 border-red-200",
  };
  const cls = styles[level.toLowerCase()] || "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
      {level}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ChallengeTasksPage() {
  const { id: challengeId } = useParams<{ id: string }>();
  const router = useRouter();

  const [tasks, setTasks] = useState<ChallengeTaskListDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await adminTaskService.getTasksByChallenge(challengeId);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (challengeId) fetchTasks();
  }, [challengeId]);

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await adminTaskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete task");
    }
  };

  // Group tasks by day
  const grouped = tasks.reduce((acc: Record<number, ChallengeTaskListDTO[]>, task) => {
    if (!acc[task.dayNumber]) acc[task.dayNumber] = [];
    acc[task.dayNumber].push(task);
    return acc;
  }, {});

  const days = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        <p className="text-slate-400 font-medium text-sm">Loading challenge tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => router.push(`/admin/challenges/${challengeId}`)}
            className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Back to Challenge
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Challenge Tasks
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage daily activities and objectives for this program.
          </p>
        </div>

        <button
          onClick={() => router.push(`/admin/challenges/${challengeId}/tasks/create`)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Create Task
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: tasks.length, icon: <LayoutGrid />, color: "blue" },
          { label: "Days Covered", value: days.length, icon: <Calendar />, color: "teal" },
          { label: "Fitness Tasks", value: tasks.filter(t => t.type === 'fitness').length, icon: <Target />, color: "amber" },
          { label: "Avg Duration", value: tasks.length ? Math.round(tasks.reduce((a, b) => a + (b.estimatedDurationMinutes || 0), 0) / tasks.length) + "m" : "0m", icon: <Clock />, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
            <LayoutGrid size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No tasks yet</h3>
          <p className="text-slate-400 text-sm max-w-xs mt-2">
            Start by creating the first task for Day 1 of this challenge.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black text-slate-900 bg-white px-4 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                  Day {day}
                </h2>
                <div className="h-px bg-slate-100 flex-1" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {grouped[day].length} Tasks
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {grouped[day]
                  .sort((a, b) => a.order - b.order)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 flex gap-5"
                    >
                      {/* Image Preview */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        {task.coverImage ? (
                          <Image
                            src={task.coverImage}
                            alt={task.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <LayoutGrid size={24} />
                          </div>
                        )}
                        <div className="absolute top-1.5 left-1.5">
                           <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                             #{task.order}
                           </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <TypeBadge type={task.type} />
                            <DifficultyBadge level={task.difficulty} />
                          </div>
                          <h3 className="font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                            {task.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                            {task.shortDescription || "No description provided."}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 pt-3 mt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Clock size={12} className="text-slate-300" />
                            {task.estimatedDurationMinutes || 0}m
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Target size={12} className="text-slate-300" />
                            {task.category || 'General'}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => router.push(`/admin/tasks/${task.id}`)}
                          className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/tasks/${task.id}/edit`)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit Task"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}