"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { userChatService } from "@/services/user/userChat.service";

/* ============================= */
/* 1️⃣ API Response Type */
/* ============================= */

interface ConversationAPI {
  id: string;
  chatType: "direct" | "group";
  otherUserName?: string;
  otherUserProfile?: string | null;
}

/* ============================= */
/* 2️⃣ UI Model Type */
/* ============================= */

interface Conversation {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  initials: string;
  online: boolean;
  category: string;
}

/* ============================= */
/* 3️⃣ Mapper Function */
/* ============================= */

function mapToUIModel(data: ConversationAPI[]): Conversation[] {
  return data.map((item) => {
    const name = item.otherUserName ?? "Unknown";

    return {
      id: item.id,
      name,
      message: "Start conversation",
      time: "",
      unread: 0,
      initials: name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      online: false,
      category: item.chatType,
    };
  });
}

/* ============================= */
/* 4️⃣ Component */
/* ============================= */

export default function ConversationList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);

        const apiData: ConversationAPI[] =
          await userChatService.listUsers();

        const formatted = mapToUIModel(apiData);

        setConversations(formatted);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  /* ============================= */
  /* 5️⃣ Search Filter */
  /* ============================= */

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ============================= */
  /* 6️⃣ UI */
  /* ============================= */

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Messages
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {conversations.length} Active Conversations
            </p>
          </div>
          <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-200">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-center mt-5 text-slate-400">
            Loading...
          </p>
        ) : filteredConversations.length === 0 ? (
          <p className="text-center mt-5 text-slate-400">
            No conversations found
          </p>
        ) : (
          filteredConversations.map((c) => {
            const isActive = selectedId === c.id;

            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-200
                  ${isActive ? "bg-emerald-50" : "hover:bg-slate-50"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white
                    ${isActive ? "bg-emerald-600" : "bg-slate-400"}`}
                >
                  {c.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-semibold truncate">
                      {c.name}
                    </p>
                    <span className="text-xs text-slate-400">
                      {c.time}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-600 uppercase">
                    {c.category}
                  </p>

                  <p className="text-sm text-slate-500 truncate">
                    {c.message}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
