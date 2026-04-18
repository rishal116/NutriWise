"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { userGroupService } from "@/services/user/userGroup.service";

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

const LIMIT = 10;

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

      const newGroups: Group[] = (res.groups || []).map((g) => ({
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

  useEffect(() => { fetchGroups(true); }, []);

  const handleJoin = async (group: Group) => {
    setProcessingId(group.id);
    const res = await userGroupService.joinGroup(group.id);
    setGroups((prev) =>
      prev.map((g) => (g.id !== group.id ? g : { 
        ...g, 
        joinStatus: res.status, 
        isJoined: res.status === "joined",
        memberCount: res.status === "joined" && g.joinStatus !== "joined" ? g.memberCount + 1 : g.memberCount 
      }))
    );
    setProcessingId(null);
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchGroups(false);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (preview || !loaderRef.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, preview]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading communities...</div>;

  const items = preview ? groups.slice(0, 2) : groups;

  return (
    <section className="bg-white min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Discover Groups</h2>
        <p className="text-gray-600 mt-1">Connect with communities that align with your interests.</p>
      </div>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((g) => (
          <div key={g.id} className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 transition-colors shadow-sm">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{g.title}</h3>
                {g.isJoined && <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Joined</span>}
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{g.description || "No description provided."}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">{g.visibility === "private" ? "🔒 Private" : "🌐 Public"}</span>
                <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">👥 {g.memberCount}</span>
              </div>
              <button
                disabled={processingId === g.id || g.joinStatus === "requested"}
                onClick={() => handleJoin(g)}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition ${
                  g.joinStatus === "joined" ? "text-emerald-700 bg-emerald-50" : "text-white bg-emerald-700 hover:bg-emerald-800"
                } ${g.joinStatus === "requested" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {g.joinStatus === "joined" ? "Leave" : g.joinStatus === "requested" ? "Requested" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!preview && hasMore && <div ref={loaderRef} className="py-10 text-center text-gray-400 text-sm">Loading more...</div>}
    </section>
  );
}