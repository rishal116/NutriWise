"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Lock, MoreHorizontal, Unlock } from "lucide-react";

interface UserActionsMenuProps {
  fullName: string;
  isBlocked: boolean;
  onView: () => void;
  onToggleBlock: () => void;
}

export default function UserActionsMenu({
  fullName,
  isBlocked,
  onView,
  onToggleBlock,
}: UserActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  const BlockIcon = isBlocked ? Unlock : Lock;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Actions for ${fullName}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className="rounded-lg border border-transparent p-1.5 transition-all hover:border-slate-200 hover:bg-white"
      >
        <MoreHorizontal size={18} className="text-slate-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={run(onView)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={14} />
            View Profile
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={run(onToggleBlock)}
            className={`mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              isBlocked
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <BlockIcon size={14} />
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      )}
    </div>
  );
}