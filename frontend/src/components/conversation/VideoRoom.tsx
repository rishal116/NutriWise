"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Room,
  RoomEvent,
  Track,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack,
  DataPacket_Kind,
  LocalParticipant,
  Participant,
  ParticipantEvent,
  TrackPublication,
} from "livekit-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageCircle,
  Monitor,
  MonitorOff,
  Users,
  Hand,
  Circle,
  StopCircle,
  Send,
  X,
  Clock,
  ChevronRight,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  Volume2,
} from "lucide-react";
import { LIVEKIT_URL } from "@/lib/livekit";
import { api } from "@/lib/axios/api";

/* ─── Types ──────────────────────────────────────────────────────────────────── */

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
};

type DataMsg =
  | { type: "chat"; payload: Omit<ChatMessage, "id"> }
  | { type: "raise_hand"; payload: { identity: string; name: string; raised: boolean } }
  | { type: "waiting_room_request"; payload: { identity: string; name: string } }
  | { type: "waiting_room_approved"; payload: { identity: string } }
  | { type: "waiting_room_denied"; payload: { identity: string } };

type WaitingUser = { identity: string; name: string };

type Panel = "chat" | "participants" | null;

/* ─── Encode / Decode helpers ────────────────────────────────────────────────── */

const encode = (data: DataMsg): Uint8Array =>
  new TextEncoder().encode(JSON.stringify(data));

const decode = (data: Uint8Array): DataMsg | null => {
  try {
    return JSON.parse(new TextDecoder().decode(data)) as DataMsg;
  } catch {
    return null;
  }
};

/* ─── Speaking indicator hook ────────────────────────────────────────────────── */

function useSpeakers(room: Room | null): Set<string> {
  const [speakers, setSpeakers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!room) return;
    const update = () => {
      const active = new Set(
        room.activeSpeakers.map((p) => p.identity),
      );
      setSpeakers(active);
    };
    room.on(RoomEvent.ActiveSpeakersChanged, update);
    return () => { room.off(RoomEvent.ActiveSpeakersChanged, update); };
  }, [room]);

  return speakers;
}

/* ─── Participant tile ───────────────────────────────────────────────────────── */

