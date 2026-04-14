"use client";

import { useState, useEffect } from "react";
import { Search, X, MessageSquare, Sparkles } from "lucide-react";
import { userChatService } from "@/services/user/userChat.service";
import { motion, AnimatePresence } from "framer-motion";

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
        const res = await userChatService.listUsers("nutritionist");
        const data = res.data
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
    <div className="flex flex-col h-full bg-white relative">
      {/* Header Section */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Comms</span>
            </div>
          </div>
          {isMobile && onCloseMobile && (
            <button onClick={onCloseMobile} className="p-2 bg-slate-50 rounded-xl text-slate-400">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search - Styled to match your Dashboard */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-700"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
        {loading ? (
          <div className="space-y-3 px-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 w-full bg-slate-50 animate-pulse rounded-[1.5rem]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-slate-200" />
            </div>
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No chats found</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((conv, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-300 relative group ${
                    selectedId === conv.id 
                      ? "bg-emerald-50/60 shadow-sm shadow-emerald-900/5" 
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* Active Indicator Line */}
                  {selectedId === conv.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r-full"
                    />
                  )}

                  {/* Avatar with Expert Styling */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-all duration-500 ${
                    selectedId === conv.id 
                      ? "bg-emerald-600 text-white rotate-6 shadow-lg shadow-emerald-200" 
                      : "bg-slate-900 text-slate-100 group-hover:bg-emerald-600 group-hover:rotate-6 shadow-md shadow-slate-200"
                  }`}>
                    {conv.name.charAt(0)}
                  </div>

                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-sm font-black tracking-tight truncate ${selectedId === conv.id ? "text-emerald-900" : "text-slate-900"}`}>
                        {conv.name}
                      </p>
                      <span className="text-[9px] font-black text-slate-300 uppercase">Now</span>
                    </div>
                    <p className={`text-[11px] font-bold truncate ${selectedId === conv.id ? "text-emerald-600/70" : "text-slate-400"}`}>
                      {selectedId === conv.id ? "Active Consultation" : "Review latest progress..."}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Subtle branding at bottom of list */}
      <div className="p-6 border-t border-slate-50 flex items-center gap-2">
         <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Sparkles size={12} className="text-emerald-600" />
         </div>
         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">NutriWise Cloud</span>
      </div>
    </div>
  );
}