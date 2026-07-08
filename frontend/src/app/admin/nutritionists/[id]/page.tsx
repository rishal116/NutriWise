"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  ChevronLeft,
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
  XCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { adminNutritionistService } from "@/services/admin/adminNutri.service";
import { adminNutritionistApplicationService } from "@/services/admin/adminNutriApplication.service";
import { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { NutritionistLevel } from "@/enums/admin/nutritionist.enum";
import { CoachLevel } from "@/types/nutritionist.types";

// Assumption: NutritionistLevel enum members correspond 1:1 to these
// CoachLevel string values. Confirm against the actual enum definition.
const COACH_LEVELS: CoachLevel[] = [
  "beginner",
  "verified",
  "expert",
  "top_coach",
];

const AVAILABILITY_STYLES: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-600",
  busy: "bg-amber-50 text-amber-600",
  offline: "bg-slate-100 text-slate-500",
};

function MetadataItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function AdminNutritionistProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [details, setDetails] = useState<AdminNutritionistDetailsDto | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isUpdatingLevel, setIsUpdatingLevel] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminNutritionistService.getNutritionistDetails(userId);
      setDetails(res);
    } catch {
      toast.error("Failed to load nutritionist profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchDetails();
  }, [userId, fetchDetails]);

  const handleCoachLevelUpdate = async (level: CoachLevel) => {
    try {
      setIsUpdatingLevel(true);
      await adminNutritionistService.updateCoachLevel(
        userId,
        level as unknown as NutritionistLevel,
      );
      toast.success(`Coach level updated to ${level.replace("_", " ")}`);
      fetchDetails();
    } catch {
      toast.error("Coach level update failed");
    } finally {
      setIsUpdatingLevel(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsActionLoading(true);
      await adminNutritionistApplicationService.updateApplicationStatus(
        userId,
        "approved",
      );
      toast.success("Application approved");
      fetchDetails();
    } catch {
      toast.error("Approval failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    try {
      setIsActionLoading(true);
      await adminNutritionistApplicationService.updateApplicationStatus(
        userId,
        "rejected",
        rejectionReason,
      );
      toast.success("Application rejected");
      setRejectionReason("");
      setShowRejectInput(false);
      fetchDetails();
    } catch {
      toast.error("Rejection failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-medium text-sm">
          Loading nutritionist profile...
        </p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 font-medium text-sm">
          Nutritionist not found.
        </p>
      </div>
    );
  }

  const isPending = details.applicationStatus === "pending";
  const isApproved = details.applicationStatus === "approved";
  const isRejected = details.applicationStatus === "rejected";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-semibold text-sm transition-colors"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back
        </button>

        {(isPending || isRejected) && (
          <div className="flex flex-wrap items-center gap-3">
            {showRejectInput ? (
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm focus-within:border-emerald-400">
                <input
                  type="text"
                  autoFocus
                  placeholder="Reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="px-3 py-2 text-sm bg-transparent outline-none w-44 sm:w-64 font-medium placeholder:text-slate-400"
                />
                <button
                  onClick={() => {
                    setShowRejectInput(false);
                    setRejectionReason("");
                  }}
                  disabled={isActionLoading}
                  className="text-slate-400 hover:text-slate-600 px-3 py-2 text-xs font-bold shrink-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isActionLoading}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
                >
                  {isActionLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowRejectInput(true);
                  setRejectionReason(details.rejectionReason ?? "");
                }}
                disabled={isActionLoading}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
              >
                <XCircle size={16} />
                {isRejected ? "Update Reason" : "Reject"}
              </button>
            )}

            <button
              onClick={handleApprove}
              disabled={isActionLoading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 transition-all disabled:opacity-60"
            >
              {isActionLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Approve
            </button>
          </div>
        )}
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
            <div className="relative inline-block mx-auto mb-4">
              {details.profileImage ? (
                <Image
                  src={details.profileImage}
                  alt={details.fullName}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-300 border border-slate-200">
                  <User size={48} />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md border border-slate-100">
                {isApproved ? (
                  <ShieldCheck className="text-emerald-500" size={18} />
                ) : isRejected ? (
                  <XCircle className="text-red-500" size={18} />
                ) : (
                  <Clock className="text-amber-500" size={18} />
                )}
              </div>
            </div>

            <h1 className="text-lg font-bold text-slate-900">
              {details.fullName}
            </h1>
            <p className="text-slate-500 text-sm font-medium mb-4">
              {details.email}
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                  AVAILABILITY_STYLES[details.availabilityStatus] ??
                  "bg-slate-100 text-slate-500"
                }`}
              >
                {details.availabilityStatus}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                {details.rating.toFixed(1)} ({details.totalReviews})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Clients Coached
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {details.totalPeopleCoached}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Experience
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {details.totalExperienceYears}y
                </p>
              </div>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Coach Level
              </label>
              <select
                value={details.coachLevel}
                disabled={isUpdatingLevel}
                onChange={(e) =>
                  handleCoachLevelUpdate(e.target.value as CoachLevel)
                }
                className="mt-1.5 w-full appearance-none bg-slate-50 border border-slate-200 text-emerald-700 font-bold text-sm px-4 py-2.5 rounded-xl cursor-pointer hover:border-emerald-300 outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
              >
                {COACH_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Contact
            </h3>
            <MetadataItem
              icon={<Phone size={15} />}
              label="Phone"
              value={details.phone}
            />
            <MetadataItem
              icon={<Calendar size={15} />}
              label="Applied On"
              value={new Date(details.createdAt).toLocaleDateString()}
            />
            <MetadataItem
              icon={<Globe size={15} />}
              label="Languages"
              value={details.languages.join(", ")}
            />
          </section>
        </aside>

        {/* Right panel */}
        <main className="lg:col-span-8 space-y-6">
          {isApproved && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0" size={22} />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  Application approved
                </h4>
                <p className="text-sm text-emerald-600 font-medium">
                  This nutritionist is verified and active on NutriWise.
                </p>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-3">
              <XCircle className="text-red-500 shrink-0 mt-0.5" size={22} />
              <div>
                <h4 className="text-sm font-bold text-red-800">
                  Application rejected
                </h4>
                {details.rejectionReason && (
                  <p className="text-sm text-red-600 font-medium mt-1">
                    {details.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          )}

          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="text-emerald-500" size={20} /> Biography
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {details.bio || "No biography provided."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Specializations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {details.specializations.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold"
                    >
                      {s.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Qualifications
                </h4>
                <ul className="space-y-2">
                  {details.qualifications.map((q, i) => (
                    <li
                      key={i}
                      className="text-sm font-semibold text-slate-700"
                    >
                      {q.degree} — {q.institution} ({q.year})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Briefcase className="text-emerald-500" size={20} /> Experience
            </h3>
            <div className="space-y-6">
              {details.experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute left-0 top-1 bottom-0 w-px bg-slate-100" />
                  <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {exp.role}
                    </p>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg w-fit">
                      {exp.durationYears}y
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    {exp.organization}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-emerald-500" size={18} /> Resume
              </h3>
              {details.resumeUrl ? (
                <a
                  href={details.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View Resume
                </a>
              ) : (
                <p className="text-slate-400 text-xs font-semibold">
                  No file attached
                </p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="text-amber-500" size={18} /> Certifications
              </h3>
              <div className="space-y-2">
                {details.certifications.map((cert, i) => (
                  <a
                    key={i}
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {cert.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {cert.issuedBy}
                      </p>
                    </div>
                    <FileText size={14} className="text-slate-300 shrink-0" />
                  </a>
                ))}
                {details.certifications.length === 0 && (
                  <p className="text-slate-400 text-xs font-semibold">
                    No certifications uploaded
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
