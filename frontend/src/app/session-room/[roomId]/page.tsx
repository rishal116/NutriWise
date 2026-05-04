"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Video, Users, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function SessionRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  console.log("ROOM:", roomId);
  const router = useRouter();
  const jitsiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jitsiRef.current) return;

    let api: any;

    const loadScriptAndInit = () => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;

        script.onload = () => {
          initJitsi();
        };

        document.body.appendChild(script);
      } else {
        initJitsi();
      }
    };

    const initJitsi = () => {
      if (!jitsiRef.current) return;

      const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: roomId,
        parentNode: jitsiRef.current,

        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          requireDisplayName: false,
          enableWelcomePage: false,
        },

        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        },
      });
    };

    loadScriptAndInit();

    return () => {
      if (api) api.dispose();
    };
  }, [roomId]);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      {/* 🔹 Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Video className="text-emerald-400" />
          <h1 className="font-bold text-lg tracking-tight">
            Live Nutrition Session
          </h1>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Live Room</span>
          </div>

          <button
            onClick={() => router.push("/nutritionist/session")}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl text-white font-semibold transition"
          >
            <ArrowLeft size={16} />
            Leave
          </button>
        </div>
      </div>

      {/* 🔹 Video Area */}
      <div className="flex-1 relative">
        <div
          ref={jitsiRef}
          className="absolute inset-0 rounded-none overflow-hidden"
        />
      </div>
    </div>
  );
}
