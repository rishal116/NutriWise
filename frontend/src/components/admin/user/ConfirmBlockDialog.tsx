"use client";

import { useEffect } from "react";

import type { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";

interface ConfirmBlockDialogProps {
  user: AdminUserListItemDto;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmBlockDialog({
  user,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmBlockDialogProps) {
  const action = user.isBlocked ? "Unblock" : "Block";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-user-action-title"
        className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl"
      >
        <h2
          id="confirm-user-action-title"
          className="text-lg font-bold text-slate-900"
        >
          Confirm Action
        </h2>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Are you sure you want to {action.toLowerCase()}{" "}
          <span className="font-bold italic text-slate-900">
            {user.fullName}
          </span>
          ?
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition disabled:opacity-50 ${
              user.isBlocked
                ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                : "bg-red-600 shadow-red-200 hover:bg-red-700"
            }`}
          >
            {isLoading ? "Please wait..." : `Yes, ${action}`}
          </button>
        </div>
      </div>
    </div>
  );
}