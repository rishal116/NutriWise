"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {toast} from "sonner";
import { adminNutriService } from "@/services/admin/adminNutri.service";
import { NutritionistLevel, LEVELS } from "@/enum/admin/nutritionist.enum";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { isAxiosError } from "axios";
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
  Mail,
  Zap,
  ExternalLink,
  Download,
  AlertCircle,
  Settings2
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
  level: string;
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
  const isRejected = user?.nutritionistStatus === "rejected";

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminNutriService.getNutritionistProfile(id);
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        if (typeof window !== "undefined" && res.data.user) {
          document.title = `${res.data.user.fullName} Profile | Admin`;
        }
      }
    } catch (err: unknown) {
      const message = isAxiosError(err) ? err.response?.data?.message : "Failed to load profile";
      toast.error(message);
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
      toast.success("Practitioner approved successfully");
      fetchProfile();
    } catch (err: unknown) {
      const message = isAxiosError(err) ? err.response?.data?.message : "Approval failed";
      toast.error(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return toast.error("Please provide a reason");
    try {
      setIsActionLoading(true);
      console.log("rejection");
      
      await adminNutriService.rejectNutritionist(id, rejectionReason);
      toast.success(isApproved ? "Verification Revoked" : "Application Rejected");
      setRejectionReason("");
      fetchProfile();
    } catch (err: unknown) {
      const message = isAxiosError(err) ? err.response?.data?.message : "Rejection failed";
      toast.error(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLevelUpdate = async (level: NutritionistLevel) => {
    try {
      await adminNutriService.updateNutritionistLevel(id, level);
      toast.success(`Rank updated to ${level.replace("_", " ")}`);
      fetchProfile();
    } catch (err: unknown) {
      const message = isAxiosError(err) ? err.response?.data?.message : "Level update failed";
      toast.error(message);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* ─── TOP NAVIGATION BAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
          >
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-all">
              <ChevronLeft size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back to Directory</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${
              isApproved ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
              isRejected ? "bg-rose-50 border-rose-100 text-rose-600" :
              "bg-amber-50 border-amber-100 text-amber-600"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isApproved ? "bg-emerald-500" : isRejected ? "bg-rose-500" : "bg-amber-500"
              }`} />
              {user?.nutritionistStatus}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT COLUMN: IDENTITY & ACTIONS ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Profile Card */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-40 h-40 rounded-[2.5rem] p-1.5 border-2 border-slate-50 shadow-2xl shadow-slate-200 overflow-hidden">
                    {profile?.profileImage ? (
                      <Image src={profile.profileImage} alt="Avatar" width={160} height={160} className="w-full h-full object-cover rounded-[2rem]" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                        <User size={64} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg border border-slate-50">
                    {isApproved ? <ShieldCheck className="text-emerald-500" size={24} /> : <Clock className="text-amber-500" size={24} />}
                  </div>
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{user?.fullName}</h1>
                <p className="text-sm font-bold text-slate-400 mt-1 lowercase">{user?.email}</p>

                <div className="mt-8 w-full space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block text-left ml-2">Tier Management</label>
                  <div className="relative group">
                    <select
                      value={profile?.level}
                      onChange={(e) => handleLevelUpdate(e.target.value as NutritionistLevel)}
                      className="w-full appearance-none bg-slate-50 border border-slate-100 text-slate-800 font-black text-[11px] uppercase tracking-widest px-6 py-5 rounded-3xl cursor-pointer hover:border-emerald-200 transition-all outline-none"
                    >
                      {LEVELS.map((level) => (
                        <option key={level} value={level}>{level.replace("_", " ")}</option>
                      ))}
                    </select>
                    <Settings2 className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-400 transition-colors" size={16} />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Verification Actions Panel */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <ShieldCheck size={14} /> Administrative Audit
                </h3>

                <div className="space-y-4">
                  {/* Approve Button */}
                  <button
                    onClick={handleApprove}
                    disabled={isActionLoading || isApproved}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-3xl text-xs font-black tracking-widest uppercase transition-all shadow-lg ${
                      isApproved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10"
                    }`}
                  >
                    {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    {isApproved ? "Already Verified" : "Approve Account"}
                  </button>

                  {/* Reject / Revoke Section */}
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <input
                      type="text"
                      placeholder={isApproved ? "Reason for revoking..." : "Reason for rejection..."}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-all"
                    />
                    <button
                      onClick={handleReject}
                      disabled={isActionLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-3xl text-xs font-black tracking-widest uppercase transition-all border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white"
                    >
                      <XCircle size={16} />
                      {isApproved ? "Revoke Verification" : "Reject Application"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Quick Stats / Metadata */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6"
            >
              <MetadataItem icon={<Mail size={16} />} label="Email" value={user?.email} />
              <MetadataItem icon={<Phone size={16} />} label="Contact" value={user?.phone} />
              <MetadataItem icon={<MapPin size={16} />} label="Base Region" value={profile?.country} />
              <MetadataItem icon={<Calendar size={16} />} label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : null} />
            </motion.section>
          </div>

          {/* ─── RIGHT COLUMN: PROFESSIONAL DATA ─── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Rejected Message Alert */}
            {isRejected && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2.5rem] flex items-start gap-6">
                <AlertCircle className="text-rose-500 shrink-0" size={32} />
                <div>
                  <h4 className="text-sm font-black text-rose-900 uppercase">Application Deficiency Noted</h4>
                  <p className="text-sm text-rose-600 font-bold mt-2 italic bg-white/50 p-4 rounded-2xl border border-rose-100">{user?.rejectionReason}</p>
                </div>
              </motion.div>
            )}

            {/* Bio & Specializations */}
            <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden group">
              <Award size={140} className="absolute -right-10 -top-10 text-slate-50 group-hover:text-emerald-50 transition-colors duration-500" />
              
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><Award size={20} /></div> Professional Bio
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg relative z-10 italic">
                {profile?.bio || "Professional profile is currently awaiting a bio submission."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-slate-50">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Expertise Domains</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile?.specializations?.map((s) => (
                      <span key={s} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Accreditations</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile?.qualifications?.map((q) => (
                      <span key={q} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Clinical Experience Timeline */}
            <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Briefcase size={20} /></div> Career Trajectory
              </h3>
              <div className="space-y-10 relative">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-50" />
                {profile?.experiences?.map((exp, idx) => (
                  <div key={idx} className="relative flex items-start gap-8">
                    <div className="w-12 h-12 bg-white border-4 border-slate-50 rounded-2xl shadow-xl flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform">
                      <Zap size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex-1 pb-10 border-b border-slate-50 last:border-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{exp.role}</h4>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl uppercase tracking-widest">{exp.years} Yrs</span>
                      </div>
                      <p className="text-emerald-600 font-bold mt-1 uppercase text-xs tracking-widest">{exp.organization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Evidence & Verification Node */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white group relative overflow-hidden">
                <FileText size={120} className="absolute -right-10 -bottom-10 text-white/[0.03]" />
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-8">Professional CV</h3>
                {profile?.cv ? (
                  <a href={profile.cv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-[10px] font-black tracking-widest uppercase transition-all shadow-2xl shadow-emerald-500/20">
                    <Download size={16} /> Download Asset
                  </a>
                ) : (
                  <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest py-10 border-2 border-dashed border-slate-800 rounded-3xl text-center">No asset found</div>
                )}
              </div>

              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <Star size={100} className="absolute -right-10 -bottom-10 text-slate-50" />
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Verification Node</h3>
                <div className="space-y-3">
                  {profile?.certifications?.map((cert, i) => (
                    <a key={i} href={cert} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-emerald-200 hover:bg-white transition-all group/cert">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 group-hover/cert:text-emerald-500 transition-colors"><ExternalLink size={12} /></div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Certificate Bundle {i + 1}</span>
                      </div>
                      <ShieldCheck size={16} className="text-emerald-200 group-hover/cert:text-emerald-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ───

function MetadataItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null | number }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-4 group">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all border border-transparent group-hover:border-emerald-100">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-[13px] font-black text-slate-700 tracking-tight truncate">{value}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <div className="absolute inset-0 blur-2xl bg-emerald-400/20 rounded-full animate-pulse" />
      </div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Decrypting practitioner profile...</p>
    </div>
  );
}