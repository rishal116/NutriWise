"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface MessageActionsProps {
  messageId: string;
  text?: string;
  canEdit: boolean;
  onEdit?: () => void;
  onDelete: () => void;
}

export default function MessageActions({
  canEdit,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/60 transition-colors"
        aria-label="Message options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden animate-in zoom-in-95 duration-150">
          {canEdit && onEdit && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between transition-colors"
            >
              Edit
              <Pencil className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          )}

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center justify-between transition-colors"
          >
            Delete
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}