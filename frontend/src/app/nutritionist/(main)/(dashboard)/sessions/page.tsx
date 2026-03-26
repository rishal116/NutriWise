"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus, Video, Calendar, Clock, AlertCircle, RefreshCw,
  ChevronRight, Mic, X, Timer, Inbox, Users, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { nutritionistMeetService } from "@/services/nutritionist/nutritionistMeet.service";
import { nutritionistSubscriptionService } from "@/services/nutritionist/nutritionistSubscription.service";

// --- Types ---
type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

export default function NutritionistMeetings() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "history">("upcoming");

  // Scheduling State
  const [isCreating, setIsCreating] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "", userId: "", date: "", duration: 30, type: "video" as "video" | "audio"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, cRes]: any = await Promise.allSettled([
        nutritionistMeetService.getMeetings(),
        nutritionistSubscriptionService.getSubscribers()
      ]);
      const mData = mRes.status === 'fulfilled' ? (mRes.value.data ?? mRes.value) : [];
      const cData = cRes.status === 'fulfilled' ? (cRes.value.data ?? cRes.value) : [];
      setMeetings(mData);
      setClients(cData);
    } catch (err) {
      toast.error("Calendar sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (activeTab === "ongoing") return m.status === "ongoing";
      if (activeTab === "upcoming") return m.status === "scheduled";
      return m.status === "completed" || m.status === "cancelled";
    });
  }, [meetings, activeTab]);

  return (
    <div className="min-h-screen bg-[#fcfdfc] pb-32">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        
        {/* --- HERO HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Calendar size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Professional Schedule</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              Consultation <span className="text-emerald-500">Hub</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">You have {meetings.filter(m => m.status === 'scheduled').length} sessions booked this week.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-5 rounded-[2rem] transition-all shadow-xl shadow-slate-200 font-black text-sm group active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Schedule New Session
          </button>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-[1.5rem] w-fit mb-10 border border-emerald-50 shadow-sm sticky top-24 z-30 backdrop-blur-md bg-white/80">
          {(['upcoming', 'ongoing', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredMeetings.map((m) => (
                <SessionCard key={m.id} meeting={m} router={router} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredMeetings.length === 0 && <EmptyState tab={activeTab} />}
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <ScheduleModal 
            clients={clients} 
            onClose={() => setShowModal(false)} 
            refresh={fetchData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SessionCard({ meeting, router }: { meeting: any, router: any }) {
  const isOngoing = meeting.status === "ongoing";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-[2.5rem] border border-emerald-50 p-8 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all flex flex-col justify-between border-b-4 border-b-transparent hover:border-b-emerald-500"
    >
      <div className="relative">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${meeting.type === 'video' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
            {meeting.type === 'video' ? <Video size={24} /> : <Mic size={24} />}
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            isOngoing ? "bg-emerald-500 text-white border-emerald-400 animate-pulse" : "bg-slate-50 text-slate-400 border-slate-100"
          }`}>
            {meeting.status}
          </div>
        </div>
        
        <h3 className="font-black text-xl mb-2 text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
          {meeting.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">
            {meeting.userName?.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Client</p>
            <p className="text-sm font-bold text-slate-700">{meeting.userName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50">
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-300 uppercase">Date</p>
            <p className="text-[11px] font-black text-slate-700">{new Date(meeting.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="text-center border-x border-slate-50">
            <p className="text-[8px] font-black text-slate-300 uppercase">Start</p>
            <p className="text-[11px] font-black text-slate-700">{new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-300 uppercase">Mins</p>
            <p className="text-[11px] font-black text-emerald-600">{meeting.durationInMinutes}</p>
          </div>
        </div>

        <button
          onClick={() => router.push(`/video-call/${meeting.roomId}`)}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${
            isOngoing ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white"
          }`}
        >
          {isOngoing ? "Join Meeting" : "Start Session"}
          <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function ScheduleModal({ clients, onClose, refresh }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden p-10 relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-colors">
          <X size={20} className="text-slate-400" />
        </button>

        <h2 className="text-3xl font-black text-slate-900 mb-8">Schedule <span className="text-emerald-500">Session</span></h2>
        
        <div className="space-y-6">
          <InputGroup label="Session Title" placeholder="e.g. Monthly Health Audit" />
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Target Client</label>
              <select className="w-full bg-slate-50 border-none p-5 rounded-[1.5rem] font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>Choose Client</option>
                {clients.map((c: any) => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Medium</label>
              <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem]">
                <button className="flex-1 py-3.5 bg-white shadow-sm rounded-2xl text-[10px] font-black uppercase text-emerald-600">Video</button>
                <button className="flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase text-slate-400">Audio</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <InputGroup label="Date & Time" type="datetime-local" />
            <InputGroup label="Duration (Mins)" type="number" placeholder="30" />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all mt-4">
            Confirm & Schedule
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InputGroup({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
      <input 
        {...props}
        className="w-full bg-slate-50 border-none p-5 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="py-40 flex flex-col items-center">
      <div className="w-14 h-14 border-4 border-emerald-50 border-t-emerald-500 rounded-full animate-spin" />
      <p className="mt-6 text-[10px] font-black text-emerald-800 uppercase tracking-[0.4em]">Syncing Calendar</p>
    </div>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="bg-white rounded-[3rem] py-32 text-center border border-emerald-50 shadow-sm">
      <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
        <Inbox size={40} className="text-emerald-200" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">No {tab} sessions</h3>
      <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2 text-sm">Your schedule is currently clear. Why not reach out to a client and book a check-in?</p>
    </div>
  );
}