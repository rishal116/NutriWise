"use client";

import { CheckCheck, Check, Trash2, Clock, Pencil } from "lucide-react";
import { useState, useEffect } from "react";

interface MessageBubbleProps {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  replyToText?: string;
  showAvatar?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void; // Triggered from right-click
}

export default function MessageBubble({
  id, text, isSender, timestamp, status = "sent", replyToText, showAvatar = true, onDelete, onEdit
}: MessageBubbleProps) {
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  // Time Limits: Edit (2m), Delete (5m)
  useEffect(() => {
    const checkLimits = () => {
      const diff = Date.now() - new Date(timestamp).getTime();
      setCanEdit(diff < 2 * 60 * 1000);
      setCanDelete(diff < 5 * 60 * 1000);
    };
    checkLimits();
    const timer = setInterval(checkLimits, 30000);
    return () => clearInterval(timer);
  }, [timestamp]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isSender) return;
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPos(null);

  return (
    <div 
      className={`group flex w-full mb-1 items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}
      onMouseLeave={closeMenu}
    >
      {/* Avatar Alignment Fix: Reserve space if no avatar */}
      {!isSender && showAvatar ? (
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold border border-white flex-shrink-0 shadow-sm">
          N
        </div>
      ) : <div className="w-8" />}

      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isSender ? "items-end" : "items-start"}`}>
        <div
          onContextMenu={handleContextMenu}
          className={`relative px-4 py-2 shadow-sm transition-all duration-200 
            ${isSender 
              ? "bg-emerald-600 text-white rounded-2xl rounded-tr-none" 
              : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none"}
          `}
        >
          {replyToText && (
            <div className={`text-[11px] mb-1.5 p-1.5 rounded-lg bg-black/10 border-l-4 ${isSender ? 'border-white/40' : 'border-emerald-500'}`}>
              <p className="line-clamp-1 opacity-80 italic">{replyToText}</p>
            </div>
          )}
          
          <p className="text-[14.5px] leading-relaxed break-words pb-1">{text}</p>

          {/* Metadata & WhatsApp Ticks */}
          <div className="flex items-center justify-end gap-1 mt-[-4px] opacity-80">
            <span className="text-[9px] font-medium uppercase tracking-tighter">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isSender && (
              <div className="flex scale-90">
                {status === "sent" && <Check className="w-3.5 h-3.5" />}
                {status === "delivered" && <CheckCheck className="w-3.5 h-3.5" />}
                {status === "read" && <CheckCheck className="w-3.5 h-3.5 text-sky-300" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right-Click Context Menu */}
      {menuPos && (
        <div 
          className="fixed z-50 bg-white border border-gray-100 shadow-xl rounded-xl py-1 w-32 animate-in fade-in zoom-in-95"
          style={{ top: menuPos.y, left: menuPos.x }}
          onClick={closeMenu}
        >
          <button 
            disabled={!canEdit}
            onClick={() => onEdit(id, text)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button 
            disabled={!canDelete}
            onClick={() => onDelete(id)}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50 text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}