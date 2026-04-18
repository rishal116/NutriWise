"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { groupService } from "@/services/nutritionist/nutriCommunity.service";
import { GroupDetailsDto, JoinRequestDto } from "@/dtos/nutritionist/group.dto";
import Image from "next/image";

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState<GroupDetailsDto | null>(null);
  const [requests, setRequests] = useState<JoinRequestDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [groupData, requestData] = await Promise.all([
        groupService.getGroup(groupId as string),

        groupService.getJoinRequests(groupId as string),
      ]);

      setGroup(groupData);
      setRequests(requestData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAccept = async (userId: string) => {
    await groupService.acceptRequest(groupId as string, userId);
    setRequests((prev) => prev.filter((r) => r.userId !== userId));
  };

  const handleReject = async (userId: string) => {
    await groupService.rejectRequest(groupId as string, userId);
    setRequests((prev) => prev.filter((r) => r.userId !== userId));
  };

  if (loading)
    return (
      <div className="flex justify-center p-20 text-teal-700">
        Loading details...
      </div>
    );
  if (!group) return <div className="p-10 text-center">Group not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12">
      {/* Header Section */}
      <header className="border-b border-teal-100 pb-8">
        <h1 className="text-4xl font-extrabold text-teal-950 mb-2">
          {group.title}
        </h1>
        <p className="text-teal-700 text-lg leading-relaxed max-w-2xl">
          {group.description}
        </p>
        <span className="inline-block mt-4 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200">
          {group.memberCount} Active Members
        </span>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Members List */}
        <section>
          <h2 className="text-xl font-bold text-teal-900 mb-5">
            Current Members
          </h2>
          <div className="space-y-3">
            {group.members.length === 0 ? (
              <p className="text-gray-500 italic">No members yet.</p>
            ) : (
              group.members.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center p-4 bg-white border border-teal-50 rounded-xl shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden mr-4">
                    {m.profileImage ? (
                      <Image
                        src={m.profileImage}
                        alt={m.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-teal-700 font-bold">
                        {m.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs uppercase tracking-wider text-teal-600 font-medium">
                      {m.role}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Join Requests */}
        {group.visibility === "private" && (
          <section>
            <h2 className="text-xl font-bold text-teal-900 mb-5">
              Pending Requests
            </h2>

            <div className="space-y-3">
              {requests.length === 0 ? (
                <p className="text-gray-500 italic">No pending requests.</p>
              ) : (
                requests.map((r) => (
                  <div
                    key={r.userId}
                    className="flex justify-between items-center p-4 bg-white border border-teal-100 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
                        {r.profileImage ? (
                          <Image
                            src={r.profileImage}
                            alt={r.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-teal-700 font-bold">
                            {r.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">{r.name}</p>
                        <p className="text-xs text-gray-400">
                          Requested: {new Date(r.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(r.userId)}
                        className="text-xs font-bold px-4 py-2 bg-teal-600 text-white rounded-lg"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleReject(r.userId)}
                        className="text-xs font-bold px-4 py-2 border border-red-200 text-red-600 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
