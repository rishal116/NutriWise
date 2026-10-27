
"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

import { notificationService } from "@/services/common/notification.service";
import NotificationDropdown from "./NotificationDropdown";

interface NotificationBellProps {
  notificationsHref: string;
}

export default function NotificationBell({
  notificationsHref,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();

        if (mounted) setUnreadCount(count);
      } catch (error) {
        console.error("Failed to load unread count:", error);
      }
    };

    void loadCount();

    const intervalId = window.setInterval(() => {
      void loadCount();
    }, 60_000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          open
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
        }`}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        notificationsHref={notificationsHref}
        open={open}
      />
    </div>
  );
}
