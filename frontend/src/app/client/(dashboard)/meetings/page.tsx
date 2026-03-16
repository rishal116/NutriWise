"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userMeetService } from "@/services/user/userMeet.service";
import { 
  Video, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  VideoOff,
  Plus
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  roomId: string;
  scheduledAt: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  userId: string;
  nutritionist: {
    fullName: string;
    email: string;
  };
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await userMeetService.getMeetings();
      setMeetings(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching meetings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (roomId: string) => {
    router.push(`/video-call/${roomId}`);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-amber-50 text-amber-600 border-amber-100";
      case "ongoing": return "bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse";
      case "completed": return "bg-slate-50 text-slate-500 border-slate-100";
      case "cancelled": return "bg-red-50 text-red-500 border-red-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Consultation Hub</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My <span className="text-emerald-600">Meetings</span></h1>
        </div>
      </div>

      {meetings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="group bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
            >
              <div className="flex gap-5">
                {/* Date Icon Badge */}
                <div className="shrink-0 w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-tighter leading-none">
                    {new Date(meeting.scheduledAt).toLocaleDateString(undefined, { month: 'short' })}
                  </span>
                  <span className="text-xl font-black leading-none mt-0.5">
                    {new Date(meeting.scheduledAt).getDate()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                      {meeting.title}
                    </h2>
                    <span className={`px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border rounded-full ${getStatusStyles(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                      <User size={13} className="text-emerald-500" />
                      {meeting.nutritionist.fullName}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                      <Clock size={13} className="text-emerald-500" />
                      {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              {(meeting.status === "scheduled" || meeting.status === "ongoing") ? (
                <button
                  onClick={() => handleJoin(meeting.roomId)}
                  className="w-full md:w-auto bg-slate-900 text-white group-hover:bg-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-slate-100 group-hover:shadow-emerald-100 transition-all"
                >
                  Join Meeting
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              ) : (
                <div className="px-6 py-3 bg-slate-50 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Session Ended
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Retrieving Sessions...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-16 text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <VideoOff size={32} className="text-slate-200" />
      </div>
      <h3 className="text-xl font-black text-slate-800">No Meetings Yet</h3>
      <p className="text-sm text-slate-400 font-bold mt-2">
        Scheduled consultations with your nutritionist will appear here.
      </p>
    </div>
  );
}