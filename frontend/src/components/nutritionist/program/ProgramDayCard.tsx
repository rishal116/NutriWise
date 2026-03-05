"use client";

import Link from "next/link";
import { 
  ChevronRight, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  ArrowRight,
  Flame
} from "lucide-react";
import { useParams } from "next/navigation";

interface Props {
  day: {
    id: string;
    dayNumber: number;
    meals: any[];
    workouts: any[];
    habits: any[];
  };
}

export default function ProgramDayCard({ day }: Props) {
  const params = useParams();
  const programId = params.programId as string;

  // Calculate total calories for the summary pill
  const totalCalories = day.meals?.reduce((acc, meal) => acc + (meal.calories || 0), 0) || 0;

  return (
    <Link 
      href={`/nutritionist/programs/${programId}/days/${day.id}`}
      className="group relative z-10 block"
    >
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 flex flex-col lg:flex-row items-center gap-6">
        
        {/* 1. Day Indicator */}
        <div className="shrink-0">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center group-hover:bg-emerald-600 transition-all duration-500 shadow-lg shadow-slate-200 group-hover:shadow-emerald-200">
            <span className="text-[9px] font-black text-slate-400 group-hover:text-emerald-100 uppercase tracking-widest mb-0.5">Day</span>
            <span className="text-2xl font-black text-white leading-none tabular-nums">
              {day.dayNumber}
            </span>
          </div>
        </div>

        {/* 2. Length Stats Section */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            
            {/* Meals Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white group-hover:border-emerald-100 transition-colors">
              <Utensils size={14} className="text-teal-500" />
              <span className="text-xs font-black text-slate-700">
                {day.meals?.length || 0} <span className="text-[10px] text-slate-400 uppercase ml-0.5">Meals</span>
              </span>
            </div>

            {/* Workouts Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white group-hover:border-emerald-100 transition-colors">
              <Dumbbell size={14} className="text-emerald-600" />
              <span className="text-xs font-black text-slate-700">
                {day.workouts?.length || 0} <span className="text-[10px] text-slate-400 uppercase ml-0.5">Workouts</span>
              </span>
            </div>

            {/* Habits Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white group-hover:border-emerald-100 transition-colors">
              <Droplets size={14} className="text-blue-500" />
              <span className="text-xs font-black text-slate-700">
                {day.habits?.length || 0} <span className="text-[10px] text-slate-400 uppercase ml-0.5">Habits</span>
              </span>
            </div>

            {/* Calories Summary Pill */}
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl ml-auto lg:ml-0">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-black text-orange-700">
                {totalCalories} <span className="text-[9px] opacity-70">KCAL</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Action Indicator */}
        <div className="flex items-center gap-4 shrink-0 border-l border-slate-50 pl-6 hidden lg:flex">
          <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <ChevronRight size={18} strokeWidth={3} />
          </div>
        </div>
      </div>
    </Link>
  );
}