function ParticipantTile({
  identity,
  name,
  isSpeaking,
  isLocal,
  isHandRaised,
  videoRef,
}: {
  identity: string;
  name: string;
  isSpeaking: boolean;
  isLocal?: boolean;
  isHandRaised?: boolean;
  videoRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#111827] aspect-video transition-all duration-200 ${
        isSpeaking ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b0f1a]" : ""
      }`}
    >
      <div ref={videoRef} className="w-full h-full" />

      {/* Avatar fallback shown behind video */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-300">
          {name?.[0]?.toUpperCase() ?? "?"}
        </div>
      </div>

      {/* Name tag */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
        {isSpeaking && (
          <span className="flex items-center gap-1 bg-emerald-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            <Volume2 size={8} />
          </span>
        )}
        <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
          {name}{isLocal ? " (You)" : ""}
        </span>
      </div>

      {/* Hand raised */}
      {isHandRaised && (
        <div className="absolute top-2 right-2 z-10 bg-amber-400 text-amber-900 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-lg animate-bounce">
          ✋
        </div>
      )}
    </div>
  );
}

/* ─── Waiting room panel ─────────────────────────────────────────────────────── */

function WaitingRoomPanel({
  users,
  onApprove,
  onDeny,
}: {
  users: WaitingUser[];
  onApprove: (identity: string) => void;
  onDeny: (identity: string) => void;
}) {
  if (users.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-50 bg-[#1a1f2e] border border-white/10 rounded-2xl p-4 w-72 shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={13} className="text-amber-400" />
        <span className="text-xs font-bold text-white uppercase tracking-widest">
          Waiting Room
        </span>
        <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
          {users.length}
        </span>
      </div>
      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.identity}
            className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {u.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-white font-medium flex-1 truncate">
              {u.name}
            </span>
            <button
              onClick={() => onApprove(u.identity)}
              className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-colors"
            >
              <CheckCircle2 size={13} className="text-white" />
            </button>
            <button
              onClick={() => onDeny(u.identity)}
              className="w-7 h-7 rounded-lg bg-rose-500/80 hover:bg-rose-500 flex items-center justify-center transition-colors"
            >
              <XCircle size={13} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */

export default function VideoRoom({
  roomId,
  isHost = true,
}: {
  roomId: string;
  isHost?: boolean;
}) {
  const roomRef = useRef<Room | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteContainerRef = useRef<HTMLDivElement | null>(null);

  // Media state
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [connected, setConnected] = useState(false);

  // UI state
  const [panel, setPanel] = useState<Panel>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [handRaised, setHandRaised] = useState(false);
  const [waitingUsers, setWaitingUsers] = useState<WaitingUser[]>([]);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unread, setUnread] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recording
  const [recording, setRecording] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);

  // Waiting room (for non-hosts)
  const [waitingApproval, setWaitingApproval] = useState(!isHost);

  const speakers = useSpeakers(roomRef.current);

  // ── Send data channel message ─────────────────────────────────────────────

  const sendData = useCallback((msg: DataMsg) => {
    roomRef.current?.localParticipant.publishData(encode(msg), {
      reliable: true,
      kind: DataPacket_Kind.RELIABLE,
    });
  }, []);

  // ── Chat ──────────────────────────────────────────────────────────────────

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text || !roomRef.current) return;
    const local = roomRef.current.localParticipant;
    const msg: Omit<ChatMessage, "id"> = {
      senderId: local.identity,
      senderName: local.name ?? local.identity,
      text,
      timestamp: Date.now(),
    };
    sendData({ type: "chat", payload: msg });
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }]);
    setChatInput("");
  };

  // ── Raise hand ────────────────────────────────────────────────────────────

  const toggleHand = () => {
    if (!roomRef.current) return;
    const local = roomRef.current.localParticipant;
    const raised = !handRaised;
    setHandRaised(raised);
    sendData({
      type: "raise_hand",
      payload: { identity: local.identity, name: local.name ?? local.identity, raised },
    });
  };

  // ── Waiting room actions (host only) ──────────────────────────────────────

  const approveUser = (identity: string) => {
    sendData({ type: "waiting_room_approved", payload: { identity } });
    setWaitingUsers((prev) => prev.filter((u) => u.identity !== identity));
  };

  const denyUser = (identity: string) => {
    sendData({ type: "waiting_room_denied", payload: { identity } });
    setWaitingUsers((prev) => prev.filter((u) => u.identity !== identity));
  };

  // ── Recording ─────────────────────────────────────────────────────────────

  const toggleRecording = async () => {
    setRecordingLoading(true);
    try {
      if (recording) {
        await api.post("/livekit/egress/stop", { roomId });
        setRecording(false);
      } else {
        await api.post("/livekit/egress/start", { roomId });
        setRecording(true);
      }
    } catch (err) {
      console.error("Recording error:", err);
    } finally {
      setRecordingLoading(false);
    }
  };

  // ── Screen share ──────────────────────────────────────────────────────────

  const toggleScreenShare = async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      if (screenSharing) {
        await room.localParticipant.setScreenShareEnabled(false);
        setScreenSharing(false);
      } else {
        await room.localParticipant.setScreenShareEnabled(true);
        setScreenSharing(true);
      }
    } catch (err) {
      console.error("Screen share error:", err);
      setScreenSharing(false);
    }
  };

  // ── Toggle mic / camera ───────────────────────────────────────────────────

  const toggleMic = async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !micEnabled;
    await room.localParticipant.setMicrophoneEnabled(next);
    setMicEnabled(next);
  };

  const toggleCamera = async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !cameraEnabled;
    await room.localParticipant.setCameraEnabled(next);
    setCameraEnabled(next);
  };

  const leaveRoom = () => {
    roomRef.current?.disconnect();
    window.history.back();
  };

  // ── Main room setup ───────────────────────────────────────────────────────

  useEffect(() => {
    let room: Room;

    const start = async () => {
      try {
        const { data } = await api.get("/livekit/token", { params: { roomId } });
        if (!data?.token) throw new Error("Missing token");

        room = new Room({ adaptiveStream: true, dynacast: true });
        roomRef.current = room;

        // ── Data channel ────────────────────────────────────────────────────
        room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
          const msg = decode(payload);
          if (!msg) return;

          if (msg.type === "chat") {
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), ...msg.payload },
            ]);
            setUnread((n) => (panel === "chat" ? 0 : n + 1));
          }

          if (msg.type === "raise_hand") {
            setRaisedHands((prev) => {
              const next = new Set(prev);
              if (msg.payload.raised) next.add(msg.payload.identity);
              else next.delete(msg.payload.identity);
              return next;
            });
          }

          if (msg.type === "waiting_room_request" && isHost) {
            setWaitingUsers((prev) => [...prev, msg.payload]);
          }

          if (msg.type === "waiting_room_approved") {
            const local = room.localParticipant;
            if (msg.payload.identity === local.identity) {
              setWaitingApproval(false);
            }
          }

          if (msg.type === "waiting_room_denied") {
            const local = room.localParticipant;
            if (msg.payload.identity === local.identity) {
              room.disconnect();
              window.history.back();
            }
          }
        });

        // ── Remote tracks ───────────────────────────────────────────────────
        const attachRemote = (
          track: RemoteTrack,
          participant: RemoteParticipant,
        ) => {
          if (track.kind !== Track.Kind.Video) return;
          if (!remoteContainerRef.current) return;

          const existing = remoteContainerRef.current.querySelector(
            `[data-identity="${participant.identity}"]`,
          );
          const wrapper = existing ?? document.createElement("div");

          if (!existing) {
            (wrapper as HTMLElement).dataset.identity = participant.identity;
            (wrapper as HTMLElement).className =
              "relative rounded-2xl overflow-hidden bg-[#111827] aspect-video";
            remoteContainerRef.current.appendChild(wrapper);
          }

          const el = track.attach();
          el.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0;";

          const nameTag = document.createElement("div");
          nameTag.style.cssText =
            "position:absolute;bottom:8px;left:8px;color:white;font-size:11px;font-weight:600;background:rgba(0,0,0,0.6);padding:2px 8px;border-radius:999px;backdrop-filter:blur(4px);z-index:10;";
          nameTag.textContent = participant.name ?? participant.identity;

          wrapper.appendChild(el);
          wrapper.appendChild(nameTag);
        };

        room.on(
          RoomEvent.TrackSubscribed,
          (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
            attachRemote(track, participant);
          },
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
            track.detach().forEach((el) => el.remove());
            const wrapper = remoteContainerRef.current?.querySelector(
              `[data-identity="${participant.identity}"]`,
            );
            if (wrapper && wrapper.querySelectorAll("video").length === 0)
              wrapper.remove();
          },
        );

        room.on(RoomEvent.ParticipantDisconnected, (p: RemoteParticipant) => {
          remoteContainerRef.current
            ?.querySelector(`[data-identity="${p.identity}"]`)
            ?.remove();
          setParticipantCount((n) => Math.max(0, n - 1));
        });

        room.on(RoomEvent.ParticipantConnected, () => {
          setParticipantCount(room.remoteParticipants.size + 1);
        });

        // ── Connect ─────────────────────────────────────────────────────────
        await room.connect(LIVEKIT_URL, data.token);
        setConnected(true);
        setParticipantCount(room.remoteParticipants.size + 1);

        // ── If not host, request to join waiting room ────────────────────────
        if (!isHost) {
          const local = room.localParticipant;
          // Give host 500ms to subscribe to data channel
          setTimeout(() => {
            room.localParticipant.publishData(
              encode({
                type: "waiting_room_request",
                payload: { identity: local.identity, name: local.name ?? local.identity },
              }),
              { reliable: true, kind: DataPacket_Kind.RELIABLE },
            );
          }, 500);
        } else {
          setWaitingApproval(false);
        }

        // ── Local video ──────────────────────────────────────────────────────
        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);

        const localVideoTrack = room.localParticipant
          .getTrackPublications()
          .find((pub) => pub.track?.kind === Track.Kind.Video)?.track;

        if (localVideoTrack && localVideoRef.current) {
          const el = localVideoTrack.attach();
          el.style.cssText =
            "width:100%;height:100%;object-fit:cover;display:block;transform:scaleX(-1);";
          localVideoRef.current.appendChild(el);
        }
      } catch (err) {
        console.error("LiveKit error:", err);
      }
    };

    start();

    return () => {
      room?.disconnect();
      if (localVideoRef.current) localVideoRef.current.innerHTML = "";
      if (remoteContainerRef.current) remoteContainerRef.current.innerHTML = "";
    };
  }, [roomId, isHost]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear unread when chat opens
  useEffect(() => {
    if (panel === "chat") setUnread(0);
  }, [panel]);

  const togglePanel = (p: Panel) => setPanel((prev) => (prev === p ? null : p));

  /* ─── Waiting room screen ─────────────────────────────────────────────── */

  if (waitingApproval) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center gap-6 text-white">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Clock size={28} className="text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Waiting for approval</h2>
          <p className="text-sm text-slate-400 max-w-xs">
            The host will let you in shortly. Please wait.
          </p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <button
          onClick={() => window.history.back()}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-4"
        >
          Cancel and go back
        </button>
      </div>
    );
  }

  /* ─── Main room UI ────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col overflow-hidden">

      {/* Waiting room panel (host only) */}
      {isHost && (
        <WaitingRoomPanel
          users={waitingUsers}
          onApprove={approveUser}
          onDeny={denyUser}
        />
      )}

      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          {recording && (
            <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
              <Circle size={7} className="fill-rose-500 animate-pulse" />
              Recording
            </span>
          )}
          {connected ? (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
              <Wifi size={11} />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
              <WifiOff size={11} />
              Connecting…
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
          <Users size={12} />
          {participantCount} participant{participantCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video area */}
        <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">

          {/* Remote participants */}
          <div
            ref={remoteContainerRef}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
          />

          {/* Local tile */}
          <div className="relative rounded-2xl overflow-hidden bg-[#111827] aspect-video max-w-xs">
            <div ref={localVideoRef} className="w-full h-full" />
           
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-10">
              {speakers.has(roomRef.current?.localParticipant.identity ?? "") && (
                <span className="bg-emerald-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  <Volume2 size={8} />
                </span>
              )}
              <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                You
              </span>
            </div>
            {handRaised && (
              <div className="absolute top-2 right-2 text-sm bg-amber-400 rounded-full w-7 h-7 flex items-center justify-center animate-bounce">
                ✋
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        {panel && (
          <div className="w-72 border-l border-white/5 bg-[#0f1422] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                {panel === "chat" ? "Chat" : "Participants"}
              </span>
              <button
                onClick={() => setPanel(null)}
                className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={13} className="text-slate-400" />
              </button>
            </div>

            {/* Chat panel */}
            {panel === "chat" && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                      <MessageCircle size={20} className="text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">No messages yet</p>
                    </div>
                  )}
                  {messages.map((m) => {
                    const isOwn =
                      m.senderId === roomRef.current?.localParticipant.identity;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
                      >
                        {!isOwn && (
                          <span className="text-[10px] text-slate-500 font-medium px-1">
                            {m.senderName}
                          </span>
                        )}
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                            isOwn
                              ? "bg-emerald-600 text-white rounded-br-sm"
                              : "bg-white/8 text-slate-200 rounded-bl-sm"
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[9px] text-slate-600 px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-white/5">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      placeholder="Type a message…"
                      className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 outline-none"
                    />
                    <button
                      onClick={sendChat}
                      disabled={!chatInput.trim()}
                      className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 flex items-center justify-center transition-colors"
                    >
                      <Send size={11} className="text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Participants panel */}
            {panel === "participants" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* Local */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    Y
                  </div>
                  <span className="text-xs text-white font-medium flex-1">
                    You {isHost ? "(Host)" : ""}
                  </span>
                  {handRaised && <span>✋</span>}
                  {speakers.has(roomRef.current?.localParticipant.identity ?? "") && (
                    <Volume2 size={11} className="text-emerald-400" />
                  )}
                </div>

                {/* Remote */}
                {Array.from(roomRef.current?.remoteParticipants.values() ?? []).map(
                  (p) => (
                    <div
                      key={p.identity}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {p.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="text-xs text-slate-300 font-medium flex-1 truncate">
                        {p.name ?? p.identity}
                      </span>
                      {raisedHands.has(p.identity) && <span>✋</span>}
                      {speakers.has(p.identity) && (
                        <Volume2 size={11} className="text-emerald-400" />
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="h-20 border-t border-white/5 bg-[#0f1422]/80 backdrop-blur-xl flex items-center justify-center gap-2 px-4">

        {/* Mic */}
        <ControlBtn
          onClick={toggleMic}
          active={micEnabled}
          icon={micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          label={micEnabled ? "Mute" : "Unmute"}
          danger={!micEnabled}
        />

        {/* Camera */}
        <ControlBtn
          onClick={toggleCamera}
          active={cameraEnabled}
          icon={cameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          label={cameraEnabled ? "Stop Video" : "Start Video"}
          danger={!cameraEnabled}
        />

        {/* Screen share */}
        <ControlBtn
          onClick={toggleScreenShare}
          active={!screenSharing}
          icon={screenSharing ? <MonitorOff size={18} /> : <Monitor size={18} />}
          label={screenSharing ? "Stop Share" : "Share"}
          accent={screenSharing}
        />

        {/* Chat */}
        <div className="relative">
          <ControlBtn
            onClick={() => togglePanel("chat")}
            active={panel !== "chat"}
            icon={<MessageCircle size={18} />}
            label="Chat"
            highlight={panel === "chat"}
          />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center z-10">
              {unread}
            </span>
          )}
        </div>

        {/* Participants */}
        <ControlBtn
          onClick={() => togglePanel("participants")}
          active={panel !== "participants"}
          icon={<Users size={18} />}
          label="People"
          highlight={panel === "participants"}
        />

        {/* Raise hand */}
        <ControlBtn
          onClick={toggleHand}
          active={!handRaised}
          icon={<Hand size={18} />}
          label={handRaised ? "Lower Hand" : "Raise Hand"}
          accent={handRaised}
        />

        {/* Recording (host only) */}
        {isHost && (
          <ControlBtn
            onClick={toggleRecording}
            active={!recording}
            icon={
              recordingLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : recording ? (
                <StopCircle size={18} />
              ) : (
                <Circle size={18} />
              )
            }
            label={recording ? "Stop Rec" : "Record"}
            danger={recording}
          />
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Leave */}
        <button
          onClick={leaveRoom}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 transition-colors"
        >
          <PhoneOff size={18} className="text-white" />
          <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
            Leave
          </span>
        </button>
      </div>
    </div>
  );
}

/* ─── Control button ─────────────────────────────────────────────────────────── */

function ControlBtn({
  onClick,
  icon,
  label,
  active = true,
  danger = false,
  accent = false,
  highlight = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all ${
        danger
          ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
          : accent
          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
          : highlight
          ? "bg-white/15 text-white"
          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}