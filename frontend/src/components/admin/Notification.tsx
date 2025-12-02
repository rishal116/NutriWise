"use client";

import { useEffect, useState } from "react";
import { MoreVertical, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminNotificationService } from "@/services/admin/adminNotification.service";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  senderId?: string;
}

interface NutritionistProfile {
  _id: string;
  userId: string;
  bio?: string;
  qualifications?: string[];
  specializations?: string[];
  languages?: string[];
  experiences?: { role: string; organization: string; years: number }[];
  totalExperienceYears?: number;
  location?: { state: string; city: string };
  cv?: string;
  certifications?: string[];
  videoCallRate?: number;
  consultationDuration?: string;
}

export default function NotificationsPage({ initialData }: { initialData: any }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialData.notifications || []);
  const [page, setPage] = useState(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<NutritionistProfile | null>(null);
  const [basicUser, setBasicUser] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await adminNotificationService.getAllNotifications(page, limit, search);
      setNotifications(res.notifications || []);
      setPage(res.currentPage || 1);
      setTotalPages(res.totalPages || 1);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications when page or search changes
  useEffect(() => {
    if (page !== initialData.currentPage || search !== "") fetchNotifications();
  }, [page, search]);

  const toggleDropdown = (id: string) => setOpenDropdown(openDropdown === id ? null : id);

  const markAsRead = async (id: string) => {
    try {
      await adminNotificationService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
      toast.success("Marked as read");
      setOpenDropdown(null);
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await adminNotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification deleted");
      setOpenDropdown(null);
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const viewProfile = async (userId: string) => {
    try {
      const res = await adminNotificationService.getNutritionistProfile(userId);
      setSelectedProfile(res.nutritionist);
      setBasicUser(res.user);
      setRejectReason("");
      setShowProfileModal(true);
      setOpenDropdown(null);
    } catch {
      toast.error("Failed to fetch profile");
    }
  };

  const approveNutritionist = async (userId: string) => {
    try {
      await adminNotificationService.approveNutritionist(userId);
      toast.success("Nutritionist approved");
      setNotifications(prev => prev.filter(n => n.senderId !== userId));
      setShowProfileModal(false);
    } catch {
      toast.error("Failed to approve nutritionist");
    }
  };

  const rejectNutritionist = async (userId: string) => {
    if (!rejectReason.trim()) return toast.error("Rejection reason required");
    try {
      await adminNotificationService.rejectNutritionist(userId, rejectReason);
      toast.success("Nutritionist rejected");
      setNotifications(prev => prev.filter(n => n.senderId !== userId));
      setShowProfileModal(false);
    } catch {
      toast.error("Failed to reject nutritionist");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-[90px] px-4 sm:px-8 pb-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="border px-3 py-2 rounded-xl w-full sm:w-80"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading…</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No notifications found</div>
      ) : (
        notifications.map(n => (
          <div key={n._id} className={`bg-white rounded-2xl shadow-md border p-4 flex justify-between items-center transition hover:shadow-lg ${!n.read ? "border-green-400 bg-green-50" : ""}`}>
            <div>
              <p className="font-semibold text-gray-800">{n.title}</p>
              <p className="text-gray-600">{n.message}</p>
              <p className="text-gray-400 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => toggleDropdown(n._id)}>
                <MoreVertical size={20} />
              </button>
              {openDropdown === n._id && (
                <div className="absolute right-0 top-8 bg-white rounded-xl border shadow-lg w-44 z-50">
                  {!n.read && <button onClick={() => markAsRead(n._id)} className="w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50">Mark as Read</button>}
                  {n.senderId && <button onClick={() => viewProfile(n.senderId!)} className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50">View Profile</button>}
                  <button onClick={() => deleteNotification(n._id)} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-3 py-2 bg-gray-200 rounded-xl disabled:opacity-40">
            Prev
          </button>
          <span className="font-semibold px-3 py-2">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-2 bg-gray-200 rounded-xl disabled:opacity-40">
            Next
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4" onClick={() => setShowProfileModal(false)}>
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-3">Nutritionist Profile</h2>

            <p><strong>Name:</strong> {basicUser?.fullName}</p>
            <p><strong>Email:</strong> {basicUser?.email}</p>
            <p><strong>Phone:</strong> {basicUser?.phone}</p>

            {selectedProfile.bio && (
              <p className="mt-3"><strong>Bio:</strong> <br />{selectedProfile.bio}</p>
            )}

            {(selectedProfile.qualifications?.length ?? 0) > 0 && (
              <div className="mt-3">
                <strong>Qualifications:</strong>
                <ul className="ml-5 list-disc">
                  {selectedProfile.qualifications?.map((q: string, i: number) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}

            {selectedProfile.cv && (
              <p className="mt-3"><strong>CV:</strong> <a className="text-blue-600 underline" href={selectedProfile.cv} target="_blank">View CV</a></p>
            )}

            <textarea
              className="w-full border rounded-xl p-2 mt-4"
              placeholder="Rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => approveNutritionist(selectedProfile.userId)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl">Approve</button>
              <button onClick={() => rejectNutritionist(selectedProfile.userId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
