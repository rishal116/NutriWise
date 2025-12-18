"use client";

import { useEffect, useState, useMemo } from "react";
import { MoreVertical, X, Bell, Search, CheckCircle, XCircle, Info, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { adminNotificationService } from "@/services/admin/adminNotification.service";
import { NotificationDTO } from "@/dtos/admin/notificationList.dto";
import { NutritionistProfileDTO } from "@/dtos/admin/notificationList.dto";

export default function NotificationsPage({ initialData }: { initialData: any }) {
  const [actionTakenProfiles, setActionTakenProfiles] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [page, setPage] = useState(initialData.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [limit] = useState(2);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<NutritionistProfileDTO | null>(null);
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
    // Debounce search input for better performance
    const delayDebounceFn = setTimeout(() => {
      fetchNotifications();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search]); // Removed dependency 'limit' as it's static

  // Event Handlers
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
      // Close dropdown before opening modal
      setOpenDropdown(null);
      
      const res = await adminNotificationService.getNutritionistProfile(userId);
      console.log(res);
      
      const { profile, user } = res.data;

      // Map API response to NutritionistProfile type (as in original code)
      setSelectedProfile({
        _id: profile._id ?? "",
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileImage: profile.profileImage,
        nutritionistStatus: user.nutritionistStatus,
        rejectionReason: user.rejectionReason,
        bio: profile.bio,
        qualifications: profile.qualifications,
        specializations: profile.specializations,
        languages: profile.languages,
        salary: profile.salary,
        country: profile.country,
        experiences: profile.experiences,
        totalExperienceYears: profile.totalExperienceYears,
        cv: profile.cv,
        certifications: profile.certifications,
        availabilityStatus: profile.availabilityStatus,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      });

      setRejectReason("");
      setShowProfileModal(true);
    } catch (error) {
      toast.error("Failed to fetch profile");
    }
  };

  const approveNutritionist = async (userId: string) => {
    try {
      await adminNotificationService.approveNutritionist(userId);
      toast.success("Nutritionist approved");
      // Mark action taken (visually hide buttons)
      setActionTakenProfiles(prev => [...prev, userId]); 
      // Mark notification as read if it exists
      setNotifications(prev => prev.map(n => (n.senderId === userId ? { ...n, read: true } : n)));
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
      // Mark action taken (visually hide buttons)
      setActionTakenProfiles(prev => [...prev, userId]);
      // Mark notification as read if it exists
      setNotifications(prev => prev.map(n => (n.senderId === userId ? { ...n, read: true } : n)));
      setShowProfileModal(false);
    } catch {
      toast.error("Failed to reject nutritionist");
    }
  };

  // Memoized filter for performance
  const filteredNotifications = useMemo(() => 
    notifications.filter(n => filter === "all" ? true : !n.read), 
    [notifications, filter]
  );

  // --- JSX Rendering (Refined UI) ---

  return (
    <div className="min-h-screen bg-gray-50 pt-[90px] px-4 md:px-8 lg:px-16 pb-12">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
          <Bell className="text-blue-600 w-8 h-8" />
          Admin Notifications
        </h1>
        <p className="text-gray-500 mt-1">Review and manage recent activities and nutritionist applications.</p>
      </header>

      {/* Search + Filter - Professional Look */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="border border-gray-300 pl-10 pr-4 py-2 rounded-xl w-full text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Search titles or messages..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="flex gap-3 bg-white p-1 rounded-xl shadow-inner border border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${filter === "all" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${filter === "unread" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center text-gray-500 py-16 text-lg">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Fetching notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
          <p className="text-xl font-medium text-gray-500">No notifications found under the current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotifications.map(n => (
            <div 
              key={n._id} 
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative border-l-4 ${!n.read ? "border-blue-600 hover:border-blue-700" : "border-gray-200"}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-bold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>{n.title}</h3>
                </div>
                
                <p className="text-gray-600 mt-1 mb-3 text-sm">{n.message}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">

                {/* Dropdown Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDropdown(n._id); }} 
                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="More options"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openDropdown === n._id && (
                    <div className="absolute right-0 top-9 bg-white rounded-xl shadow-2xl w-48 z-50 border border-gray-100 overflow-hidden transform origin-top-right animate-fade-in-down">
                      {!n.read && (
                        <button 
                          onClick={() => markAsRead(n._id)} 
                          className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50/70 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark as Read
                        </button>
                      )}
                      {n.senderId  && ( // Only show 'View Profile' for specific type
                        <button 
                          onClick={() => viewProfile(n.senderId!)} 
                          className="w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50/70 transition-colors flex items-center gap-2 border-t border-gray-100"
                        >
                          <Info className="w-4 h-4" /> View Applicant Profile
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button 
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-full text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-100 transition shadow-sm"
          >
            &larr; Previous
          </button>
          <span className="font-semibold text-gray-700 text-lg">Page {page} / {totalPages}</span>
          <button 
            disabled={page === totalPages || loading} 
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-full text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-100 transition shadow-sm"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Profile Modal - Significantly enhanced UI */}
      {showProfileModal && selectedProfile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative p-8 md:p-10 transform transition-all duration-300 scale-100">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors p-2 bg-gray-100 rounded-full" 
              onClick={() => setShowProfileModal(false)}
              aria-label="Close Profile"
            >
              <X size={24} />
            </button>

            {/* Profile Header */}
            <header className="flex flex-col sm:flex-row gap-6 border-b pb-6 mb-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <img 
                  src={selectedProfile.profileImage || "https://via.placeholder.com/150/007bff/ffffff?text=NP"} 
                  alt={`${selectedProfile.fullName}'s Profile`} 
                  className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-xl" 
                />
                <span 
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${selectedProfile.availabilityStatus === "available" ? "bg-green-500" : "bg-red-500"}`}
                  title={`Availability: ${selectedProfile.availabilityStatus?.toUpperCase() || "N/A"}`}
                ></span>
              </div>

              <div className="flex-1 pt-2">
                <h2 className="text-3xl font-extrabold text-gray-900">{selectedProfile.fullName}</h2>
                <p className="text-md text-blue-600 font-medium">{selectedProfile.email}</p>
                {selectedProfile.phone && <p className="text-gray-600 text-sm">{selectedProfile.phone}</p>}
                
                <p className="mt-2 text-sm font-semibold text-gray-700">
                  Application Status: 
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    actionTakenProfiles.includes(selectedProfile.userId) || selectedProfile.nutritionistStatus === 'approved' 
                    ? 'bg-green-100 text-green-700' 
                    : selectedProfile.nutritionistStatus === 'rejected' 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {actionTakenProfiles.includes(selectedProfile.userId) 
                      ? (selectedProfile.nutritionistStatus === 'approved' ? 'Approved' : 'Rejected') 
                      : selectedProfile.nutritionistStatus
                    }
                  </span>
                </p>
              </div>
            </header>

            <div className="space-y-6">
              {selectedProfile.bio && (
                <section>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-1">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedProfile.bio}</p>
                </section>
              )}

              {/* Professional Details Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Education/Qualifications */}
                {(selectedProfile.qualifications?.length ?? 0) > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">Qualifications</h3>
                    <ul className="list-disc ml-5 text-gray-600 space-y-1 text-sm">
                      {selectedProfile.qualifications?.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                )}

                {/* Specializations */}
                {(selectedProfile.specializations?.length ?? 0) > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.specializations?.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rates and Duration */}
                {selectedProfile.salary && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">salary</h3>
                    <p className="text-gray-700 text-lg font-semibold">₹{selectedProfile.salary.toLocaleString('en-IN')}</p>
                  </div>
                )}

                {/* Location and Languages */}
                {(selectedProfile.languages?.length ?? 0) > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">Languages</h3>
                    <p className="text-gray-700">{selectedProfile.languages?.join(", ")}</p>
                  </div>
                )}

                {selectedProfile.country && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">Location</h3>
                    <p className="text-gray-700">{selectedProfile.country}</p>
                  </div>
                )}
              </section>

              {/* Experience */}
              {(selectedProfile.experiences?.length ?? 0) > 0 && (
                <section>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1">Work Experience ({selectedProfile.totalExperienceYears} years total)</h3>
                  <ul className="space-y-3">
                    {selectedProfile.experiences?.map((exp, i) => (
                      <li key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">{exp.role}</p>
                        <p className="text-sm text-gray-600">{exp.organization} • {exp.years} {exp.years === 1 ? "year" : "years"}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Documents & Certifications */}
              <section className="flex flex-col md:flex-row gap-8 pt-4 border-t">
                {selectedProfile.cv && (
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">CV/Resume</h3>
                    <a href={selectedProfile.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors shadow-md">
                      View CV 
                    </a>
                  </div>
                )}
                
                {(selectedProfile.certifications?.length ?? 0) > 0 && (
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProfile.certifications?.map((c, i) => (
                        <a key={i} href={c} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition">
                          Certification {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Admin Actions */}
            {!actionTakenProfiles.includes(selectedProfile.userId) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Admin Decision</h3>
                
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 mt-3 focus:ring-4 focus:ring-red-100 focus:border-red-400 focus:outline-none transition-all"
                  rows={3}
                  placeholder="Enter rejection reason here (required for rejection)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => approveNutritionist(selectedProfile.userId)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                  >
                    <CheckCircle className="w-5 h-5" /> Approve Nutritionist
                  </button>
                  <button
                    onClick={() => rejectNutritionist(selectedProfile.userId)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300"
                  >
                    <XCircle className="w-5 h-5" /> Reject Applicant
                  </button>
                </div>
              </div>
            )}
            
            {/* Display action taken message if action was already done */}
            {actionTakenProfiles.includes(selectedProfile.userId) && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className={`text-center text-xl font-bold p-4 rounded-xl ${
                        selectedProfile.nutritionistStatus === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        Action already taken for this profile. Status: {selectedProfile.nutritionistStatus.toUpperCase()}
                    </p>
                </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}