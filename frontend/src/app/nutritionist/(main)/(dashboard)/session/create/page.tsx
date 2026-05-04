"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import { CreateSessionPayload } from "@/dtos/nutritionist/session.dto";
import toast, { Toaster } from "react-hot-toast"; // 1. Added toast
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
} from "lucide-react";

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "durationInMinutes", "maxParticipants"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // 2. Enhanced Validation Logic
  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Please provide a session title");
      return false;
    }
    if (form.title.length < 5) {
      toast.error("Title is too short (min 5 characters)");
      return false;
    }
    if (!form.scheduledAt) {
      toast.error("Please select a date and time");
      return false;
    }

    const selectedDate = new Date(form.scheduledAt);
    if (selectedDate < new Date()) {
      toast.error("Session cannot be scheduled in the past");
      return false;
    }

    if (form.durationInMinutes < 15) {
      toast.error("Minimum duration is 15 minutes");
      return false;
    }

    if ((form.maxParticipants ?? 0) < 1) {
      toast.error("At least 1 participant is required");
      return false;
    }

    if (form.type === "paid" && (!form.price || form.price <= 0)) {
      toast.error("Please set a valid price for the paid session");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const promise = nutriSessionService.createSession(form);

    // 3. Using toast.promise for a better UX
    toast.promise(
      promise,
      {
        loading: "Creating your session...",
        success: () => {
          router.push("/nutritionist/session");
          router.refresh(); // <--- Add this line
          return "Session published successfully! 🚀";
        },
        error: (err) =>
          err?.message || "Failed to create session. Please try again.",
      },
      {
        style: {
          borderRadius: "16px",
          background: "#334155",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "bold",
        },
        success: {
          duration: 4000,
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        },
      },
    );

    try {
      await promise;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Toaster position="top-center" reverseOrder={false} />

      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium text-sm"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Sessions
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Video size={120} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4 border border-emerald-100">
            <Sparkles size={14} /> New Consultation
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Video Session
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: GENERAL */}
        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Info size={16} className="text-emerald-500" /> General Details
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 ml-1">
                Session Title
              </label>
              <input
                name="title"
                placeholder="e.g. Weekly Gut Health Workshop"
                onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 ml-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="What will be discussed?"
                onChange={handleChange}
                rows={3}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 resize-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: LOGISTICS & CAPACITY */}
        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" /> Logistics &
              Capacity
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 ml-1">
                Date & Time
              </label>
              <input
                name="scheduledAt"
                type="datetime-local"
                onChange={handleChange}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 ml-1">
                Duration (Mins)
              </label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="durationInMinutes"
                  type="number"
                  defaultValue={60}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[13px] font-bold text-slate-700 ml-1">
                Max Participants
              </label>
              <div className="relative">
                <Users
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="maxParticipants"
                  type="number"
                  defaultValue={10}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PRICING */}
        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" /> Pricing
              Model
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700 ml-1">
                  Access Type
                </label>
                <select
                  name="type"
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {form.type === "paid" && (
                <div className="space-y-2 animate-in slide-in-from-right-4 duration-300">
                  <label className="text-[13px] font-bold text-amber-600 ml-1">
                    Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500"
                    />
                    <input
                      name="price"
                      type="number"
                      placeholder="29.99"
                      onChange={handleChange}
                      className="w-full pl-12 pr-5 py-3.5 rounded-2xl border-2 border-amber-100 bg-amber-50/20 focus:border-amber-500 outline-none transition-all font-black text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black text-[15px] shadow-xl shadow-emerald-200/50 transition-all active:scale-[0.99]"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "Confirm & Publish Session"
          )}
        </button>
      </div>
    </div>
  );
}
