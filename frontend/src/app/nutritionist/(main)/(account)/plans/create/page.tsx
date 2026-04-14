"use client";

import { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import {
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  IndianRupee,
  Briefcase,
  Info,
  Save,
  Send,
  PlusCircle,
  Image as ImageIcon,
  Tag,
  Trash2,
  Upload,
  AlertCircle,
} from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutritionistPlan.service";
import { useRouter } from "next/navigation";
import {
  Select,
  SummaryItem,
  SectionCard,
  Input,
  Textarea,
} from "@/components/nutritionist/NutritionistPlan";
import { toast } from "sonner";

/* ============================== TYPES ============================== */

type Option = { id: string; label: string };

type CreatePlanPayload = {
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  currency: string;
  description: string;
  features: string[];
  tags: string[];
  status: "draft" | "published";
};

type CreatePlanForm = {
  title: string;
  category: string;
  duration: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
  tags: string[];
};

/* ============================== CONSTANTS ============================== */

const DURATIONS: Option[] = [
  { id: "30", label: "30 Days (1 Month)" },
  { id: "90", label: "90 Days (3 Months)" },
  { id: "180", label: "180 Days (6 Months)" },
];

export default function CreatePlanPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Option[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [priceLimits, setPriceLimits] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<CreatePlanForm>({
    title: "",
    category: "",
    duration: "",
    price: "",
    currency: "INR",
    description: "",
    features: [""],
    tags: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePlanForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ============================== INIT ============================== */

  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, priceRes] = await Promise.all([
          nutritionistPlanService.getAllowedCategories(),
          nutritionistPlanService.getPricingRules(),
        ]);

        setCategories(
          (catRes.data || []).map((c: string) => ({
            id: c,
            label: c
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          })),
        );

        setPriceLimits({
          min: priceRes.data.minPrice,
          max: priceRes.data.maxPrice,
        });
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    initData();
  }, []);

  /* ============================== HANDLERS ============================== */

  const updateField = (field: keyof CreatePlanForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        updateField("tags", [...form.tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    updateField(
      "tags",
      form.tags.filter((_, i) => i !== index),
    );
  };

  const validateForm = () => {
    const newErrors: any = {};
    const price = Number(form.price);

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Select a category";
    if (!form.duration) newErrors.duration = "Select duration";

    // Price Validation with Alert logic
    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (priceLimits) {
      if (price < priceLimits.min || price > priceLimits.max) {
        // This string will be passed to your Input component's error prop
        newErrors.price = `Price must be between ₹${priceLimits.min} and ₹${priceLimits.max}`;

        toast.error("Invalid Price Range", {
          description: `Please set a price between ₹${priceLimits.min} and ₹${priceLimits.max}`,
          icon: <AlertCircle className="text-red-500" />,
        });
      }
    }

    if (form.description.length < 20)
      newErrors.description = "Min 20 characters";
    if (form.features.filter((f) => f.trim()).length === 0)
      newErrors.features = "Add 1 feature";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("durationInDays", form.duration);
    formData.append("price", form.price);
    formData.append("currency", form.currency);
    formData.append("description", form.description);
    formData.append("status", status);

    // arrays → stringify
    formData.append(
      "features",
      JSON.stringify(form.features.filter((f) => f.trim())),
    );
    formData.append("tags", JSON.stringify(form.tags));

    toast.promise(nutritionistPlanService.savePlan(formData), {
      loading: status === "published" ? "Publishing..." : "Saving draft...",
      success: () => {
        setTimeout(() => router.push("/nutritionist/plans"), 1500);
        return status === "published" ? "Plan live! 🎉" : "Draft saved";
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.message || "Failed to save plan";
      },
    });
  };
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PlusCircle className="text-emerald-600 w-8 h-8" />
            Create New Plan
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Design your professional nutrition program.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
          >
            <Save size={18} className="inline mr-2" /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
          >
            <Send size={18} className="inline mr-2" /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SectionCard icon={Briefcase} title="Core Details">
            <div className="space-y-5">
              <Input
                label="Plan Title"
                placeholder="e.g. Keto Weight Loss"
                value={form.title}
                error={errors.title}
                onChange={(v) => updateField("title", v)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Describe the plan..."
                value={form.description}
                error={errors.description}
                onChange={(v) => updateField("description", v)}
              />
            </div>
          </SectionCard>

          <SectionCard icon={Sparkles} title="Deliverables">
            <div className="space-y-3">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <div className="relative flex-1">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      value={f}
                      onChange={(e) => {
                        const updated = [...form.features];
                        updated[i] = e.target.value;
                        updateField("features", updated);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                      placeholder="Feature detail..."
                    />
                  </div>
                  {form.features.length > 1 && (
                    <button
                      onClick={() =>
                        updateField(
                          "features",
                          form.features.filter((_, idx) => idx !== i),
                        )
                      }
                      className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => updateField("features", [...form.features, ""])}
                className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Add Deliverable
              </button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard icon={IndianRupee} title="Pricing">
            <Input
              label="Plan Price"
              placeholder="0"
              value={form.price}
              error={errors.price}
              prefix={<IndianRupee className="w-4 h-4 text-gray-400" />}
              onChange={(v) => {
                if (/^\d*$/.test(v)) updateField("price", v);
              }}
            />
            {/* Dynamic Alert Message */}
            {priceLimits &&
            form.price &&
            (Number(form.price) < priceLimits.min ||
              Number(form.price) > priceLimits.max) ? (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 mt-2">
                <AlertCircle
                  size={14}
                  className="text-red-500 mt-0.5 shrink-0"
                />
                <p className="text-xs text-red-700 font-medium leading-tight">
                  Attention: Professional plans must be priced between
                  <span className="font-bold"> ₹{priceLimits.min}</span> and
                  <span className="font-bold"> ₹{priceLimits.max}</span>.
                </p>
              </div>
            ) : (
              priceLimits && (
                <p className="text-[10px] text-gray-400 mt-1 italic px-1 flex items-center gap-1">
                  <Info size={10} /> Allowed range: ₹{priceLimits.min} - ₹
                  {priceLimits.max}
                </p>
              )
            )}
          </SectionCard>

          <SectionCard icon={Tag} title="Tags (Optional)">
            <input
              type="text"
              value={tagInput}
              onKeyDown={addTag}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Type tag & Enter"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {form.tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100"
                >
                  #{tag}
                  <button onClick={() => removeTag(i)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </SectionCard>

          <div className="bg-emerald-900 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6">
              Live Summary
            </h3>
            <div className="space-y-4">
              <SummaryItem label="Plan Name" value={form.title || "Untitled"} />
              <SummaryItem
                label="Duration"
                value={
                  DURATIONS.find((d) => d.id === form.duration)?.label ||
                  "Not set"
                }
              />
              <div className="pt-6 border-t border-emerald-800 flex justify-between items-end">
                <span className="text-xs text-emerald-300 font-bold uppercase">
                  Client Pays
                </span>
                <span className="text-3xl font-bold text-white">
                  ₹{form.price || "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
