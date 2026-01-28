"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { adminNutriService } from "@/services/admin/adminNutri.service";
import { NutritionistLevel, LEVELS } from "@/enum/admin/nutritionist.enum";

interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  age?: number;
  role: string;
  nutritionistStatus?: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NutritionistProfileDTO {
  profileImage?: string;
  qualifications?: string[];
  specializations?: string[];
  experiences?: { role: string; organization: string; years: number }[];
  bio?: string;
  languages?: string[];
  country?: string;
  cv?: string;
  certifications?: string[];
  availabilityStatus?: "available" | "unavailable" | "busy";
  totalExperienceYears?: number;
  nutritionistStatus:"BEGINNER" | "VERIFIED" | "EXPERT" | "TOP_COACH";
  rating?: number;
  salary?: number;
}

export default function AdminNutritionistProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserDTO | null>(null);
  const [profile, setProfile] = useState<NutritionistProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await adminNutriService.getNutritionistProfile(id);
      
      setUser(res.data.user);
      setProfile(res.data.profile);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = async (level: NutritionistLevel) => {
  try {
    await adminNutriService.updateNutritionistLevel(id, level);
    toast.success("Nutritionist level updated");
    fetchProfile();
  } catch {
    toast.error("Failed to update level");
  }
};

  // Approve Nutritionist
  const handleApprove = async () => {
    try {
      await adminNutriService.approveNutritionist(id);
      toast.success("Nutritionist approved");
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve");
    }
  };

  // Reject Nutritionist with reason
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return toast.error("Please enter a rejection reason");
    }
    try {
      await adminNutriService.rejectNutritionist(id, rejectionReason);
      toast.success("Nutritionist rejected");
      setRejectionReason("");
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getAvailabilityColor = (status?: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "busy":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "unavailable":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user && !profile) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Profile not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold">Nutritionist Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Approve / Reject Buttons */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <button
            onClick={handleApprove}
            disabled={user?.nutritionistStatus === "approved"}
            className={`px-4 py-2 rounded-lg text-white transition ${
              user?.nutritionistStatus === "approved" ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Approve
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            <button
              onClick={handleReject}
              disabled={user?.nutritionistStatus === "rejected"}
              className={`px-4 py-2 rounded-lg text-white transition ${
                user?.nutritionistStatus === "rejected" ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Reject
            </button>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={user?.fullName || "Profile"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
                  {user?.fullName?.charAt(0) || "N"}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{user?.fullName || "Unknown"}</h2>
              <p className="text-gray-400 mb-4">{user?.email || "No email"}</p>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(user?.nutritionistStatus)}`}>
                  {user?.nutritionistStatus || "none"}
                </span>
                {profile?.availabilityStatus && (
                  <span className={`px-3 py-1 rounded-full text-sm border ${getAvailabilityColor(profile.availabilityStatus)}`}>
                    {profile.availabilityStatus}
                  </span>
                )}
 <div className="flex items-center gap-3">
  <select
    value={profile?.nutritionistStatus}
    onChange={(e) => handleLevelChange(e.target.value as NutritionistLevel)}
    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-white"
  >
    {LEVELS.map((level) => (
      <option key={level} value={level}>
        {level.replace("_", " ")}
      </option>
    ))}
  </select>
</div>
                {user?.isBlocked && (
                  <span className="px-3 py-1 rounded-full text-sm border bg-red-500/20 text-red-400 border-red-500/30">
                    Blocked
                  </span>
                )}
                {profile?.rating && (
                  <span className="px-3 py-1 rounded-full text-sm border bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {profile.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {user?.rejectionReason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">
                    <strong>Rejection Reason:</strong> {user.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                {user?.phone && <div><p className="text-gray-400">Phone</p><p className="text-white">{user.phone}</p></div>}
                {user?.birthdate && <div><p className="text-gray-400">Birthdate</p><p className="text-white">{new Date(user.birthdate).toLocaleDateString()}</p></div>}
                {user?.gender && <div><p className="text-gray-400">Gender</p><p className="text-white capitalize">{user.gender}</p></div>}
                {user?.age && <div><p className="text-gray-400">Age</p><p className="text-white">{user.age} years</p></div>}
                {profile?.country && <div><p className="text-gray-400">Country</p><p className="text-white">{profile.country}</p></div>}
                {user?.createdAt && <div><p className="text-gray-400">Member Since</p><p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p></div>}
              </div>
            </div>

            {/* Languages */}
            {profile?.languages && profile.languages.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800 rounded-lg text-sm">{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile?.bio && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Biography</h3>
                <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Qualifications */}
            {profile?.qualifications && profile.qualifications.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Qualifications</h3>
                <ul className="space-y-2">
                  {profile.qualifications.map((qual, idx) => (
                    <li key={idx} className="text-gray-300">• {qual}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specializations */}
            {profile?.specializations && profile.specializations.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((spec, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile?.experiences && profile.experiences.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Work Experience {profile?.totalExperienceYears && `(Total ${profile.totalExperienceYears} years)`}
                </h3>
                <div className="space-y-4">
                  {profile.experiences.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-orange-500 pl-4 py-2">
                      <p className="font-semibold text-white">{exp.role}</p>
                      <p className="text-gray-400">{exp.organization}</p>
                      <p className="text-sm text-gray-500">{exp.years} {exp.years === 1 ? "year" : "years"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & CV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile?.certifications && profile.certifications.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <ul className="space-y-2 text-sm">
                    {profile.certifications.map((cert, idx) => (
                      <li key={idx}>
                        <a href={cert} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                          Certification {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {profile?.cv && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Curriculum Vitae</h3>
                  <a
                    href={profile.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition text-sm"
                  >
                    View CV
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
