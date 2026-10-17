"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  IndianRupee,
  Clock,
  CheckCircle2,
  Loader2,
  Type,
  Globe,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { nutritionistPlanService } from "@/services/nutritionist/nutriPlan.service";
import { UpdatePlanDto } from "@/dtos/nutritionist/plan/update-plan.dto";
import type { Specialization } from "@/types/nutritionist.types";

interface PlanForm {
  title: string;
  specialization: Specialization | "";
  durationDays: number;
  price: number;
  status: "draft" | "published" | "archived";
  description: string;
  features: string[];
}

type Option = { id: string; label: string };

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  // Confirm your route folder name — using planId to match the view page
  const planId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string | undefined);

  console.log("d", planId);

  const [form, setForm] = useState<PlanForm | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [priceLimits, setPriceLimits] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      if (!planId) return;
      try {
        const [plan, metadata] = await Promise.all([
          nutritionistPlanService.getPlanById(planId),
          nutritionistPlanService.getPlanMetadata(),
        ]);
        console.log(plan);
        console.log(metadata);

        setCategories(
          metadata.specializations.map((c) => ({
            id: c,
            label: c
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          })),
        );
        setPriceLimits({
          min: metadata.pricing.minPrice,
          max: metadata.pricing.maxPrice,
        });

        setForm({
          title: plan.title,
          specialization: plan.specialization,
          durationDays: plan.durationDays,
          price: plan.price,
          status: plan.status,
          description: plan.description,
          features: plan.features.length ? plan.features : [""],
        });
      } catch (err) {
        console.error("Initialization failed", err);
        toast.error("Failed to load plan");
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [planId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number,
  ) => {
    if (!form) return;
    const { name, value } = e.target;

    if (name === "features" && index !== undefined) {
      const newFeatures = [...form.features];
      newFeatures[index] = value;
      setForm({ ...form, features: newFeatures });
    } else {
      setForm({
        ...form,
        [name]:
          name === "price" || name === "durationDays" ? Number(value) : value,
      });
    }
  };

  // ...handle

  const handleSubmit = async () => {
    if (!form || !planId) return;

    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.specialization) return toast.error("Select a specialization");
    if (
      priceLimits &&
      (form.price < priceLimits.min || form.price > priceLimits.max)
    ) {
      return toast.error(
        `Price must be between ₹${priceLimits.min} and ₹${priceLimits.max}`,
      );
    }

    setSubmitting(true);
    try {
      const payload: UpdatePlanDto = {
        title: form.title,
        specialization: form.specialization || undefined,
        durationDays: form.durationDays,
        price: form.price,
        description: form.description,
        status: form.status,
        features: form.features.filter((f) => f.trim() !== ""),
      };

      await nutritionistPlanService.updatePlan(planId, payload);
      toast.success("Changes saved");
      router.push(`/nutritionist/plans/${planId}`);
    } catch (err) {
      console.error("Failed to update plan", err);
      toast.error("Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!form) return null;

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-xl py-6 mb-8 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Edit Plan
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                ID: {planId}
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {submitting ? "Saving" : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Type size={14} className="text-emerald-500" /> Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">
                  Plan Name
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-800"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-medium text-slate-700 resize-none leading-relaxed"
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                Deliverables
              </h3>
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, features: [...form.features, ""] })
                }
                className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {form.features.map((f, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <input
                      value={f}
                      onChange={(e) => handleChange(e, idx)}
                      name="features"
                      placeholder="Feature detail..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold text-slate-700 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        features: form.features.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    aria-label="Remove feature"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Status & Pricing
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/30 outline-none font-semibold text-emerald-50"
              >
                <option value="draft" className="bg-slate-900">
                  Draft
                </option>
                <option value="published" className="bg-slate-900">
                  Published
                </option>
                <option value="archived" className="bg-slate-900">
                  Archived
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Price (INR)
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"
                  size={16}
                />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/30 outline-none font-bold text-xl text-white"
                />
              </div>
              {priceLimits && (
                <p className="text-[9px] text-slate-500 font-semibold ml-1">
                  Range: ₹{priceLimits.min} - ₹{priceLimits.max}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Duration
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"
                  size={16}
                />
                <select
                  name="durationInDays"
                  value={form.durationDays}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/30 outline-none font-semibold text-white"
                >
                  <option value={30} className="bg-slate-900">
                    30 Days
                  </option>
                  <option value={90} className="bg-slate-900">
                    90 Days
                  </option>
                  <option value={180} className="bg-slate-900">
                    180 Days
                  </option>
                </select>
              </div>
            </div>
          </section>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
            <Sparkles className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-emerald-900/70 font-semibold leading-relaxed">
              Use specific, searchable terms in your description to improve
              visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin border-t-emerald-500" />
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        Loading plan
      </p>
    </div>
  );
}
