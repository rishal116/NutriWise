"use client";
import { useEffect, useState } from "react";
import { Sparkles, Plus, X } from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

/* ============================== TYPES ============================== */
type Option = { id: string; label: string };
type CreatePlanForm = {
  title: string;
  category: string;
  duration: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
  status: string;
};

/* ============================= OPTIONS ============================= */
const DURATIONS: Option[] = [
  { id: "30", label: "1 Month" },
  { id: "90", label: "3 Months" },
  { id: "180", label: "6 Months" },
];
const CURRENCIES: Option[] = [
  { id: "INR", label: "₹ INR" },
  { id: "USD", label: "$ USD" },
  { id: "EUR", label: "€ EUR" },
];

/* ============================= PAGE ============================== */
export default function CreatePlanPage() {
  const [categories, setCategories] = useState<Option[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [priceLimits, setPriceLimits] = useState<{ min: number; max: number; currency: string } | null>(null);
  const [form, setForm] = useState<CreatePlanForm>({
    title: "",
    category: "",
    duration: "",
    price: "",
    currency: "INR",
    description: "",
    features: [],
    status: "draft",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePlanForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ====================== FETCH SPECIALIZATIONS ====================== */
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await nutritionistPlanService.getspecializations();
        const specs: string[] = res.data.specializations;
        const options: Option[] = specs.map((spec) => ({
          id: spec,
          label: spec,
        }));
        setCategories(options);
      } catch (err) {
        console.error("Failed to load specializations", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchPriceLimits = async () => {
      try {
        const res = await nutritionistPlanService.getPricingRules();
        setPriceLimits({
          min: res.data.minPrice,
          max: res.data.maxPrice,
          currency: res.data.currency,
        });
        updateField("currency", res.data.currency);
      } catch (err) {
        console.error("Failed to load pricing rules", err);
      }
    };
    fetchPriceLimits();
  }, []);

  /* ============================= HELPERS ============================= */
  const updateField = (field: keyof CreatePlanForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /* =========================== VALIDATION =========================== */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePlanForm, string>> = {};
    const price = Number(form.price);

    if (!form.title.trim()) newErrors.title = "Plan title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.duration) newErrors.duration = "Duration is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!Number.isFinite(price)) newErrors.price = "Invalid price";

    if (priceLimits) {
      if (price < priceLimits.min) newErrors.price = `Minimum ${priceLimits.currency} ${priceLimits.min}`;
      if (price > priceLimits.max) newErrors.price = `Maximum ${priceLimits.currency} ${priceLimits.max}`;
    }

    if (!form.description.trim()) newErrors.description = "Description is required";

    if (form.features.length === 0) newErrors.features = "Add at least one feature";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================== SUBMIT =========================== */
  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      durationInDays: Number(form.duration),
      price: Number(form.price),
      currency: form.currency,
      description: form.description.trim(),
      features: form.features.filter((f) => f.trim()),
      status, // send correct status
    };

    try {
      await nutritionistPlanService.savePlan(payload);
      alert(`Plan ${status === "draft" ? "saved as draft" : "published"} successfully`);

      setForm({
        title: "",
        category: "",
        duration: "",
        price: "",
        currency: "INR",
        description: "",
        features: [],
        status: "draft",
      });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================= UI ============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        {/* HEADER */}
        <header>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-emerald-600" />
            <h1 className="text-4xl font-bold text-emerald-700">
              Create Nutrition Plan
            </h1>
          </div>
          <p className="text-gray-600">Categories are based on your specializations</p>
        </header>

        {/* FORM */}
        <div className="bg-white rounded-3xl border shadow-xl p-8 space-y-6">
          <Input label="Plan Title" value={form.title} error={errors.title} onChange={(v) => updateField("title", v)} />

          <div className="grid md:grid-cols-2 gap-6">
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

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Price"
              value={form.price}
              error={errors.price}
              onChange={(v) => {
                if (/^\d*$/.test(v)) updateField("price", v);
              }}
            />
            <Select label="Currency" value={form.currency} options={CURRENCIES} disabled={true} />
          </div>

          <Textarea label="Description" value={form.description} error={errors.description} onChange={(v) => updateField("description", v)} />

          {/* FEATURES */}
          <div>
            <Label>What You Get in This Plan</Label>
            <div className="space-y-2 mt-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={f}
                    onChange={(e) => {
                      const updated = [...form.features];
                      updated[i] = e.target.value;
                      updateField("features", updated);
                    }}
                    className="flex-1 px-4 py-2 border rounded-xl"
                    placeholder={`Feature ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateField("features", form.features.filter((_, idx) => idx !== i))
                    }
                    className="text-red-500"
                  >
                    <X />
                  </button>
                </div>
              ))}

              <button type="button" onClick={() => updateField("features", [...form.features, ""])} className="flex items-center gap-2 text-emerald-600">
                <Plus size={18} /> Add feature
              </button>

              {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl"
            >
              Save as Draft
            </button>

            <button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl"
            >
              Publish Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ UI PARTS ============================ */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-bold text-gray-700">{children}</label>;
}

function Input({ label, value, onChange, error, prefix }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2">{prefix}</span>}
        <input value={value} onChange={(e) => onChange(e.target.value)} className={`w-full px-4 py-3 border rounded-xl ${prefix && "pl-10"}`} />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function Textarea({ label, value, onChange, error }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full px-4 py-3 border rounded-xl" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function Select({ label, value, options, onChange, error, disabled }: any) {
  return (
    <div>
      <Label>{label}</Label>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-gray-50">
        <option value="">{disabled ? "Loading..." : `Select ${label}`}</option>
        {options.map((o: Option) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
