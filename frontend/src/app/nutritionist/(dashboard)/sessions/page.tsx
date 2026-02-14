"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  /* ============================= */
  /* Fetch Meetings */
  /* ============================= */
const fetchMeetings = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await nutritionistMeetService.getMeetings();

    // If API returns { success, data }
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
    console.error(err);
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
    console.error(err);
    setError("Failed to load clients.");
  }
};
useEffect(() => {
  getClients();
  fetchMeetings();
}, []);
  /* ============================= */
  /* Create Meeting */
  /* ============================= */
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
      console.error("Failed to create meeting:", err);
      alert("Failed to create meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  /* ============================= */
  /* Render */
  /* ============================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Meetings</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Meeting
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Manage and schedule your nutrition consultations
        </p>

        {/* Loading State */}
        {loading && <p className="text-gray-500">Loading meetings...</p>}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 p-4 rounded-lg mb-6 text-red-700">
            {error}
            <button
              onClick={fetchMeetings}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}

        {/* Meeting List */}
        {!loading && meetings.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No meetings scheduled
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first meeting to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Create Your First Meeting
            </button>
          </div>
        )}

        <div className="grid gap-4">
{meetings.map((m) => (
  <div
    key={m.id}
    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-emerald-200 flex justify-between items-center"
  >
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {m.title}
      </h3>

      <p className="text-gray-600 text-sm">
        Client: {m.userName}
      </p>

      <p className="text-gray-600 text-sm">
        Scheduled:{" "}
        {new Date(m.scheduledAt).toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
    </div>

    <button
      onClick={() => router.push(`/video-call/${m.roomId}`)}
      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
    >
      Join
    </button>
  </div>
))}

        </div>
      </div>

      {/* ============================= */}
      {/* Create Meeting Modal */}
      {/* ============================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Meeting
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Schedule a consultation with your client
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="Nutrition Consultation"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client User ID
                </label>
<select
  value={newMeetingUserId}
  onChange={(e) => setNewMeetingUserId(e.target.value)}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
>
  <option value="">Select Client</option>
  {clients
    .filter((c) => c.status === "ACTIVE")
    .map((c) => (
      <option key={c.user.id} value={c.user.id}>
        {c.user.name} ({c.user.email})
      </option>
    ))}
</select>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isCreating}
                className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={createMeeting}
                disabled={!newMeetingTitle || !newMeetingUserId || !newMeetingDate || isCreating}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Meeting"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
