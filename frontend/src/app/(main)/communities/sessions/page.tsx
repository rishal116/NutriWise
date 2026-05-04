"use client";

import { useEffect, useState } from "react";
import { userSessionService } from "@/services/user/session.service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { getErrorMessage } from "@/utils/errorHandler";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type Session = {
  id: string;
  title: string;
  description?: string;

  scheduledAt: string;
  durationInMinutes: number;

  type: "free" | "paid";
  price?: number;

  status: string;

  users: SessionUser[];

  joinStatus: "none" | "pending" | "approved";
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const router = useRouter();

  /* ================= FETCH ================= */

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await userSessionService.getSessions();
      console.log(res);
      
      setSessions(res.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* ================= JOIN ================= */

  const handleJoin = async (sessionId: string) => {
    try {
      setJoiningId(sessionId);

      await userSessionService.joinSession(sessionId);

      toast.success("Joined successfully!");

      await fetchSessions();
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setJoiningId(null);
    }
  };

  /* ================= ENTER SESSION ================= */

  const handleEnterSession = (sessionId: string) => {
    // 👉 redirect to video page
    router.push(`/session-room/${sessionId}`);
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-6">Loading sessions...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sessions</h1>

      {sessions.length === 0 && (
        <p className="text-gray-500">No sessions available</p>
      )}

      {sessions.map((session) => (
        <div key={session.id} className="border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{session.title}</h2>

          <p className="text-sm text-gray-600">
            {session.description || "No description"}
          </p>

          <div className="text-sm mt-2 space-y-1">
            <p>📅 {new Date(session.scheduledAt).toLocaleString()}</p>
            <p>⏱ {session.durationInMinutes} mins</p>
            <p>💰 {session.type === "free" ? "Free" : `₹${session.price}`}</p>
          </div>

          {/* Users */}
          <div className="mt-3">
            <p className="text-sm font-medium">Participants:</p>
            {session.users.length === 0 ? (
              <p className="text-xs text-gray-500">No participants yet</p>
            ) : (
              <ul className="text-sm list-disc ml-5">
                {session.users.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4">
            {session.joinStatus === "none" && (
              <button
                onClick={() => handleJoin(session.id)}
                disabled={joiningId === session.id}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {joiningId === session.id
                  ? "Joining..."
                  : session.type === "free"
                    ? "Join"
                    : "Pay & Join"}
              </button>
            )}

            {session.joinStatus === "pending" && (
              <button
                disabled
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Requested
              </button>
            )}

            {session.joinStatus === "approved" && (
              <button
                onClick={() => handleEnterSession(session.id)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Enter Session
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
