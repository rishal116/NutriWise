"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { userChatService } from "@/services/user/userChat.service";

interface Conversation { id: string; name: string }
interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function ConversationList({ selectedId, onSelect, isMobile, onCloseMobile }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await userChatService.listUsers();
        setConversations(data.map((u: any) => ({ 
          id: u.id, 
          name: u.otherUserName || "Unknown" 
        })));
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
    <div className="flex flex-col h-full bg-white">
      {/* Header - Simple & White */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
        {isMobile && onCloseMobile && (
          <button onClick={onCloseMobile} className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search - Subtle & Integrated */}
      <div className="px-4 mb-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full bg-gray-50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  selectedId === conv.id 
                    ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 active:scale-[0.98]"
                }`}
              >
                {/* Minimal Avatar Placeholder */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 ${
                  selectedId === conv.id ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {conv.name.charAt(0)}
                </div>

                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${selectedId === conv.id ? "text-emerald-900" : "text-gray-900"}`}>
                    {conv.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">Click to view chat</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}