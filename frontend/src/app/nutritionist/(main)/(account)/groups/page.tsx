"use client";

import { useEffect, useState, useRef } from "react";
import { groupService } from "@/services/nutritionist/nutriCommunity.service";
import { useRouter } from "next/navigation";
import { Users, Plus, Lock, Globe, ArrowRight, LayoutGrid } from "lucide-react";

interface Group {
  _id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  participantsCount: number;
  tags?: string[];
  createdAt: string;
}

const GroupsPage = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 6;

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchGroups(page);
  }, [page]);


  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  const fetchGroups = async (pageNumber = 0) => {
    try {
      const res = await groupService.getMyGroups({
        limit: LIMIT,
        skip: pageNumber * LIMIT,
      });

      const data = res?.data || res;

      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setGroups((prev) => (pageNumber === 0 ? data : [...prev, ...data]));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">
            <LayoutGrid size={14} />
            Community Hub
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Your Groups
          </h1>
          <p className="text-slate-500 font-medium">
            Engage with your clients and lead your nutrition tribes.
          </p>
        </div>

        <button
          onClick={() => router.push("/nutritionist/groups/create")}
          className="group flex items-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-7 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-emerald-100 hover:-translate-y-1 active:translate-y-0"
        >
          <Plus
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Create New Group
        </button>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
            Syncing your communities...
          </p>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 py-24 flex flex-col items-center text-center px-6">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300 mb-6">
            <Users size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            No active groups
          </h3>
          <p className="text-slate-500 mt-2 max-w-xs font-medium">
            {
              "You haven't created or joined any groups yet. Start your first community today."
            }
          </p>
          <button
            onClick={() => router.push("/nutritionist/groups/create")}
            className="mt-8 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-100"
          >
            GET STARTED
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((g) => (
            <div
              key={g._id}
              className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle background accent */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors" />

              <div className="relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-emerald-600 transition-colors duration-500">
                    <Users size={24} />
                  </div>

                  <div
                    className={`text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-black uppercase tracking-widest ${
                      g.isPublic
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {g.isPublic ? (
                      <>
                        <Globe size={12} /> Public
                      </>
                    ) : (
                      <>
                        <Lock size={12} /> Private
                      </>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {g.title}
                </h2>

                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-6">
                  {g.description || "No Description"}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {g.tags?.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-tight"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-50 relative">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Community Size
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {g.participantsCount || 0} Members
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/nutritionist/groups/${g._id}`)}
                  className="bg-slate-50 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white p-3 rounded-xl transition-all duration-300"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
