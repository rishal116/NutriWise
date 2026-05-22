"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { userGroupService } from "@/services/user/userGroup.service";
import { Globe, Lock, Users, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Group {
  id: string;
  title: string;
  description?: string;
  memberCount: number;
  isJoined: boolean;
  visibility: "public" | "private";
  joinStatus?: "none" | "requested" | "joined";
  createdAt: string;
}

const LIMIT = 12;

export default function GroupsPage({ preview = false }: { preview?: boolean }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const skipRef = useRef(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchGroups = async (reset = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const currentSkip = reset ? 0 : skipRef.current;
      const res = await userGroupService.getGroups({ limit: LIMIT, skip: currentSkip });

      const newGroups: Group[] = (res.groups || []).map((g: any) => ({
        ...g,
        joinStatus: g.joinStatus ?? "none",
      }));

      setGroups((prev) => (reset ? newGroups : [...prev, ...newGroups]));
      skipRef.current = reset ? LIMIT : skipRef.current + LIMIT;
      setHasMore(newGroups.length === LIMIT);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGroups(true);
  }, []);

  const handleJoin = async (group: Group) => {
    setProcessingId(group.id);
    try {
      const res = await userGroupService.joinGroup(group.id);
      setGroups((prev) =>
        prev.map((g) =>
          g.id !== group.id
            ? g
            : {
                ...g,
                joinStatus: res.status,
                isJoined: res.status === "joined",
                memberCount:
                  res.status === "joined" && g.joinStatus !== "joined"
                    ? g.memberCount + 1
                    : g.memberCount,
              }
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchGroups(false);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (preview || !loaderRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, preview]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-lg font-medium">Discovering communities...</p>
      </div>
    );
  }

  const items = preview ? groups.slice(0, 3) : groups;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      {!preview && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommended Groups</h2>
            <p className="text-gray-500 mt-1">Find communities that match your health goals and lifestyle.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4" />
            {groups.length} Groups Available
          </div>
        </div>
      )}

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {items.map((g) => (
            <motion.div
              key={g.id}
              variants={item}
              layout
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-emerald-100 transition-colors" />

              <div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  {g.isJoined && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse" />
                      Member
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                  {g.title}
                </h3>

                <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                  {g.description || "Join this community to start your journey towards a healthier lifestyle with expert guidance."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between relative z-10">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    {g.visibility === "private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {g.visibility === "private" ? "Private" : "Public"}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    <Users className="w-3 h-3" />
                    {g.memberCount}
                  </div>
                </div>

                <button
                  disabled={processingId === g.id || g.joinStatus === "requested"}
                  onClick={() => handleJoin(g)}
                  className={`group/btn flex items-center gap-2 text-sm px-5 py-2 rounded-xl font-bold transition-all duration-300
                    ${
                      g.joinStatus === "joined"
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                    }
                    ${g.joinStatus === "requested" ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                  `}
                >
                  {processingId === g.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : g.joinStatus === "joined" ? (
                    "Joined"
                  ) : g.joinStatus === "requested" ? (
                    "Requested"
                  ) : (
                    <>
                      Join <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite scroll */}
      {!preview && hasMore && (
        <div ref={loaderRef} className="py-12 flex justify-center">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-300" />
            Loading more communities...
          </div>
        </div>
      )}

      {groups.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-emerald-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Groups Found</h3>
          <p className="text-gray-500 mt-2">Check back later for new communities.</p>
        </div>
      )}
    </div>
  );
}