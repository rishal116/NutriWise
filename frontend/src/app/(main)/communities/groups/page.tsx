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

      const res = await userGroupService.getGroups({
        limit: LIMIT,
        skip: currentSkip,
      });

      const newGroups: Group[] = res.groups || [];

      setGroups((prev) => (reset ? newGroups : [...prev, ...newGroups]));

      if (reset) skipRef.current = LIMIT;
      else skipRef.current += LIMIT;

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
    try {
      setProcessingId(group.id);

      const res = await userGroupService.joinGroup(group.id);

      setGroups((prev) =>
        prev.map((g) => {
          if (g.id !== group.id) return g;

          if (res.status === "joined") {
            return {
              ...g,
              isJoined: true,
              joinStatus: "joined",
              memberCount: g.memberCount + 1,
            };
          }

          if (res.status === "requested") {
            return {
              ...g,
              joinStatus: "requested",
            };
          }

          return g;
        })
      );
    } finally {
      setProcessingId(null);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchGroups(false);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (!loaderRef.current || preview) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadMore, preview]);

  const items = preview ? groups.slice(0, 2) : groups;

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading amazing communities...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Discover Groups</h2>
            <p className="text-gray-500 mt-1">
              Join communities that match your interests
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
              Live
            </span>
            <span>Active communities</span>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((g) => {
          const isPrivate = g.visibility === "private";

          return (
            <div
              key={g.id}
              className="group relative p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-50 to-blue-50 transition" />

              <div className="relative">
                {/* TITLE */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-700 transition">
                      {g.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {g.description || "No description available"}
                    </p>
                  </div>

                  {g.isJoined && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                      Joined
                    </span>
                  )}
                </div>

                {/* BADGES */}
                <div className="mt-3 flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      isPrivate
                        ? "bg-red-50 text-red-600 border-red-200"
                        : "bg-blue-50 text-blue-600 border-blue-200"
                    }`}
                  >
                    {isPrivate ? "Private" : "Public"}
                  </span>

                  <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 border">
                    👥 {g.memberCount}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-5">
                  {g.isJoined ? (
                    <button className="text-sm px-4 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition">
                      Leave
                    </button>
                  ) : isPrivate && g.joinStatus === "requested" ? (
                    <button
                      disabled
                      className="text-sm px-4 py-1 rounded-full border text-yellow-700 bg-yellow-50"
                    >
                      Requested
                    </button>
                  ) : (
                    <button
                      disabled={processingId === g.id}
                      onClick={() => handleJoin(g)}
                      className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 transition disabled:opacity-50 shadow-sm"
                    >
                      {isPrivate ? "Request Join" : "Join"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOADER */}
      {!preview && hasMore && (
        <div ref={loaderRef} className="py-12 text-center text-gray-400">
          {loadingMore ? (
            <span className="animate-pulse">Loading more groups...</span>
          ) : (
            "Scroll to explore more"
          )}
        </div>
      )}

      {!hasMore && !preview && (
        <p className="text-center text-gray-400 mt-10">
          🎉 You’ve reached the end
        </p>
      )}
    </section>
  );
}
