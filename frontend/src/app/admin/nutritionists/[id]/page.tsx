"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { adminNutriService } from "@/services/admin/adminNutri.service";
import { NutritionistLevel, LEVELS } from "@/enum/admin/nutritionist.enum";
import Image from "next/image";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Calendar,
  Globe,
  Award,
  Briefcase,
  FileText,
  Star,
  ShieldCheck,
  MapPin,
  Loader2,
} from "lucide-react";

// Types
interface Experience {
  role: string;
  organization: string;
  years: number;
}

interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  age?: number;
  nutritionistStatus?: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
  isBlocked: boolean;
  createdAt: string;
}

interface NutritionistProfileDTO {
  profileImage?: string;
  qualifications?: string[];
  specializations?: string[];
  experiences?: Experience[];
  bio?: string;
  languages?: string[];
  country?: string;
  cv?: string;
  certifications?: string[];
  availabilityStatus?: "available" | "unavailable" | "busy";
  totalExperienceYears?: number;
  nutritionistStatus: NutritionistLevel;
  rating?: number;
}

export default function AdminNutritionistProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserDTO | null>(null);
  const [profile, setProfile] = useState<NutritionistProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const isApproved = user?.nutritionistStatus === "approved";

  const fetchProfile = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    if (id) fetchProfile();
  }, [id, fetchProfile]);

  const handleApprove = async () => {
    try {
      setIsActionLoading(true);
      await adminNutriService.approveNutritionist(id);
      toast.success("Nutritionist approved successfully");
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return toast.error("Please provide a reason");
    try {
      setIsActionLoading(true);
      await adminNutriService.rejectNutritionist(id, rejectionReason);
      toast.success("Nutritionist rejected");
      setRejectionReason("");
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLevelUpdate = async (level: NutritionistLevel) => {
    try {
      await adminNutriService.updateNutritionistLevel(id, level);
      toast.success(`Rank updated to ${level}`);
      fetchProfile();
    } catch {
      toast.error("Level update failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading professional profile...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {!isApproved && (
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm focus-within:border-emerald-500 transition-colors">
              <input
                type="text"
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="px-4 py-2 text-sm bg-transparent outline-none w-48 md:w-64 font-medium placeholder:text-slate-400"
              />
              <button
                onClick={handleReject}
                disabled={isActionLoading}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2 rounded-xl text-xs font-black transition-colors disabled:opacity-50"
              >
                REJECT
              </button>
            </div>
          )}

          <button
            onClick={handleApprove}
            disabled={isActionLoading || isApproved}
            className={`${
              isApproved
                ? "bg-slate-100 text-emerald-600 border border-emerald-100 cursor-default"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100"
            } px-8 py-3.5 rounded-2xl text-sm font-black transition-all disabled:opacity-80 flex items-center gap-2`}
          >
            {isActionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isApproved ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isApproved ? "VERIFIED PARTNER" : "APPROVE NUTRITIONIST"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm text-center">
            <div className="relative inline-block mx-auto mb-6">
              {profile?.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={user?.fullName || "Profile"}
                  width={160}
                  height={160}
                  className="w-40 h-40 rounded-[2rem] object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-40 h-40 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 border-4 border-white shadow-lg">
                  <User size={64} />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-100">
                {isApproved ? (
                  <ShieldCheck className="text-emerald-500" size={24} />
                ) : (
                  <Clock className="text-amber-500" size={24} />
                )}
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
              {user?.fullName}
            </h1>
            <p className="text-slate-500 font-bold text-sm mb-6 lowercase">
              {user?.email}
            </p>

            <div className="space-y-3 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Tier Assignment
              </label>
              <div className="relative group">
                <select
                  value={profile?.nutritionistStatus}
                  onChange={(e) =>
                    handleLevelUpdate(e.target.value as NutritionistLevel)
                  }
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-emerald-700 font-black text-xs px-5 py-4 rounded-2xl cursor-pointer hover:border-emerald-300 transition-colors focus:ring-2 focus:ring-emerald-500/20 outline-none"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronLeft className="w-4 h-4 rotate-270" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              Contact Metadata
            </h3>
            <div className="space-y-5">
              <MetadataItem icon={<Phone size={16} />} label="Phone Number" value={user?.phone} />
              <MetadataItem 
                icon={<Calendar size={16} />} 
                label="Registration" 
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null} 
              />
              <MetadataItem icon={<MapPin size={16} />} label="Location" value={profile?.country} />
              <MetadataItem icon={<Globe size={16} />} label="Native Languages" value={profile?.languages?.join(", ")} />
            </div>
          </section>
        </aside>

        {/* Right Panel */}
        <main className="lg:col-span-8 space-y-6">
          {/* Status Alerts */}
          {isApproved && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <ShieldCheck className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wide">
                    Account Approved
                  </h4>
                  <p className="text-sm text-emerald-600 font-medium">
                    This nutritionist has been verified and is active on NutriWise.
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="text-[10px] font-black bg-emerald-600 text-white px-3 py-1 rounded-lg uppercase tracking-widest">
                  Verified
                </span>
              </div>
            </div>
          )}

          {user?.nutritionistStatus === "rejected" && (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-start gap-4">
              <XCircle className="text-rose-500 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-sm font-black text-rose-800 uppercase tracking-wide">
                  Application Rejected
                </h4>
                <p className="text-sm text-rose-600 font-medium mt-1">
                  {user.rejectionReason}
                </p>
              </div>
            </div>
          )}

          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-50 pointer-events-none">
              <Award size={120} />
            </div>

            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
              <Award className="text-emerald-500" size={28} /> Professional Biography
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium text-lg relative z-10">
              {profile?.bio || "No biography provided by the professional."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-slate-100">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Core Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile?.specializations?.map((s) => (
                    <span key={s} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-wider">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Key Qualifications
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {profile?.qualifications?.map((q) => (
                    <li key={q} className="text-slate-700 text-sm font-bold flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Briefcase className="text-emerald-500" size={28} /> Career History
            </h3>
            <div className="space-y-8">
              {profile?.experiences?.map((exp, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100" />
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-emerald-500 shadow-sm shadow-emerald-200" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <p className="text-lg font-black text-slate-900 uppercase">{exp.role}</p>
                    <span className="text-xs font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-widest">
                      {exp.years} Years
                    </span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 mt-1">{exp.organization}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Files Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                <FileText className="text-emerald-400" size={20} /> Curriculum Vitae
              </h3>
              {profile?.cv ? (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  DOWNLOAD ASSET
                </a>
              ) : (
                <p className="text-slate-500 text-xs font-bold italic uppercase tracking-widest">No file attached</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <Star className="text-amber-500" size={20} /> Verified Certificates
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {profile?.certifications?.map((cert, i) => (
                  <a
                    key={i}
                    href={cert}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 hover:bg-white transition-all group"
                  >
                    <span className="text-xs font-black text-slate-600 uppercase">Verification File {i + 1}</span>
                    <FileText className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MetadataItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null | number }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}