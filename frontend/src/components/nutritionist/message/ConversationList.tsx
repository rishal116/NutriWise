"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

type ChatType = "direct" | "group";
type FilterType = "all" | "direct" | "group";

interface Conversation {
  id: string;
  chatType: ChatType;
  name: string;
  profile?: string;
  lastMessage: string;
  lastMessageAt: number;
  memberCount?: number;
}

interface Props {
  conversations: Conversation[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  onBack: () => void;
  onLoadMore?: () => void;
}

export default function ConversationList({
  conversations,
  loading,
  selectedId,
  onSelect,
  onBack,
  onLoadMore,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const listRef = useRef<HTMLDivElement | null>(null);

  // ---------------- Infinite Scroll ----------------
  useEffect(() => {
    const el = listRef.current;
    if (!el || !onLoadMore) return;

    const handleScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100;

      if (nearBottom && !loading) {
        onLoadMore();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, loading]);

  // ---------------- Filter ----------------
  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const matchSearch = c.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      const matchType = activeFilter === "all" || c.chatType === activeFilter;
      return matchSearch && matchType;
    });
  }, [conversations, search, activeFilter]);

  const formatTime = (t: number) => {
    if (!t) return "";
    return new Date(t).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col h-full p-3">
      {/* Header */}
      <div className="px-2 py-4 flex items-center gap-3">
        {/* Hide back button on desktop if needed, or keep for app-navigation */}
        <button
          onClick={onBack}
          className="p-2 hover:bg-emerald-50 rounded-full text-emerald-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-emerald-950">Messages</h1>
      </div>

      {/* Search Input */}
      <div className="px-2 pb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-emerald-100/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Filter Tabs */}
      <div className="px-2 pb-4 flex gap-2">
        {(["all", "direct", "group"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === f
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-white/40 text-emerald-800 hover:bg-white/70 border border-white/50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-1 custom-scrollbar"
      >
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 border ${
              selectedId === c.id
                ? "bg-white/90 border-emerald-200 shadow-sm ring-1 ring-emerald-100"
                : "hover:bg-emerald-50/50 border-transparent hover:border-emerald-100/50"
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center font-bold text-emerald-700 shadow-inner">
              {c.profile ? (
                <Image
                  src={c.profile}
                  alt={c.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                c.name[0]
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-800 truncate">{c.name}</p>
                <span className="text-[10px] text-emerald-900/40">
                  {formatTime(c.lastMessageAt)}
                </span>
              </div>
              <p className="text-xs text-emerald-900/60 truncate">
                {c.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
