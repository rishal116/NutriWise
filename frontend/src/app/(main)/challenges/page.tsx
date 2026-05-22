"use client";

import { useEffect, useState } from "react";
import { challengeService } from "@/services/user/challenge.service";
import { ChallengeListItem } from "@/types/challenge";
import Image from "next/image";
import Link from "next/link";
import { 
  Trophy, 
  Clock, 
  Flame, 
  Star, 
  ChevronRight, 
  Filter,
  Search,
  LayoutGrid,
  List as ListIcon,
  Activity
} from "lucide-react";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await challengeService.getChallenges();
        if (res.success) {
          setChallenges(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 pt-16 pb-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Push Your <span className="text-teal-400">Limits</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">
              Discover challenges designed to transform your body and mind. 
              Join thousands of users on their journey to excellence.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-white">50+ Challenges</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
                <Activity className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-bold text-white">Daily Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        {/* Toolbar */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search challenges..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="h-8 w-px bg-slate-100 hidden md:block" />
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-teal-600" : "text-slate-400"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-white shadow-sm text-teal-600" : "text-slate-400"}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Challenge Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-100 h-[400px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <Link 
                key={challenge.id} 
                href={`/challenges/${challenge.slug}`}
                className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={challenge.coverImage || "/placeholder.jpg"} 
                    alt={challenge.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                      {challenge.difficulty}
                    </span>
                    {challenge.isPremium && (
                      <span className="px-3 py-1 bg-amber-400 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-wider">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                      {challenge.type}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold">{challenge.averageRating || "5.0"}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-teal-600 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
                    {challenge.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold">{challenge.duration} Days</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Flame className="w-4 h-4" />
                        <span className="text-xs font-bold">{challenge.averageRating|| 300} kcal</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
