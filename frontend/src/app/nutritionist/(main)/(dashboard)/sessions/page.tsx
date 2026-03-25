"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus, Video, Calendar, Clock, AlertCircle, RefreshCw,
  ChevronRight, Mic, X, Timer, Inbox, Users
} from "lucide-react";

import { nutritionistMeetService } from "@/services/nutritionist/nutritionistMeet.service";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";

// --- Types ---
type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

interface Meeting {
  id: string;
  title: string;
  roomId: string;
  userId: string;
  userName: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: SessionStatus;
  type: "video" | "audio";
}

interface Client {
  id: string;
  name: string;
}

export default function NutritionistMeetings() {
  const router = useRouter();
  const firstInputRef = useRef<HTMLInputElement>(null);

  // State
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "history">("upcoming");
  const [visibleCount, setVisibleCount] = useState(6);

  const [newMeeting, setNewMeeting] = useState({
    title: "", userId: "", date: "", duration: 30, type: "video" as "video" | "audio"
  });

  const handleInputChange = (field: string, value: any) => {
    setNewMeeting((prev) => ({ ...prev, [field]: value }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, cRes] = await Promise.allSettled([
        nutritionistMeetService.getMeetings(),
        nutritionistSubscriptionService.getSubscribers()
      ]);

      const mData = mRes.status === 'fulfilled' ? (mRes.value.data ?? mRes.value) : [];
      const cData = cRes.status === 'fulfilled' ? (Array.isArray(cRes.value) ? cRes.value : cRes.value.data || []) : [];

      setMeetings(mData.map((m: any) => ({
        id: m.id ?? m._id,
        title: m.title,
        roomId: m.roomId,
        userId: m.user?.id,
        userName: m.user?.fullName ?? "Client",
        scheduledAt: m.scheduledAt,
        durationInMinutes: m.durationInMinutes || 0,
        status: m.status,
        type: m.type,
      })));

      setClients(cData.map((c: any) => ({ id: c.id ?? c._id, name: c.name })));
    } catch (err) {
      toast.error("Dashboard sync failed");
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async () => {
    const { title, userId, date, duration, type } = newMeeting;
    if (!title.trim() || !userId || !date) return toast.error("Missing required fields");
    
    try {
      setIsCreating(true);
      await nutritionistMeetService.createMeeting({
        title, userId, scheduledAt: date, durationInMinutes: duration, type,
      });
      toast.success("Session scheduled!");
      await fetchData();
      setShowModal(false);
      setNewMeeting({ title: "", userId: "", date: "", duration: 30, type: "video" });
    } catch (err) {
      toast.error("Failed to create meeting");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (activeTab === "ongoing") return m.status === "ongoing";
      if (activeTab === "upcoming") return m.status === "scheduled";
      return m.status === "completed" || m.status === "cancelled";
    }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [meetings, activeTab]);

  const paginatedMeetings = filteredMeetings.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800">
              Consultation <span className="text-emerald-600">Hub</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage your professional schedule</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 font-bold active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Schedule Session
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-8 border border-slate-200/50">
          {(['upcoming', 'ongoing', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setVisibleCount(6); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LISTING */}
        {loading ? (
          <div className="flex flex-col items-center py-40">
            <RefreshCw className="animate-spin text-emerald-500 mb-4" size={32} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Calendar...</p>
          </div>
        ) : paginatedMeetings.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] py-24 text-center border border-slate-100 shadow-sm">
            <Inbox className="mx-auto text-slate-200 mb-4" size={50} />
            <h3 className="text-xl font-bold text-slate-400">No {activeTab} sessions found</h3>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMeetings.map((m) => (
                <SessionCard key={m.id} meeting={m} router={router} />
              ))}
            </div>
            {filteredMeetings.length > visibleCount && (
              <div className="flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-10 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-900">Schedule <span className="text-emerald-600">Session</span></h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Title</label>
                <input
                  ref={firstInputRef}
                  placeholder="e.g., Weekly Nutrition Review"
                  value={newMeeting.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 p-4 rounded-2xl outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client</label>
                  <select
                    value={newMeeting.userId}
                    onChange={(e) => handleInputChange("userId", e.target.value)}
                    className="w-full bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 p-4 rounded-2xl outline-none font-semibold text-sm appearance-none"
                  >
                    <option value="">Choose Client</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl ring-1 ring-slate-100">
                    <button 
                      onClick={() => handleInputChange("type", "video")}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newMeeting.type === 'video' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                    >Video</button>
                    <button 
                      onClick={() => handleInputChange("type", "audio")}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newMeeting.type === 'audio' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
                    >Audio</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full bg-slate-50 ring-1 ring-slate-100 p-4 rounded-2xl outline-none font-bold text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                  <div className="relative">
                    <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                      type="number"
                      value={newMeeting.duration}
                      onChange={(e) => handleInputChange("duration", Number(e.target.value))}
                      className="w-full bg-slate-50 ring-1 ring-slate-100 pl-10 pr-4 py-4 rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={createMeeting}
                  disabled={isCreating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 transition-all disabled:opacity-50"
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

function SessionCard({ meeting, router }: { meeting: Meeting, router: any }) {
  const isInactive = meeting.status === "completed" || meeting.status === "cancelled";
  
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all flex flex-col justify-between hover:-translate-y-1 duration-300">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${meeting.type === 'video' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
            {meeting.type === 'video' ? <Video size={20} /> : <Mic size={20} />}
          </div>
          <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-lg border tracking-wider
            ${meeting.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse' : 
              meeting.status === 'completed' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-blue-50 text-blue-600'}`}>
            {meeting.status}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">{meeting.title}</h3>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[10px] border border-emerald-100">
            {meeting.userName.charAt(0)}
          </div>
          <span className="text-sm font-bold text-slate-600">{meeting.userName}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div className="text-center">
            <p className="text-[8px] uppercase font-black text-slate-400">Date</p>
            <p className="text-xs font-bold text-slate-700">{new Date(meeting.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[8px] uppercase font-black text-slate-400">Time</p>
            <p className="text-xs font-bold text-slate-700">{new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[8px] uppercase font-black text-slate-400">Mins</p>
            <p className="text-xs font-bold text-emerald-600">{meeting.durationInMinutes}</p>
          </div>
        </div>

        <button
          onClick={() => router.push(`/video-call/${meeting.roomId}`)}
          disabled={isInactive}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-30 font-bold text-sm shadow-md"
        >
          {meeting.status === 'ongoing' ? 'Join Ongoing Session' : 'Start Session'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}