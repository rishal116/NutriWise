"use client";

import { useState } from "react";
import { IndianRupee, Sparkles } from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";

/* ============================== TYPES ============================== */

type Option = {
  id: string;
  label: string;
};

type PlanStatus = "draft" | "published";

type CreatePlanForm = {
  title: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  status: PlanStatus;
};

/* ============================= OPTIONS ============================= */

const CATEGORIES: Option[] = [
  { id: "weight_loss", label: "Weight Loss" },
  { id: "muscle_gain", label: "Muscle Gain" },
  { id: "diabetes", label: "Diabetes Care" },
  { id: "general", label: "General Health" },
];

const DURATIONS: Option[] = [
  { id: "30", label: "1 Month" },
  { id: "90", label: "3 Months" },
  { id: "180", label: "6 Months" },
];

const MIN_PRICE = 99;
const MAX_PRICE = 100000;
/* ============================= PAGE ============================== */

export default function CreatePlanPage() {
  const [form, setForm] = useState<CreatePlanForm>({
    title: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    status: "draft",
  });

  const updateField = (field: keyof CreatePlanForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* =========================== VALIDATION =========================== */
  
  
  const validateForm = (): string | null => {
    const price = Number(form.price);
    if (!form.title.trim()) return "Plan title is required";
    if (!form.category) return "Category is required";
    if (!form.duration) return "Duration is required";
    if (!form.price) return "Price is required";
    if (Number.isNaN(price)) return "Invalid price";
    if (price < MIN_PRICE)
        return `Price must be at least ₹${MIN_PRICE}`;
    if (price > MAX_PRICE)
        return `Price must not exceed ₹${MAX_PRICE}`;
    if (!form.description.trim()) return "Description is required";
    return null;
};

  /* =========================== SUBMIT =========================== */
const handleSubmit = async () => {
  const error = validateForm();
  if (error) {
    alert(error);
    return;
  }

  const payload = {
    title: form.title.trim(),
    category: form.category,
    durationInDays: Number(form.duration),
    price: Number(form.price),
    description: form.description.trim(),
    status: form.status,
  };

  try {
    await nutritionistPlanService.savePlan(payload);

    alert("Plan created successfully");

    // reset form (optional)
    setForm({
      title: "",
      category: "",
      duration: "",
      price: "",
      description: "",
      status: "draft",
    });
  } catch (err: any) {
    alert(err?.response?.data?.message || "Something went wrong");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 py-8">

        {/* =========================== HEADER =========================== */}
        <header className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="text-emerald-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Create Nutrition Plan
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Create a subscription plan users can purchase
          </p>
        </header>

        {/* =========================== FORM =========================== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-2xl p-8 md:p-10 space-y-8">

          <Input
            label="Plan Title"
            placeholder="Weight Loss – Beginner"
            value={form.title}
            onChange={(v) => updateField("title", v)}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Category"
              value={form.category}
              options={CATEGORIES}
              onChange={(v) => updateField("category", v)}
            />

            <Select
              label="Duration"
              value={form.duration}
              options={DURATIONS}
              onChange={(v) => updateField("duration", v)}
            />
          </div>

          {/* =========================== PRICE =========================== */}
          <div>
            <Label>Price</Label>
            <div className="relative mt-2">
              <IndianRupee
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                size={20}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.price}
                onChange={(e) => {
                  // allow only digits (NO e, +, -)
                  const value = e.target.value.replace(/\D/g, "");
                  updateField("price", value);
                }}
                placeholder="1999"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all duration-200 text-gray-800"
              />
            </div>
          </div>

          <Textarea
            label="Description"
            placeholder="Explain what the user gets in this plan"
            value={form.description}
            onChange={(v) => updateField("description", v)}
          />

          {/* =========================== STATUS =========================== */}
          <div>
            <Label>Status</Label>
            <div className="flex gap-4 mt-2">
              {(["draft", "published"] as PlanStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateField("status", s)}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 ${
                    form.status === s
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "draft" ? "Draft" : "Publish"}
                </button>
              ))}
            </div>
          </div>

          {/* =========================== ACTIONS =========================== */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ UI PARTS ============================ */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
      {children}
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all duration-200 text-gray-800 mt-2"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value"
>) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all duration-200 text-gray-800 resize-none mt-2"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none transition-all duration-200 text-gray-800 appearance-none cursor-pointer mt-2"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
