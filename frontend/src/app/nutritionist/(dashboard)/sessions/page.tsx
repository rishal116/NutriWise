"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Video, Calendar, User, Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import { nutritionistMeetService } from "@/services/nutritionist/nutritionistMeet.service";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";

interface Meeting {
  id: string;
  title: string;
  roomId: string;
  userName: string;
  scheduledAt: string;
}

export default function NutritionistMeetings() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingUserId, setNewMeetingUserId] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await nutritionistMeetService.getMeetings();
      const meetingArray = res.data ?? res;
      const formatted: Meeting[] = meetingArray.map((m: any) => ({
        id: m.id,
        title: m.title,
        roomId: m.roomId,
        userName: m.user?.name ?? "Client",
        scheduledAt: m.scheduledAt,
      }));
      setMeetings(formatted);
    } catch (err) {
      setError("Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  };

  const getClients = async () => {
    try {
      const res = await nutritionistSubscriptionService.getSubscriptions();
      setClients(res.data ?? []);
    } catch (err) {
      console.error("Failed to load clients.");
    }
  };

  useEffect(() => {
    getClients();
    fetchMeetings();
  }, []);

  const createMeeting = async () => {
    if (!newMeetingTitle || !newMeetingUserId || !newMeetingDate) return;
    try {
      setIsCreating(true);
      const newMeeting = await nutritionistMeetService.createMeeting(
        newMeetingTitle,
        newMeetingUserId,
        newMeetingDate
      );
      setMeetings((prev) => [...prev, newMeeting]);
      setShowModal(false);
      setNewMeetingTitle("");
      setNewMeetingUserId("");
      setNewMeetingDate("");
    } catch (err) {
      alert("Failed to create meeting.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfdfc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Consultation <span className="text-emerald-600">Sessions</span>
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Manage your virtual clinic and client appointments.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all active:scale-95"
          >
            <Plus size={20} />
            Schedule Meeting
          </button>
        </div>

        {/* --- STATES --- */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching your schedule...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertCircle size={24} />
              <p className="font-semibold">{error}</p>
            </div>
            <button onClick={fetchMeetings} className="bg-white px-4 py-2 rounded-xl shadow-sm text-rose-700 font-bold hover:bg-rose-100 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* --- MEETING GRID --- */}
        {!loading && !error && (
          <>
            {meetings.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-emerald-100 rounded-3xl p-16 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No upcoming calls</h3>
                <p className="text-gray-500 mt-2 max-w-xs mx-auto">You haven't scheduled any sessions yet. Start by inviting a client.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((m) => (
                  <div key={m.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50/50 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Video size={24} />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1">{m.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <User size={16} className="text-teal-500" />
                        <span className="text-sm font-medium">{m.userName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock size={16} className="text-teal-500" />
                        <span className="text-sm font-medium">
                          {new Date(m.scheduledAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/video-call/${m.roomId}`)}
                      className="w-full bg-gray-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Enter Room
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* --- CREATE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">New Session</h3>
                <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              <p className="text-emerald-100 mt-2 opacity-90">Set up a secure video consultation.</p>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g., Weekly Follow-up"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Select Client</label>
                <select
                  value={newMeetingUserId}
                  onChange={(e) => setNewMeetingUserId(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium appearance-none"
                >
                  <option value="">Choose from active subscribers</option>
                  {clients.filter(c => c.status === "ACTIVE").map(c => (
                    <option key={c.user.id} value={c.user.id}>{c.user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={createMeeting}
                  disabled={!newMeetingTitle || !newMeetingUserId || !newMeetingDate || isCreating}
                  className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  {isCreating ? "Saving..." : "Confirm Schedule"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}