"use client";
import { useEffect, useState } from "react";
import { 
  Sparkles, Plus, X, CheckCircle2, 
  IndianRupee, Calendar, Briefcase, 
  Info, Save, Send, AlertCircle  , PlusCircle
} from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

/* ============================== TYPES ============================== */
type Option = { id: string; label: string };
type CreatePlanForm = {
  title: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  features: string[];
  status: string;
};

const DURATIONS: Option[] = [
  { id: "30", label: "30 Days (1 Month)" },
  { id: "90", label: "90 Days (3 Months)" },
  { id: "180", label: "180 Days (6 Months)" },
];

export default function CreatePlanPage() {
  const [categories, setCategories] = useState<Option[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [priceLimits, setPriceLimits] = useState<{ min: number; max: number } | null>(null);
  const router = useRouter()
  const [form, setForm] = useState<CreatePlanForm>({
    title: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    features: [""], 
    status: "draft",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePlanForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const [specRes, priceRes] = await Promise.all([
          nutritionistPlanService.getspecializations(),
          nutritionistPlanService.getPricingRules()
        ]);
        setCategories(specRes.data.specializations.map((s: string) => ({ id: s, label: s })));
        setPriceLimits({ min: priceRes.data.minPrice, max: priceRes.data.maxPrice });
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    initData();
  }, []);

  const updateField = (field: keyof CreatePlanForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePlanForm, string>> = {};
    const price = Number(form.price);

    if (!form.title.trim()) newErrors.title = "Plan title is required";
    if (!form.category) newErrors.category = "Select a specialization";
    if (!form.duration) newErrors.duration = "Select plan length";
    if (!form.price) newErrors.price = "Price is required";
    if (priceLimits && (price < priceLimits.min || price > priceLimits.max)) {
        newErrors.price = `Price must be between ₹${priceLimits.min} and ₹${priceLimits.max}`;
    }
    if (form.description.length < 20) newErrors.description = "Please provide a more detailed description";
    if (form.features.filter(f => f.trim()).length === 0) newErrors.features = "List at least one feature";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    setIsSubmitting(true);
    toast.promise(
      nutritionistPlanService.savePlan({
      ...form,
      status,
      durationInDays: Number(form.duration),
      price: Number(form.price),
    }),
    {
      loading: status === "published" ? "Publishing your plan..." : "Saving draft...",
      success: () => {
        // Redirect after a short delay so they can see the success toast
        setTimeout(() => {
          router.push("/nutritionist/plans");
        }, 1500);
        
        return status === "published" 
          ? "Plan published successfully!" 
          : "Draft saved successfully!";
      },
      error: (err) => {
        setIsSubmitting(false);
        return err?.response?.data?.message || "Something went wrong";
      },
      finally: () => {
        // We don't set isSubmitting to false here if we are redirecting 
        // to prevent "double-clicks" while the page changes.
      }
    }
  );
};
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ACTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="text-emerald-600" />
            Create Nutrition Plan
          </h1>
          <p className="text-sm text-gray-500">Draft your plan details and publishing parameters.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
            >
                <Save size={18} /> Save Draft
            </button>
            <button
                onClick={() => handleSubmit("published")}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
            >
                <Send size={18} /> {isSubmitting ? "Publishing..." : "Publish Plan"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard icon={Briefcase} title="Basic Information">
            <div className="space-y-4">
              <Input 
                label="Plan Title" 
                placeholder="e.g. 12-Week Transformation Program" 
                value={form.title} 
                error={errors.title} 
                onChange={(v) => updateField("title", v)} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={form.category}
                  options={categories}
                  disabled={loadingCategories}
                  error={errors.category}
                  onChange={(v) => updateField("category", v)}
                />
                <Select
                  label="Duration"
                  value={form.duration}
                  options={DURATIONS}
                  error={errors.duration}
                  onChange={(v) => updateField("duration", v)}
                />
              </div>

              <Textarea 
                label="Description" 
                placeholder="Detail what clients can expect from this journey..." 
                value={form.description} 
                error={errors.description} 
                onChange={(v) => updateField("description", v)} 
              />
            </div>
          </SectionCard>

          <SectionCard icon={Sparkles} title="Plan Features">
            <p className="text-xs text-gray-500 mb-4 italic">List the specific deliverables (e.g., Weekly calls, Meal logs).</p>
            <div className="space-y-3">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2 group">
                  <div className="relative flex-1">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      value={f}
                      onChange={(e) => {
                        const updated = [...form.features];
                        updated[i] = e.target.value;
                        updateField("features", updated);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all"
                      placeholder="Add a benefit..."
                    />
                  </div>
                  {form.features.length > 1 && (
                    <button
                      onClick={() => updateField("features", form.features.filter((_, idx) => idx !== i))}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                onClick={() => updateField("features", [...form.features, ""])}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 p-2 mt-2 transition-colors"
              >
                <Plus size={18} /> Add another feature
              </button>
              {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
            </div>
          </SectionCard>
        </div>

        {/* SIDEBAR AREA */}
        <div className="lg:col-span-1 space-y-6">
          <SectionCard icon={IndianRupee} title="Pricing">
            <Input
              label="Set Price"
              placeholder="0.00"
              value={form.price}
              error={errors.price}
              prefix={<IndianRupee className="w-4 h-4 text-gray-400" />}
              onChange={(v) => { if (/^\d*$/.test(v)) updateField("price", v); }}
            />
            <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
               <div className="flex gap-2 text-emerald-800">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Choose a price that reflects your expertise. Most successful nutritionists set their 30-day plans between ₹2000 - ₹5000.
                  </p>
               </div>
            </div>
          </SectionCard>

          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl shadow-gray-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Plan Summary</h3>
            <div className="space-y-4">
              <SummaryItem label="Title" value={form.title || "Untitled Plan"} />
              <SummaryItem label="Duration" value={DURATIONS.find(d => d.id === form.duration)?.label || "Not selected"} />
              <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                <span className="text-xs text-gray-400 font-medium">Final Price</span>
                <span className="text-2xl font-bold text-emerald-400">₹{form.price || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ SUB-COMPONENTS ============================ */

function SectionCard({ icon: Icon, title, children }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="font-bold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function SummaryItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{label}</p>
            <p className="text-sm font-medium line-clamp-1">{value}</p>
        </div>
    );
}

function Input({ label, value, onChange, error, prefix, placeholder }: any) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase">{label}</label>
      <div className="relative group">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-600">{prefix}</span>}
        <input 
          placeholder={placeholder}
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className={`w-full ${prefix ? "pl-11" : "px-4"} py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all outline-none text-sm text-gray-700`} 
        />
      </div>
      {error && <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">{error}</p>}
    </div>
  );
}

function Textarea({ label, value, onChange, error, placeholder }: any) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase">{label}</label>
      <textarea 
        placeholder={placeholder}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        rows={4} 
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all outline-none text-sm text-gray-700 resize-none" 
      />
      {error && <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">{error}</p>}
    </div>
  );
}

function Select({ label, value, options, onChange, error, disabled }: any) {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1 uppercase">{label}</label>
      <select 
        value={value} 
        disabled={disabled} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white transition-all outline-none text-sm text-gray-700 appearance-none cursor-pointer"
      >
        <option value="">{disabled ? "Loading..." : `Select ${label}`}</option>
        {options.map((o: Option) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-[10px] mt-1 ml-1 font-semibold">{error}</p>}
    </div>
  );
}