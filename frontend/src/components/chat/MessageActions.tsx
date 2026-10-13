"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface MessageActionsProps {
  messageId: string;
  text?: string;
  canEdit: boolean;
  onEdit?: () => void;
  onDelete: () => void;
}

export default function MessageActions({
  text,
  canEdit,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    if (!showDeleteConfirm) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDeleteConfirm]);

  const handleDeleteClick = () => {
    setOpen(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const messagePreview = text?.trim();

  return (
    <>
      <div className="relative inline-block" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100/60 hover:text-slate-600"
          aria-label="Message options"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg animate-in zoom-in-95 duration-150"
            role="menu"
          >
            {canEdit && onEdit && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                role="menuitem"
              >
                Edit
                <Pencil className="h-3.5 w-3.5 text-emerald-600" />
              </button>
            )}

            <button
              type="button"
              onClick={handleDeleteClick}
              className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              role="menuitem"
            >
              Delete
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCancelDelete();
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-message-title"
            aria-describedby="delete-message-description"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="delete-message-title"
                    className="text-base font-bold text-slate-800"
                  >
                    Delete message?
                  </h2>

                  <p
                    id="delete-message-description"
                    className="mt-1 text-sm leading-relaxed text-slate-500"
                  >
                    This message will be deleted for everyone in this
                    conversation.
                  </p>
                </div>
              </div>

              {messagePreview && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
                  <p className="line-clamp-3 break-words text-xs leading-relaxed text-slate-500">
                    {messagePreview}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 active:bg-rose-800"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
