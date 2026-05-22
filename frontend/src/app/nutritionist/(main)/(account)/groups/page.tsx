"use client";

import { useEffect, useState, useRef } from "react";
import { groupService } from "@/services/nutritionist/nutriCommunity.service";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Plus, 
  Lock, 
  Globe, 
  ArrowRight, 
  LayoutGrid, 
  Search,
  MoreVertical,
  Activity
} from "lucide-react";
import { GroupPaginationCursor } from "@/dtos/nutritionist/group.dto";

interface Group {
  id: string;
  title?: string;
  description?: string;
  visibility?: "public" | "private";
  memberCount: number;
  tags?: string[];
  createdAt?: string;
}

const GroupsPage = () => {
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<GroupPaginationCursor | null>(null);

  const LIMIT = 6;
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          fetchGroups(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadingMore, hasMore, cursor]);

  const fetchGroups = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else setLoading(true);

      const response = await groupService.getMyGroups({
        limit: LIMIT,
        cursor: loadMore ? cursor || undefined : undefined,
      });

      const newGroups = response.data;
      setGroups((prev) => (loadMore ? [...prev, ...newGroups] : newGroups));
      setHasMore(response.pagination.hasMore);
      setCursor(response.pagination.nextCursor);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Activity size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Nutritionist Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Your <span className="text-emerald-700">Tribes.</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl font-medium leading-relaxed">
              Manage your communities, monitor engagement, and foster healthy client transformations.
            </p>
          </div>

          <button
            onClick={() => router.push("/nutritionist/groups/create")}
            className="group flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-emerald-200"
          >
            <Plus size={20} strokeWidth={3} />
            Create New Group
          </button>
        </header>

        {/* Search & Filter Bar (UI Mockup) */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter by group name..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm text-slate-600 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading your hub</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-300 shadow-inner">
            <div className="p-6 bg-slate-50 rounded-full mb-6">
              <Users size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Silence in the hub</h3>
            <p className="text-slate-500 mt-2 max-w-xs font-medium">{"You haven't created any groups yet. Start your first tribe today!"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((g) => (
              <div
                key={g.id}
                className="group relative bg-white border border-slate-200 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-2 hover:border-emerald-100"
              >
                {/* Card Top Actions */}
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Users size={24} strokeWidth={2.5} />
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    g.visibility === "public" 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                    : "bg-slate-50 border-slate-100 text-slate-500"
                  }`}>
                    {g.visibility === "public" ? <Globe size={12} /> : <Lock size={12} />}
                    {g.visibility}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <h2 className="text-xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {g.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 h-10 font-medium">
                    {g.description || "Building a healthy culture through shared goals and expert nutrition guidance."}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Engagement</span>
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter italic">{g.memberCount} Clients</span>
                  </div>

                  <button
                    onClick={() => router.push(`/nutritionist/groups/${g.id}`)}
                    className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300"
                  >
                    <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Trigger */}
        {hasMore && (
          <div ref={observerRef} className="flex justify-center py-12">
            {loadingMore && (
              <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm animate-pulse">
                <div className="w-4 h-4 border-2 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fetching more</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;