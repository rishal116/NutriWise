"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Search, ChevronLeft, X } from "lucide-react";
import { userChatService } from "@/services/user/userChat.service";
import Image from "next/image";

type ChatType = "direct" | "group";

interface ConversationAPI {
  id: string;
  chatType: ChatType;
  otherUserName?: string | null;
  otherUserProfile?: string | null;
  title?: string | null;
  groupAvatar?: string | null;
  memberCount?: number;
  lastMessage?: string | null;
  lastMessageAt?: string | Date | null;
}

interface Conversation {
  id: string;
  chatType: ChatType;
  name: string;
  profile?: string;
  lastMessage: string;
  time: string;
  memberCount?: number;
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export default function ConversationList({
  selectedId,
  onSelect,
  onBack,
}: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await userChatService.listUsers("user");

        const data: ConversationAPI[] = res.data ?? [];

        const mapped: Conversation[] = data.map((u) => {
          const isDirect = u.chatType === "direct";

          const name = isDirect
            ? (u.otherUserName ?? "Unknown User")
            : (u.title ?? "Unnamed Group");

          const profile = isDirect
            ? (u.otherUserProfile ?? undefined)
            : (u.groupAvatar ?? undefined);

          const lastMessage =
            u.lastMessage ??
            (isDirect
              ? "Start a health consultation..."
              : "Start group conversation...");

          const time =
            u.lastMessageAt != null
              ? new Date(u.lastMessageAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "";

          return {
            id: u.id,
            chatType: u.chatType,
            name,
            profile,
            lastMessage,
            time,
            memberCount: u.memberCount,
          };
        });

        setConversations(mapped);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-emerald-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-2 border-b border-emerald-50">
        <button
          onClick={onBack}
          className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-700 group"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-1">Chats</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 group-focus-within:text-emerald-600 transition-colors z-10" />

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-emerald-100 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-emerald-500" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="px-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div className="h-2 w-full bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 transition-all relative ${
                  selectedId === conv.id
                    ? "bg-emerald-50/60"
                    : "bg-white hover:bg-gray-50/80"
                }`}
              >
                {selectedId === conv.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />
                )}

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full overflow-hidden border ${
                      selectedId === conv.id
                        ? "border-emerald-200"
                        : "border-gray-100"
                    }`}
                  >
                    {conv.profile ? (
                      <Image
                        src={conv.profile}
                        alt={conv.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 font-bold">
                        {conv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Group badge */}
                  {conv.chatType === "group" && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-blue-500 text-white px-1 rounded">
                      G
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3
                      className={`text-[15px] font-semibold truncate ${
                        selectedId === conv.id
                          ? "text-emerald-900"
                          : "text-gray-900"
                      }`}
                    >
                      {conv.name}
                    </h3>

                    <span className="text-[11px] font-medium text-gray-400">
                      {conv.time}
                    </span>
                  </div>

                  <p
                    className={`text-[13px] truncate leading-relaxed ${
                      selectedId === conv.id
                        ? "text-emerald-700/80"
                        : "text-gray-500"
                    }`}
                  >
                    {conv.lastMessage}
                  </p>

                  {/* Member count for group */}
                  {conv.chatType === "group" &&
                    conv.memberCount !== undefined && (
                      <span className="text-xs text-gray-400">
                        {conv.memberCount} members
                      </span>
                    )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
