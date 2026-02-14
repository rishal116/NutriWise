"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MoreVertical,
  Bell,
  Search,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { adminNotificationService } from "@/services/admin/adminNotification.service";
import { NotificationDTO } from "@/dtos/admin/notificationList.dto";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(2);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  /* ---------------- FETCH ---------------- */

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await adminNotificationService.getAllNotifications(
        page,
        limit,
        search
      );

      setNotifications(res.notifications || []);
      setPage(res.currentPage || 1);
      setTotalPages(res.totalPages || 1);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchNotifications, 500);
    return () => clearTimeout(debounce);
  }, [page, search]);

  /* ---------------- ACTIONS ---------------- */

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const markAsRead = async (id: string) => {
    try {
      await adminNotificationService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
      setOpenDropdown(null);
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  /* ---------------- FILTER ---------------- */

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) =>
      filter === "all" ? true : !n.read
    );
  }, [notifications, filter]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 pt-[90px] px-4 md:px-8 lg:px-16 pb-12">
      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          Admin Notifications
        </h1>
        <p className="text-gray-500">
          Review and manage recent activities
        </p>
      </header>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex gap-2 bg-white p-1 rounded-xl border">
          {["all", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as "all" | "unread")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {loading ? (
        <p className="text-center text-gray-500 py-16">
          Loading notifications...
        </p>
      ) : filteredNotifications.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          No notifications found
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white p-6 rounded-2xl shadow border-l-4 ${
                n.read ? "border-gray-200" : "border-blue-600"
              }`}
            >
              <h3 className="font-bold text-lg">{n.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>

              <div className="flex justify-end mt-4 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(n._id);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical />
                </button>

                {openDropdown === n._id && (
                  <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="w-full px-4 py-2 flex gap-2 text-blue-600 hover:bg-blue-50"
                      >
                        <CheckCircle size={16} />
                        Mark as read
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
