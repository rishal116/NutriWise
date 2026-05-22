"use client";

import { useEffect, useState, use } from "react";
import { challengeService } from "@/services/user/challenge.service";
import { Challenge } from "@/types/challenge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Play, 
  Users, 
  Share2,
  Calendar,
  Zap,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ChallengeDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await challengeService.getChallengeBySlug(slug);
        if (res.success) {
          setChallenge(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch challenge:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [slug]);

  const handleJoin = async () => {
    if (!challenge) return;
    try {
      setJoining(true);
      const res = await challengeService.joinChallenge(challenge.id);
      if (res.success) {
        toast.success("Successfully joined the challenge!");
        router.push(`/challenges/${challenge.id}/tasks`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join challenge");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500">
        <h2 className="text-2xl font-black mb-4">Challenge Not Found</h2>
        <button onClick={() => router.back()} className="text-teal-600 font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <Image 
          src={challenge.bannerImage || challenge.coverImage || "/placeholder.jpg"} 
          alt={challenge.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-4 py-1.5 bg-teal-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  {challenge.type}
                </span>
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {challenge.difficulty}
                </span>
                {challenge.isPremium && (
                  <span className="px-4 py-1.5 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                {challenge.title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed mb-8">
                {challenge.shortDescription}
              </p>
              
              <div className="flex flex-wrap items-center gap-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Clock className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Duration</p>
                    <p className="text-sm font-bold">{challenge.duration} Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Enrolled</p>
                    <p className="text-sm font-bold">{challenge.totalEnrollments.toLocaleString()}+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Difficulty</p>
                    <p className="text-sm font-bold capitalize">{challenge.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-teal-500" />
                Challenge Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                {challenge.description || "No detailed description provided."}
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mt-10">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {challenge.benefits?.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Equipment Needed
                  </h3>
                  <ul className="space-y-3">
                    {challenge.equipmentNeeded?.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Media Gallery (Intro Video) */}
            {challenge.introVideo && (
              <section className="bg-slate-900 rounded-[32px] overflow-hidden p-8">
                <h2 className="text-2xl font-black text-white mb-6">Introduction Video</h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50">
                  <video 
                    src={challenge.introVideo} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl p-8">
                <div className="text-center mb-8">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Challenge Access</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {challenge.isPremium ? "Premium" : "Free"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">Daily Tasks</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Flame className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">Calories/Day</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{challenge.estimatedCaloriesBurn || 300}</span>
                  </div>
                </div>

                <button 
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full py-4 bg-teal-500 text-white rounded-2xl text-base font-black shadow-lg shadow-teal-500/30 hover:bg-teal-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {joining ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                  {joining ? "Joining..." : "Start Challenge"}
                </button>
                
                <button className="w-full mt-4 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl text-base font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  <Share2 className="w-5 h-5" />
                  Share Challenge
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="bg-white rounded-[32px] border border-slate-100 p-6">
                <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Relevant Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags?.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-xl text-xs font-bold hover:bg-teal-50 hover:text-teal-600 hover:border-teal-100 transition-colors cursor-pointer">
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
