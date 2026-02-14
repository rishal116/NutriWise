"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userMeetService } from "@/services/user/userMeet.service";

interface Meeting {
  id: string;
  title: string;
  roomId: string;
  scheduledAt: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  userId: string;
  createdAt: string;
  updatedAt: string;
  nutritionist: {
    id: string;
    fullName: string;
    email: string;
  };
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await userMeetService.getMeetings();
        console.log("datas:", res);
        setMeetings(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Error fetching meetings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleJoin = (roomId: string) => {
    router.push(`/video-call/${roomId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading meetings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Meetings</h1>

      {meetings.length === 0 ? (
        <div className="text-gray-500">No meetings scheduled.</div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{meeting.title}</h2>

                <p className="text-sm text-gray-500">
                  With:{" "}
                  <span className="font-medium">
                    {meeting.nutritionist.fullName}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(meeting.scheduledAt).toLocaleString([], {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>

                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(
                    meeting.status
                  )}`}
                >
                  {meeting.status}
                </span>
              </div>

              {(meeting.status === "scheduled" ||
                meeting.status === "ongoing") && (
                <button
                  onClick={() => handleJoin(meeting.roomId)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Join
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
