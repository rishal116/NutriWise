"use client";

import {
  CheckCheck,
  Check,
  Trash2,
  Pencil,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Attachment {
  url: string;
  fileName: string;
}

interface MessageBubbleProps {
  id: string;
  text?: string;
  createdAt?: string;
  isSender: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "file";
  attachments?: Attachment[];
  isEdited?: boolean;
  editedAt?:Date;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export default function MessageBubble({
  id,
  text = "",
  createdAt,
  isSender,
  timestamp,
  status = "sent",
  type = "text",
  attachments = [],
  isEdited,
  editedAt,
  onDelete,
  onEdit,
}: MessageBubbleProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const finalTimestamp =
  isEdited && editedAt
    ? new Date(editedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : timestamp;

  useEffect(() => {
    if (!createdAt) return;
    const checkLimits = () => {
      const sentTime = new Date(createdAt).getTime();
      if (isNaN(sentTime)) return;
      const diff = Date.now() - sentTime;
      setCanEdit(diff < 20 * 60 * 1000); // 20 minutes
    };
    checkLimits();
    const timer = setInterval(checkLimits, 30000);
    return () => clearInterval(timer);
  }, [createdAt]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isImageFile = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const hasImage = attachments.some((file) => isImageFile(file.url));

  return (
    <div
      className={`flex w-full mb-3 group/row ${
        isSender ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-3 duration-300"
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        <div
          onContextMenu={(e) => {
  if (isSender && type === "text") {
    e.preventDefault();
    setMenuOpen(true);
  }
}}
          className={`relative shadow-sm transition-all duration-200 
          ${
            isSender
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-tr-none"
              : "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-emerald-100/50"
          }
          ${hasImage ? "p-1.5" : "px-4 py-2.5"}
          `}
        >
          {/* MENU TOGGLE FOR SENDER */}
          {isSender && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 text-emerald-400 opacity-0 group-hover/row:opacity-100 transition-all rounded-xl hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
          )}

          {/* ATTACHMENTS SECTION */}
          {type === "file" && attachments.length > 0 && (
            <div className="flex flex-col gap-2 mb-1">
              {attachments.map((file, index) => {
                const isImage = isImageFile(file.url);
                return (
                  <div key={file.url || index} className="relative">
                    {isImage ? (
                      <div className="rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                        <img
                          src={file.url}
                          alt={file.fileName}
                          className="w-full max-h-[320px] object-cover cursor-zoom-in hover:scale-[1.02] transition-transform"
                        />
                      </div>
                    ) : (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors
                        ${
                          isSender
                            ? "bg-white/10 border-white/20 hover:bg-white/20"
                            : "bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSender ? "bg-white/20" : "bg-emerald-500"}`}>
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold truncate ${isSender ? "text-white" : "text-slate-700"}`}>
                            {file.fileName}
                          </p>
                        </div>
                        <Download className={`w-4 h-4 ${isSender ? "text-emerald-100" : "text-emerald-500"}`} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TEXT CONTENT */}
          {text && (
            <div className={`text-[15px] leading-relaxed break-words font-medium ${hasImage ? "px-2 py-2" : ""}`}>
              {text}
            </div>
          )}

          {/* METADATA (TIME + STATUS) */}
          <div
            className={`flex items-center justify-end gap-1.5 mt-1 select-none
            ${hasImage && !text ? "absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm" : ""}`}
          >
            {isEdited && <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">Edited</span>}
            
            <span
  className={`text-[10px] font-bold tracking-tight ${
    isSender && !hasImage ? "text-emerald-50/80" : "text-slate-400"
  }`}
>
  {finalTimestamp}
</span>
            {isSender && (
              <div className="ml-0.5">
                {status === "read" ? (
                  <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                ) : (
                  <Check className={`w-3.5 h-3.5 ${isSender && !hasImage ? "text-emerald-200/50" : "text-slate-300"}`} />
                )}
              </div>
            )}
          </div>

          {/* ACTIONS POPUP */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-2 z-[70] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl py-1.5 w-48 border border-emerald-50 overflow-hidden animate-in zoom-in-95 duration-200"
            >
             {canEdit && type === "text" && (
  <button
    onClick={() => {
      onEdit(id, text);
      setMenuOpen(false);
    }}
    className="w-full px-4 py-3 text-left text-[13px] font-bold flex items-center justify-between hover:bg-emerald-50 text-slate-700 transition-colors"
  >
    Edit Message
    <Pencil className="w-3.5 h-3.5 text-emerald-500" />
  </button>
)}
              <div className="h-[1px] bg-emerald-50/50 mx-2" />
              <button
                onClick={() => { onDelete(id); setMenuOpen(false); }}
                className="w-full px-4 py-3 text-left text-[13px] font-bold flex items-center justify-between hover:bg-red-50 text-red-500 transition-colors"
              >
                Delete
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}