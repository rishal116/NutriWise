"use client";

import { useEffect, useState } from "react";
import { userAccountService } from "@/services/user/userAccount.service";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAccountService
      .getProfile()
      .then((res) => setUser(res.user))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Unable to load profile
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Top Section – User Info */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-6">
        <img
          src={user.profileImage || "https://i.pravatar.cc/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border shadow"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
          <p className="text-gray-600">{user.email}</p>

          <div className="mt-3 flex gap-3 text-sm">
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              {user.role}
            </span>

            {user.createdAt && (
              <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                Joined {new Date(user.createdAt).getFullYear()}
              </span>
            )}
          </div>
        </div>

        <button className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          Edit Profile
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-medium">Full Name: </span>{user.fullName}</p>
            <p><span className="font-medium">Email: </span>{user.email}</p>
            <p><span className="font-medium">Phone: </span>{user.phone || "Not added"}</p>
            <p><span className="font-medium">Gender: </span>{user.gender || "Not specified"}</p>
            <p><span className="font-medium">DOB: </span>{user.birthdate || "Not added"}</p>
          </div>
        </div>

        {/* Other Information */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Other Info</h3>
          <div className="space-y-3 text-gray-700">
            <p><span className="font-medium">Age: </span>{user.age || "Not added"}</p>
            <p><span className="font-medium">Nutritionist Status: </span>{user.nutritionistStatus}</p>
            {user.rejectionReason && (
              <p><span className="font-medium">Rejected: </span>{user.rejectionReason}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
