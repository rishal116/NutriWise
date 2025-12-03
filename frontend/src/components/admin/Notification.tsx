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
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  nutritionistStatus: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
  bio?: string;
  qualifications?: string[];
  specializations?: string[];
  languages?: string[];
  videoCallRate?: number;
  consultationDuration?: string;
  location?: { state: string; city: string };
  experiences?: { role: string; organization: string; years: number }[];
  totalExperienceYears?: number;
  cv?: string;
  certifications?: string[];
  availabilityStatus?: "available" | "unavailable" | "busy";
  createdAt?: string;
  updatedAt?: string;
}

export default function NotificationsPage({ initialData }: { initialData: any }) {
  const [actionTakenProfiles, setActionTakenProfiles] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialData.notifications || []);
  const [page, setPage] = useState(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<NutritionistProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [filter, setFilter] = useState<"all" | "unread">("all");

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

  useEffect(() => {
    fetchNotifications();
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

  const viewProfile = async (userId: string) => {
    try {
      const res = await adminNotificationService.getNutritionistProfile(userId);
      setSelectedProfile({ ...res.data, userId: res.data._id });
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
      setActionTakenProfiles(prev => [...prev, userId]);
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
      setActionTakenProfiles(prev => [...prev, userId]);
      setShowProfileModal(false);
    } catch {
      toast.error("Failed to reject nutritionist");
    }
  };

  const filteredNotifications = notifications.filter(n => filter === "all" ? true : !n.read);

  return (
    <div className="min-h-screen bg-gray-100 pt-[90px] px-6 sm:px-12 pb-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Notifications</h1>

      {/* Search + Filter */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded-full w-full sm:w-96 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full font-medium transition ${filter === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-full font-medium transition ${filter === "unread" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Notifications */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading…</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No notifications found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotifications.map(n => (
            <div key={n._id} className={`bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition relative border-l-4 ${!n.read ? "border-blue-500" : "border-transparent"}`}>
              <div>
                <p className="text-lg font-semibold text-gray-800">{n.title}</p>
                <p className="text-gray-600 mt-1">{n.message}</p>
                <p className="text-gray-400 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>

              <div className="absolute top-4 right-4">
                <button onClick={() => toggleDropdown(n._id)} className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={20} />
                </button>
                {openDropdown === n._id && (
                  <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg w-44 z-50 border">
                    {!n.read && (
                      <button onClick={() => markAsRead(n._id)} className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50">
                        Mark as Read
                      </button>
                    )}
                    {n.senderId && (
                      <button onClick={() => viewProfile(n.senderId!)} className="w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50">
                        View Profile
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition">Prev</button>
          <span className="font-medium text-gray-700">Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition">Next</button>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-8">
            <button className="absolute top-5 right-5 text-gray-500 hover:text-gray-800" onClick={() => setShowProfileModal(false)}>
              <X size={28} />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              {selectedProfile.profileImage && (
                <img src={selectedProfile.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 shadow-md" />
              )}

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProfile.fullName}</h2>
                <p className="text-gray-600">{selectedProfile.email}</p>
                {selectedProfile.phone && <p className="text-gray-600">{selectedProfile.phone}</p>}

                <p
                  className={`mt-2 font-medium ${
                    selectedProfile.availabilityStatus === "available" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {selectedProfile.availabilityStatus?.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>

            {selectedProfile.bio && <p className="mt-4 text-gray-700">{selectedProfile.bio}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
              {(selectedProfile.qualifications?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Qualifications</h3>
                  <ul className="list-disc ml-5 text-gray-600">
                    {selectedProfile.qualifications?.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}

              {(selectedProfile.specializations?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Specializations</h3>
                  <ul className="list-disc ml-5 text-gray-600">
                    {selectedProfile.specializations?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {(selectedProfile.languages?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Languages</h3>
                  <p className="text-gray-600">{selectedProfile.languages?.join(", ")}</p>
                </div>
              )}

              {selectedProfile.location && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
                  <p className="text-gray-600">{selectedProfile.location.state}, {selectedProfile.location.city}</p>
                </div>
              )}

              {selectedProfile.videoCallRate && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Video Call Rate</h3>
                  <p className="text-gray-600">₹{selectedProfile.videoCallRate}</p>
                </div>
              )}

              {selectedProfile.consultationDuration && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Consultation Duration</h3>
                  <p className="text-gray-600">{selectedProfile.consultationDuration} mins</p>
                </div>
              )}
            </div>

            {(selectedProfile.experiences?.length ?? 0) > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-gray-800 mb-2">Experiences</h3>
                <ul className="list-disc ml-5 text-gray-600">
                  {selectedProfile.experiences?.map((exp, i) => (
                    <li key={i}>{exp.role} at {exp.organization} ({exp.years} {exp.years === 1 ? "year" : "years"})</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row gap-6">
              {selectedProfile.cv && (
                <a href={selectedProfile.cv} target="_blank" className="text-blue-600 underline font-medium">View CV</a>
              )}

              {(selectedProfile.certifications?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Certifications</h3>
                  <ul className="list-disc ml-5 text-gray-600">
                    {selectedProfile.certifications?.map((c, i) => (
                      <li key={i}>
                        <a href={c} target="_blank" className="text-blue-600 underline">View</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

           {!actionTakenProfiles.includes(selectedProfile.userId) && (
  <>
    <textarea
      className="w-full border rounded-xl p-3 mt-5 focus:ring-2 focus:ring-red-400 focus:outline-none"
      placeholder="Rejection reason..."
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />

    <div className="flex justify-end gap-4 mt-6">
      <button
        onClick={() => approveNutritionist(selectedProfile.userId)}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition"
      >
        Approve
      </button>
      <button
        onClick={() => rejectNutritionist(selectedProfile.userId)}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition"
      >
        Reject
      </button>
    </div>
  </>
)}
          </div>
        </div>
      )}
    </div>
  );
}
