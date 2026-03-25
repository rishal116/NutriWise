"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, Save, Plus, Trash2, 
  IndianRupee, Clock, Tag, Layout, 
  CheckCircle2, AlertCircle, Loader2, Upload, X,
  Type, Globe, Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

/* ============================== TYPES ============================== */
interface PlanForm {
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  status: "draft" | "published" | "archived";
  description: string;
  features: string[];
  tags: string[];
}

type Option = { id: string; label: string };

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState<PlanForm | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [priceLimits, setPriceLimits] = useState<{ min: number; max: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");



  useEffect(() => {
    const initPage = async () => {
      if (!planId) return;
      try {
        const [planRes, catRes, priceRes] = await Promise.all([
          nutritionistPlanService.getPlanById(planId),
          nutritionistPlanService.getAllowedCategories(),
          nutritionistPlanService.getPricingRules(),
        ]);

        const p = planRes.data.data;
        
        setCategories(
          (catRes.data || []).map((c: string) => ({
            id: c,
            label: c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          }))
        );

        setPriceLimits({
          min: priceRes.data.minPrice,
          max: priceRes.data.maxPrice,
        });

        setForm({
          title: p.title || "",
          category: p.category || "",
          durationInDays: p.durationInDays || 30,
          price: p.price || 0,
          status: p.status || "draft",
          description: p.description || "",
          features: p.features?.length ? p.features : [""],
          tags: p.tags || [],
        });
      } catch (err) {
        toast.error("Initialization failed");
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [planId]);

  /* ============================== HANDLERS ============================== */



  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && form) {
      e.preventDefault();
      const cleanedTag = tagInput.trim().toLowerCase();
      if (!form.tags.includes(cleanedTag)) {
        setForm({ ...form, tags: [...form.tags, cleanedTag] });
      }
      setTagInput("");
    }
  };

  const removeTag = (idx: number) => {
    if (!form) return;
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== idx) });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index?: number) => {
    if (!form) return;
    const { name, value } = e.target;

    if (name === "features" && index !== undefined) {
      const newFeatures = [...form.features];
      newFeatures[index] = value;
      setForm({ ...form, features: newFeatures });
    } else {
      setForm({ 
        ...form, 
        [name]: (name === "price" || name === "durationInDays") ? Number(value) : value 
      });
    }
  };

  const handleSubmit = async () => {
    if (!form || !planId) return;
    
    // Validation
    if (!form.title.trim()) return toast.error("Title is required");
    if (priceLimits && (form.price < priceLimits.min || form.price > priceLimits.max)) {
      return toast.error(`Price must be between ₹${priceLimits.min} and ₹${priceLimits.max}`);
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      const cleanFeatures = form.features.filter(f => f.trim() !== "");

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("durationInDays", String(form.durationInDays));
      formData.append("price", String(form.price));
      formData.append("description", form.description);
      formData.append("status", form.status);
      formData.append("features", JSON.stringify(cleanFeatures));
      formData.append("tags", JSON.stringify(form.tags));

   

      await nutritionistPlanService.updatePlan(planId, formData);
      toast.success("Changes synced successfully");
      router.push(`/nutritionist/plans/${planId}`);
    } catch (err) {
      toast.error("Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!form) return null;

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-xl py-6 mb-8 border-b border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modify Program</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">Live Editor • ID:{planId} </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={2.5} />}
            {submitting ? "Processing" : "Sync Changes"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- MAIN CONTENT --- */}
        <div className="lg:col-span-8 space-y-8">
          
         

          {/* Core Content */}
          <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Type size={14} className="text-emerald-500" /> Narrative & Context
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Program Name</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Classification</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 appearance-none">
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Program Abstract</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 resize-none leading-relaxed" />
            </div>
          </section>

          {/* Features Editor */}
          <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> Included Deliverables
              </h3>
              <button type="button" onClick={() => form && setForm({ ...form, features: [...form.features, ""] })} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors">
                + New Item
              </button>
            </div>

            <div className="space-y-4">
              {form.features.map((f, idx) => (
                <div key={idx} className="flex gap-3 group animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <input value={f} onChange={(e) => handleChange(e, idx)} name="features" placeholder="Feature detail..." className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 text-sm" />
                  </div>
                  <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, i) => i !== idx) })} className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- SIDEBAR SETTINGS --- */}
        <div className="lg:col-span-4 space-y-6">
          
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200/50 space-y-8 border border-white/5">
            <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Globe size={14} /> Commercial Model
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visibility Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-bold text-emerald-50">
                  <option value="draft" className="bg-slate-900">Draft (Hidden)</option>
                  <option value="published" className="bg-slate-900">Published (Live)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Fee (INR)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                  <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-black text-2xl text-white" />
                </div>
                {priceLimits && <p className="text-[9px] text-slate-500 font-bold ml-1">LIMIT: ₹{priceLimits.min} - ₹{priceLimits.max}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Renewal Cycle</label>
                <div className="relative">
                   <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                   <select name="durationInDays" value={form.durationInDays} onChange={handleChange} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-bold text-white appearance-none">
                    <option value={30} className="bg-slate-900">30 Days Cycle</option>
                    <option value={90} className="bg-slate-900">90 Days Cycle</option>
                    <option value={180} className="bg-slate-900">180 Days Cycle</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Meta Tags */}
          <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Tag size={14} className="text-emerald-500" /> Discovery Tags
            </h3>

            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type tag & Enter" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700" />

            <div className="flex flex-wrap gap-2 mt-5">
              {form.tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-tight transition-all hover:bg-emerald-100">
                  #{tag}
                  <button onClick={() => removeTag(i)} className="p-0.5 hover:text-red-500">
                    <X size={12} strokeWidth={3} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex gap-4">
             <Sparkles className="text-emerald-500 shrink-0 mt-1" size={18} />
             <p className="text-[10px] text-emerald-900/60 font-black leading-relaxed uppercase tracking-wider">
               Pro Tip: Use specific tags like "Keto" or "PCOD" to improve your plan's visibility in search results.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== UI HELPERS ============================== */

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-spin border-t-emerald-500" />
      <div className="text-center">
        <p className="text-slate-900 font-black text-xs uppercase tracking-[0.4em]">Loading Environment</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Retrieving Cloud Data</p>
      </div>
    </div>
  );
}