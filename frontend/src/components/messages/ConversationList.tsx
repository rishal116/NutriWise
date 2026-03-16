"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, X } from "lucide-react";
import { userChatService } from "@/services/user/userChat.service";

interface Conversation { 
  id: string; 
  name: string;
  profile?: string;
  lastMessage?: string;
  online?: boolean;
  time?: string;
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isMobile: boolean;
  onBack: () => void;
}

export default function ConversationList({ selectedId, onSelect, isMobile, onBack }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await userChatService.listUsers();
        const data = res.data;
        setConversations(
          data.map((u: any) => ({
            id: u.id,
            name: u.otherUserName || "Unknown User",
            profile: u.otherUserProfile,
            lastMessage: u.lastMessage || "Start a health consultation...",
            online: false,
            time: u.lastMessageAt
              ? new Date(u.lastMessageAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "",
          }))
        );
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    })();
  }, []);

  const filtered = conversations.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-emerald-50">
      
      {/* 1. Header Area - Back button is now always visible */}
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

      {/* 2. Search Area */}
      <div className="px-4 py-3">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 group-focus-within:text-emerald-600 transition-colors z-10" />
          
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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

      {/* 3. List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="px-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 py-4 animate-pulse">
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
            {filtered.map(conv => (
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

                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full overflow-hidden border ${selectedId === conv.id ? 'border-emerald-200' : 'border-gray-100'}`}>
                    {conv.profile ? (
                      <img src={conv.profile} alt={conv.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 font-bold">
                        {conv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-[15px] font-semibold truncate ${selectedId === conv.id ? 'text-emerald-900' : 'text-gray-900'}`}>
                      {conv.name}
                    </h3>
                    <span className="text-[11px] font-medium text-gray-400">
                      {conv.time}
                    </span>
                  </div>
                  <p className={`text-[13px] truncate leading-relaxed ${selectedId === conv.id ? 'text-emerald-700/80' : 'text-gray-500'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}