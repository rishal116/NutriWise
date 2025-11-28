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
<div className="min-h-screen bg-gray-50 mt-[90px] px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Notifications
        </h1>
        <p className="text-gray-500 text-sm">Manage all notifications in your admin panel</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-visible">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No notifications found.</div>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
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
                    className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                      !n.read ? "bg-green-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{n.title}</td>
                    <td className="px-6 py-4">{n.message}</td>
                    <td className="px-6 py-4 capitalize">{n.type}</td>
                    <td className="px-6 py-4">{new Date(n.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          n.read ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {n.read ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => toggleDropdown(n._id)}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openDropdown === n._id && (
                        <div className="absolute right-8 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n._id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-green-600"
                            >
                              Mark as Read
                            </button>
                          )}
                          { n.userId && (
                            <button
                              onClick={() => viewProfile(n.userId!)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-blue-600"
                            >
                              View Profile
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(n._id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-600"
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

      {/* ---------------- Profile Modal ---------------- */}
{showProfileModal && selectedProfile && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 max-h-[90vh] overflow-y-auto shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Nutritionist Profile</h2>

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

      {selectedProfile.experiences && selectedProfile.experiences.length > 0 && (
        <div>
          <strong>Experiences:</strong>
          <ul className="list-disc pl-6">
            {selectedProfile.experiences.map((exp, idx) => (
              <li key={idx}>{exp.role} at {exp.organization} ({exp.years} yrs)</li>
            ))}
          </ul>
        </div>
      )}

      {selectedProfile.bio && <p><strong>Bio:</strong> {selectedProfile.bio}</p>}
      {selectedProfile.languages && (
        <p><strong>Languages:</strong> {selectedProfile.languages.join(", ")}</p>
      )}
      {selectedProfile.videoCallRate !== undefined && (
        <p><strong>Video Call Rate:</strong> ${selectedProfile.videoCallRate}</p>
      )}
      {selectedProfile.consultationDuration && (
        <p><strong>Consultation Duration:</strong> {selectedProfile.consultationDuration}</p>
      )}
      {selectedProfile.availabilityStatus && (
        <p><strong>Availability:</strong> {selectedProfile.availabilityStatus}</p>
      )}
      {selectedProfile.cv && (
        <p>
          <strong>CV:</strong>{" "}
          <a href={selectedProfile.cv} target="_blank" className="text-blue-600 underline">
            View
          </a>
        </p>
      )}

      <textarea
        placeholder="Enter rejection reason"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 mt-4"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-xl"
          onClick={() => { setShowProfileModal(false); setRejectReason(""); }}
        >
          Close
        </button>
       <button
  className="px-4 py-2 bg-green-600 text-white rounded-xl"
  onClick={() => approveNutritionist(selectedProfile.userId!)}
>
  Approve
</button>

<button
  className="px-4 py-2 bg-red-600 text-white rounded-xl"
  onClick={() => rejectNutritionist(selectedProfile.userId!)}
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
