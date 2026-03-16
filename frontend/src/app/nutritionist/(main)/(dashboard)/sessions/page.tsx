"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Video, Calendar, User, Clock, AlertCircle,
  RefreshCw, ChevronRight, Mic, CalendarDays,
} from "lucide-react";

import { nutritionistMeetService } from "@/services/nutritionist/nutritionistMeet.service";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";

interface Meeting {
  id: string;
  title: string;
  roomId: string;
  userId: string;
  userName: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  type: "video" | "audio";
}

export default function NutritionistMeetings() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingUserId, setNewMeetingUserId] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState<"video" | "audio">("video");
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mRes, cRes] = await Promise.all([
        nutritionistMeetService.getMeetings(),
        nutritionistSubscriptionService.getSubscriptions()
      ]);
      
      const meetingArray = mRes.data ?? mRes;
      setMeetings(meetingArray.map((m: any) => ({
        id: m._id || m.id,
        title: m.title,
        roomId: m.roomId,
        userId: m.userId,
        userName: m.user?.name ?? "Client",
        scheduledAt: m.scheduledAt,
        durationInMinutes: m.durationInMinutes,
        status: m.status,
        type: m.type,
      })));
      setClients(cRes.data ?? []);
    } catch (err) {
      setError("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const createMeeting = async () => {
    if (!newMeetingTitle || !newMeetingUserId || !newMeetingDate) return;
    try {
      setIsCreating(true);
      const res = await nutritionistMeetService.createMeeting({
        title: newMeetingTitle,
        userId: newMeetingUserId,
        scheduledAt: newMeetingDate,
        durationInMinutes: duration,
        type,
      });
      fetchData(); // Refresh list
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Error creating session.");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewMeetingTitle("");
    setNewMeetingUserId("");
    setNewMeetingDate("");
    setDuration(30);
  };

  return (
    <div className="space-y-8 lg:space-y-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Consultation <span className="text-emerald-600">Sessions</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your client appointments and virtual clinic.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold">Schedule Session</span>
        </button>
      </div>

      {/* --- CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
          <RefreshCw className="animate-spin text-emerald-600 mb-4" size={32} />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Syncing Calendar...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 p-10 rounded-[2.5rem] text-center shadow-sm">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
          <h3 className="text-slate-900 font-bold text-lg">{error}</h3>
          <button onClick={fetchData} className="mt-4 text-emerald-600 font-bold hover:underline">Try Again</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {meetings.map((m) => (
            <div key={m.id} className="group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${m.type === 'video' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {m.type === "video" ? <Video size={22} /> : <Mic size={22} />}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${
                  m.status === 'ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {m.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-5 line-clamp-2 h-[3.5rem]">
                {m.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                    {m.userName.charAt(0)}
                  </div>
                  <span className="font-bold text-sm">{m.userName}</span>
                </div>
                
                <div className="flex items-center justify-between px-1 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" />
                    {new Date(m.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" />
                    {new Date(m.scheduledAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/video-call/${m.roomId}`)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-emerald-600 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-emerald-200"
              >
                Join Session
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex justify-center items-start p-4 pt-20 md:pt-32 overflow-y-auto bg-slate-900/40 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-300 mb-10">
            <div className="p-8 md:p-10 space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-black text-slate-900">New Appointment</h2>
                <p className="text-slate-400 text-sm font-medium">Fill in the session details below</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Session Title</label>
                <input
                  placeholder="e.g. Monthly Nutrition Audit"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-400 focus:bg-white p-4 rounded-2xl transition-all outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Client</label>
                  <select
                    value={newMeetingUserId}
                    onChange={(e) => setNewMeetingUserId(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none appearance-none font-medium text-slate-600 cursor-pointer"
                  >
                    <option value="">Select User</option>
                    {clients.map(c => <option key={c.user.id} value={c.user.id}>{c.user.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none appearance-none font-medium text-slate-600 cursor-pointer"
                  >
                    <option value="video">Video Call</option>
                    <option value="audio">Audio Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newMeetingDate}
                    onChange={(e) => setNewMeetingDate(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-medium text-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Duration</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-medium text-slate-600"
                    placeholder="Minutes"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-4 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createMeeting}
                  disabled={isCreating}
                  className="flex-1 bg-[#86d2b1] hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Scheduling..." : "Create Session"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}