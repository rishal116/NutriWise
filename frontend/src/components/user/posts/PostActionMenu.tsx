"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, MoreVertical, Trash2 } from "lucide-react";

interface PostActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function PostActionsMenu({ onEdit, onDelete }: PostActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Post actions"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 z-10 w-40 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg"
          onClick={(e) => e.preventDefault()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
            Edit post
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete post
          </button>
        </div>
      )}
    </div>
  );
}