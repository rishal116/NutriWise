"use client";

import { useEffect, useState, useRef } from "react";
import { groupService } from "@/services/nutritionist/nutriCommunity.service";
import { useRouter } from "next/navigation";
import { Users, Plus, Lock, Globe, ArrowRight, LayoutGrid } from "lucide-react";

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
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 6;
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Initial + pagination fetch
  useEffect(() => {
    fetchGroups(page);
  }, [page]);

  // 🔥 Intersection observer (fixed)
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  const fetchGroups = async (pageNumber = 0) => {
    try {
      if (pageNumber === 0) setLoading(true);
      else setLoadingMore(true);

      const data = await groupService.getMyGroups({
        limit: LIMIT,
        skip: pageNumber * LIMIT,
      });

      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setGroups((prev) =>
        pageNumber === 0 ? data : [...prev, ...data]
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
            <LayoutGrid size={14} />
            Community Hub
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Groups
          </h1>
          <p className="text-slate-600 font-medium">
            Manage your nutrition tribes and engage with your clients.
          </p>
        </div>

        <button
          onClick={() => router.push("/nutritionist/groups/create")}
          className="flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-emerald-200/50"
        >
          <Plus size={20} />
          Create New Group
        </button>
      </header>

      {/* Loading & Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <Users size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No groups yet</h3>
          <p className="text-slate-500">Get started by creating your first community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div
              key={g.id}
              className="group bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Users size={20} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                  {g.visibility === "public" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Globe size={10} /> Public
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock size={10} /> Private
                    </span>
                  )}
                </div>
              </div>

              <h2 className="font-bold text-lg text-slate-900 mb-1">{g.title}</h2>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 h-10">
                {g.description || "No description provided."}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400">
                  {g.memberCount} MEMBERS
                </span>

                <button
                  onClick={() => router.push(`/nutritionist/groups/${g.id}`)}
                  className="p-2 text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-700 hover:text-white transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Loader */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-6">
          {loadingMore && <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin" />}
        </div>
      )}
    </div>
  );
};

export default GroupsPage;