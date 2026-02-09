"use client";

import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const conversations = [
  {
    id: "1",
    name: "Dr. Rahul Sharma",
    message: "Your test results are ready",
    time: "2m ago",
    unread: 2,
    initials: "RS",
    online: true,
    category: "Cardiologist"
  },
  {
    id: "2",
    name: "Dr. Priya Menon",
    message: "Please schedule a follow-up",
    time: "1h ago",
    unread: 0,
    initials: "PM",
    online: false,
    category: "General Physician"
  },
  {
    id: "3",
    name: "Dr. Anil Kumar",
    message: "Prescription has been sent",
    time: "3h ago",
    unread: 0,
    initials: "AK",
    online: true,
    category: "Pediatrician"
  },
];

export default function ConversationList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header Section */}
      <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Messages</h2>
            <p className="text-xs text-slate-500 font-medium">4 Active Conversations</p>
          </div>
          <button 
            title="New conversation"
            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors..."
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.map((c) => {
          const isActive = selectedId === c.id;
          
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full group relative flex items-center gap-4 px-5 py-4 text-left transition-all duration-200 active:scale-[0.98]
                ${isActive ? "bg-emerald-50/50" : "hover:bg-slate-50"}
              `}
            >
              {/* Active Indicator Accent */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" />
              )}

              {/* Avatar with Online Status */}
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm transition-transform duration-300 group-hover:rotate-3
                  ${isActive ? "bg-emerald-600 scale-110" : "bg-slate-400"}
                `}>
                  {c.initials}
                </div>
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className={`font-bold truncate ${isActive ? "text-emerald-900" : "text-slate-800"}`}>
                    {c.name}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                    {c.time}
                  </span>
                </div>
                
                <p className="text-[11px] text-emerald-600 font-medium mb-1 uppercase tracking-wide">
                  {c.category}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${c.unread > 0 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                    {c.message}
                  </p>
                  
                  {c.unread > 0 && (
                    <span className="flex-shrink-0 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-lg animate-pulse">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}