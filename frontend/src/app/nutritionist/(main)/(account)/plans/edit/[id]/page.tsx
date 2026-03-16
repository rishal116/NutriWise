"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Plus, Trash2, 
  IndianRupee, Clock, Tag, Layout, 
  CheckCircle2, AlertCircle, Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

interface PlanForm {
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  status: "draft" | "published";
  description: string;
  features: string[];
}

export default function EditPlanPage() {
  const router = useRouter();
  const { id } = useParams();
  const planId = Array.isArray(id) ? id[0] : id;

  const [form, setForm] = useState<PlanForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;
      try {
        const res = await nutritionistPlanService.getPlanById(planId);
        const planData = res.data.data;
        if (!planData.features) planData.features = [];
        setForm(planData);
      } catch (err) {
        toast.error("Failed to fetch plan data");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
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
        [name]: name === "price" || name === "durationInDays" ? Number(value) : value 
      });
    }
  };

  const addFeature = () => form && setForm({ ...form, features: [...form.features, ""] });
  
  const removeFeature = (index: number) =>
    form && setForm({ ...form, features: form.features.filter((_, i) => i !== index) });

  const validateForm = (): string | null => {
    if (!form) return "Form not loaded";
    if (!form.title.trim()) return "Title is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.description.trim()) return "Description is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (form.features.some((f) => !f.trim())) return "Remove empty feature fields";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    setSubmitting(true);
    try {
      await nutritionistPlanService.updatePlan(planId!, form!);
      toast.success("Plan updated successfully!");
      router.push("/nutritionist/plans");
    } catch (err) {
      toast.error("Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Loading plan details...</p>
    </div>
  );

  if (!form) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-semibold mb-2"
          >
            <ArrowLeft size={16} /> Back to View
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Plan</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {submitting ? "Saving..." : "Update Plan"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Layout size={16} /> Basic Details
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Plan Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. 12-Week Transformation"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Weight Loss, Sports Nutrition..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell clients what this plan is about..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium resize-none"
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={16} /> Plan Features
              </h3>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Add New
              </button>
            </div>

            <div className="space-y-3">
              {form.features.map((f, idx) => (
                <div key={idx} className="flex gap-3 group animate-in fade-in slide-in-from-top-1">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400" />
                    <input
                      value={f}
                      onChange={(e) => handleChange(e, idx)}
                      name="features"
                      placeholder={`Feature #${idx + 1}`}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <section className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <IndianRupee size={16} /> Pricing & Terms
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Price (INR)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee size={16} />
                  </div>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Duration</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Clock size={16} />
                  </div>
                  <select
                    name="durationInDays"
                    value={form.durationInDays}
                    onChange={handleChange}
                    className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium appearance-none"
                  >
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={90}>90 Days (3 Months)</option>
                    <option value={180}>180 Days (6 Months)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Visibility Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`w-full px-5 py-3.5 border rounded-2xl focus:ring-4 outline-none transition-all font-bold appearance-none ${
                    form.status === 'published' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500/10' 
                    : 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500/10'
                  }`}
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Live)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Help Card */}
          <div className="p-6 bg-slate-900 rounded-[32px] text-white">
            <div className="flex gap-3 items-center mb-3">
              <AlertCircle className="text-emerald-400" size={20} />
              <h4 className="font-bold text-sm">Editing Tip</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updates to pricing or duration will only apply to <strong>new subscribers</strong>. Existing clients will keep their current plan terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}