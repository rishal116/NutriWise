"use client";

import { useEffect, useState, use } from "react";
import { challengeService } from "@/services/user/challenge.service";
import { IChallengeTask } from "@/types/task";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Info,
  PlayCircle,
  Lock,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ChallengeTasksPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [tasks, setTasks] = useState<IChallengeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch challenge details first
        const challengeRes = await challengeService.getChallengeById(id);
        if (challengeRes.success) {
          setChallenge(challengeRes.data);
        }

        // Fetch tasks for the current day
        const tasksRes = await challengeService.getChallengeTasks(id, activeDay);
        if (tasksRes.success) {
          setTasks(tasksRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, activeDay]);

  const handleDayChange = (day: number) => {
    if (day < 1 || (challenge && day > challenge.duration)) return;
    setActiveDay(day);
  };

  const handleToggleCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const res = await challengeService.toggleTaskCompletion(
        id,
        taskId,
        activeDay,
        !currentStatus
      );
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, isCompleted: !currentStatus } : t
          )
        );
        toast.success(res.message);
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
      toast.error("Failed to update task status");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-sm font-black text-slate-900 truncate max-w-[200px] md:max-w-md">
              {challenge?.title || "Challenge Tasks"}
            </h1>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">
              Day {activeDay} of {challenge?.duration || "..."}
            </p>
          </div>

          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Day Selector Ribbon */}
        <div className="bg-slate-50/50 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
            {challenge && Array.from({ length: challenge.duration }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`min-w-[48px] h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  activeDay === day 
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-110" 
                  : "bg-white text-slate-400 border border-slate-100 hover:border-teal-200 hover:text-teal-500"
                }`}
              >
                <span className="text-[9px] font-black uppercase leading-none mb-0.5">Day</span>
                <span className="text-sm font-black leading-none">{day}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
            <p className="text-sm font-bold text-slate-400">Loading today's tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No tasks for today!</h3>
            <p className="text-sm text-slate-400 font-medium">Enjoy your rest day or check other days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task, index) => (
              <div 
                key={task._id} 
                className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Task Image */}
                  <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-50">
                    {task.coverImage ? (
                      <Image 
                        src={task.coverImage} 
                        alt={task.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="text-slate-200" size={32} />
                      </div>
                    )}
                  </div>

                  {/* Task Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                          {task.type}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">Task {index + 1}</span>
                      </div>
                      {task.isLocked ? (
                        <Lock size={14} className="text-slate-300" />
                      ) : task.isCompleted ? (
                        <CheckCircle2 
                          size={24} 
                          className="text-teal-500 cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => handleToggleCompletion(task._id, true)}
                        />
                      ) : (
                        <Circle 
                          size={24} 
                          className="text-slate-200 group-hover:text-teal-400 transition-colors cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => handleToggleCompletion(task._id, false)}
                        />
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4">
                      {task.shortDescription || task.description}
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} />
                        <span className="text-xs font-bold">{task.estimatedDurationMinutes || "10"}m</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Flame size={14} />
                        <span className="text-xs font-bold capitalize">{task.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Trophy size={14} />
                        <span className="text-xs font-bold">{task.targetValue} {task.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-12 flex items-center justify-between">
          <button 
            disabled={activeDay === 1}
            onClick={() => handleDayChange(activeDay - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-30 disabled:grayscale hover:bg-slate-100 text-slate-600"
          >
            <ChevronLeft size={18} />
            Previous Day
          </button>
          <button 
            disabled={challenge && activeDay === challenge.duration}
            onClick={() => handleDayChange(activeDay + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:border-teal-200 hover:text-teal-600 group disabled:opacity-30"
          >
            Next Day
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
