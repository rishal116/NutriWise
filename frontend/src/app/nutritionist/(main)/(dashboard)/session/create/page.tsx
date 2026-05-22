"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import { CreateSessionPayload } from "@/dtos/nutritionist/session.dto";
import { toast } from "sonner";
import {
  ArrowLeft,
  Video,
  Calendar,
  Clock,
  Users,
  Info,
  Sparkles,
  Loader2,
  DollarSign,
  Lock,
  Globe,
} from "lucide-react";
import { createSessionSchema } from "@/validations/session.validation";

export default function CreateSessionPage() {
  const router = useRouter();

  const [form, setForm] = useState<CreateSessionPayload>({
    title: "",
    description: "",
    type: "free",
    price: 0,
    scheduledAt: "",
    durationInMinutes: 60,
    maxParticipants: 10,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "durationInMinutes", "maxParticipants"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    const result = createSessionSchema.safeParse(form);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await nutriSessionService.createSession(form);
      toast.success("Session published successfully!");
      router.push("/nutritionist/session");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Sessions
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Video size={17} className="text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
              New Session
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Video Session
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in the details below to publish a new consultation session.
          </p>
        </div>

        <div className="space-y-4">

          {/* Section: General Details */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <Info size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                General Details
              </span>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Session Title
                  <span className="text-red-400 ml-0.5">*</span>
                </label>
                <input
                  name="title"
                  placeholder="e.g. Weekly Gut Health Workshop"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Briefly describe what this session covers…"
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Logistics */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Logistics & Capacity
              </span>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Date & Time
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      name="scheduledAt"
                      type="datetime-local"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Duration (mins)
                  </label>
                  <div className="relative">
                    <Clock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      name="durationInMinutes"
                      type="number"
                      defaultValue={60}
                      min={15}
                      max={180}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Max Participants
                </label>
                <div className="relative">
                  <Users
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    name="maxParticipants"
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={100}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
              <DollarSign size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Pricing Model
              </span>
            </div>
            <div className="px-6 py-6 space-y-5">
              {/* Access Type Toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Access Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, type: "free", price: 0 }))
                    }
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      form.type === "free"
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Globe size={15} />
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, type: "paid" }))
                    }
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      form.type === "paid"
                        ? "border-amber-400 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Lock size={15} />
                    Paid
                  </button>
                </div>
              </div>

              {/* Price input — only when paid */}
              {form.type === "paid" && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="block text-sm font-semibold text-amber-700 mb-1.5">
                    Price ($)
                    <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none"
                    />
                    <input
                      name="price"
                      type="number"
                      placeholder="50.00"
                      min={50}
                      step={0.01}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-sm text-slate-900 placeholder:text-amber-300 font-semibold"
                    />
                  </div>
                  <p className="text-xs text-amber-600 mt-1.5 ml-0.5">
                    Minimum price for paid sessions is $50.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Confirm & Publish Session
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}