"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminNotificationService } from "@/services/admin/adminNotification.service";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "approval";
  createdAt: string;
  read: boolean;
  userId?: string;
}

interface NutritionistProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  userId:string;
  status: string;
  qualifications?: string[];
  specializations?: string[];
  experiences?: { role: string; organization: string; years: number }[];
  bio?: string;
  languages?: string[];
  videoCallRate?: number;
  consultationDuration?: string;
  availabilityStatus?: "available" | "unavailable" | "busy";
  cv?: string;
}


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<NutritionistProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // ---------------- Fetch Notifications ----------------
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await adminNotificationService.getAllNotifications();
        setNotifications(res.notifications || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // ---------------- Dropdown ----------------
  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // ---------------- Mark as Read ----------------
  const markAsRead = async (id: string) => {
    try {
      await adminNotificationService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Notification marked as read");
      setOpenDropdown(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  // ---------------- Delete Notification ----------------
  const deleteNotification = async (id: string) => {
    try {
      await adminNotificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
      setOpenDropdown(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  // ---------------- View Profile Modal ----------------
const viewProfile = async (userId: string) => {
  console.log(userId);
  
  try {
    const res = await adminNotificationService.getNutritionistProfile(userId);
    setSelectedProfile(res.nutritionist);
    setShowProfileModal(true);
    setRejectReason("");
    setOpenDropdown(null);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to fetch profile");
  }
};


  // ---------------- Approve Nutritionist ----------------
  const approveNutritionist = async (userId) => {
    if (!selectedProfile) return;
    try {
      await adminNotificationService.approveNutritionist(userId);
      toast.success("Nutritionist approved");
      setNotifications((prev) =>
        prev.filter((n) => n.userId !== selectedProfile._id)
      );
      setShowProfileModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve");
    }
  };

  // ---------------- Reject Nutritionist ----------------
  const rejectNutritionist = async (userId) => {
    if (!selectedProfile) return;
    if (!rejectReason.trim()) {
      toast.error("Reason is required");
      return;
    }
    try {
      await adminNotificationService.rejectNutritionist(userId, rejectReason);
      toast.success("Nutritionist rejected");
      setNotifications((prev) =>
        prev.filter((n) => n.userId !== selectedProfile._id)
      );
      setShowProfileModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject");
    }
  };

  return (
  <div className="min-h-screen bg-[#F8F9FB] mt-[90px] px-4 sm:px-8 pb-10">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-3">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track & manage nutritionist approval requests and system alerts
        </p>
      </div>
    </div>

    {/* Card Wrapper */}
    <div className="bg-white rounded-2xl shadow-md border border-gray-200">

      {loading ? (
        <div className="text-center text-gray-500 py-12 animate-pulse text-lg font-medium">
          Loading notifications…
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">
          No notifications found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Message</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {notifications.map((n) => (
                <tr
                  key={n._id}
                  className={`border-b hover:bg-gray-50 transition ${
                    !n.read ? "bg-green-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{n.title}</td>
                  <td className="px-6 py-4 text-gray-700">{n.message}</td>
                  <td className="px-6 py-4 capitalize">{n.type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(n.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        n.read
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {n.read ? "Read" : "Unread"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => toggleDropdown(n._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openDropdown === n._id && (
                      <div className="absolute right-8 mt-2 bg-white rounded-xl border shadow-xl w-44 overflow-hidden z-50 animate-fadeIn">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-green-600 font-medium"
                          >
                            Mark as Read
                          </button>
                        )}
                        {n.userId && (
                          <button
                            onClick={() => viewProfile(n.userId!)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-blue-600 font-medium"
                          >
                            View Profile
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(n._id)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-gray-600 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* ---------- Profile Modal ---------- */}
    {showProfileModal && selectedProfile && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-3 z-50">
        <div className="bg-white rounded-2xl p-6 w-[420px] max-h-[92vh] overflow-y-auto shadow-2xl animate-scaleIn">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Nutritionist Profile
          </h2>

          <div className="space-y-2 text-gray-700 text-sm">
            <p><strong>Name:</strong> {selectedProfile.fullName}</p>
            <p><strong>Email:</strong> {selectedProfile.email}</p>
            <p><strong>Phone:</strong> {selectedProfile.phone}</p>
            <p><strong>Status:</strong> {selectedProfile.status}</p>
            {selectedProfile.qualifications && (
              <p><strong>Qualifications:</strong> {selectedProfile.qualifications.join(", ")}</p>
            )}
            {selectedProfile.specializations && (
              <p><strong>Specializations:</strong> {selectedProfile.specializations.join(", ")}</p>
            )}
            {selectedProfile.experiences && (
              <div>
                <strong>Experience:</strong>
                <ul className="list-disc ml-6">
                  {selectedProfile.experiences.map((exp, i) => (
                    <li key={i}>{exp.role} at {exp.organization} ({exp.years} yrs)</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedProfile.bio && <p><strong>Bio:</strong> {selectedProfile.bio}</p>}
            {selectedProfile.cv && (
              <p>
                <strong>CV:</strong>{" "}
                <a className="text-blue-600 underline" href={selectedProfile.cv} target="_blank">
                  View CV
                </a>
              </p>
            )}
          </div>

          <textarea
            className="w-full border rounded-xl px-3 py-2 mt-4 text-sm"
            placeholder="Enter rejection reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          ></textarea>

          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => setShowProfileModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-xl font-medium"
            >
              Close
            </button>
            <button
              onClick={() => approveNutritionist(selectedProfile.userId!)}
              className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium"
            >
              Approve
            </button>
            <button
              onClick={() => rejectNutritionist(selectedProfile.userId!)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
