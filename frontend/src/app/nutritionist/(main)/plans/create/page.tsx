"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Plus,
  CheckCircle2,
  IndianRupee,
  Briefcase,
  Info,
  Save,
  Send,
  PlusCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { nutritionistPlanService } from "@/services/nutritionist/nutriPlan.service";
import { PLATFORM_FEATURES } from "@/constants/platform-features"; // adjust to your actual path
import { useRouter } from "next/navigation";
import {
  Select,
  SummaryItem,
  SectionCard,
  Input,
  Textarea,
} from "@/components/nutritionist/NutritionistPlan";
import { toast } from "sonner";
import { CreatePlanDto } from "@/dtos/nutritionist/plan/create-plan.dto";
import type { Specialization } from "@/types/nutritionist.types";

type Option = { id: string; label: string };

type CreatePlanForm = {
  title: string;
  specialization: Specialization | "";
  durationDays: string;
  price: string;
  description: string;
  features: string[];
};
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

  const [form, setForm] = useState<CreatePlanForm>({
    title: "",
    specialization: "",
    durationDays: "",
    price: "",
    description: "",
    features: [""],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePlanForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const metadata = await nutritionistPlanService.getPlanMetadata();
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
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    initData();
  }, []);

  const updateField = <K extends keyof CreatePlanForm>(
    field: K,
    value: CreatePlanForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreatePlanForm, string>> = {};
    const price = Number(form.price);

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.specialization)
      newErrors.specialization = "Select a specialization";

    if (!form.durationDays) newErrors.durationDays = "Select duration";

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (
      priceLimits &&
      (price < priceLimits.min || price > priceLimits.max)
    ) {
      newErrors.price = `Price must be between ₹${priceLimits.min} and ₹${priceLimits.max}`;
      toast.error("Invalid Price Range", {
        description: `Please set a price between ₹${priceLimits.min} and ₹${priceLimits.max}`,
        icon: <AlertCircle className="text-red-500" />,
      });
    }

    if (form.description.length < 20)
      newErrors.description = "Min 20 characters";
    if (form.features.filter((f) => f.trim()).length === 0)
      newErrors.features = "Add 1 feature";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (isSubmitting || !validateForm() || !form.specialization) return;

    setIsSubmitting(true);
    const payload: CreatePlanDto = {
      title: form.title,
      specialization: form.specialization,
      description: form.description,
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      currency: "INR",
      features: form.features.filter((f) => f.trim()),
      status,
    };

    toast.promise(nutritionistPlanService.createPlan(payload), {
      loading: status === "published" ? "Publishing..." : "Saving draft...",
      success: () => {
        setTimeout(() => router.push("/nutritionist/plans"), 1500);
        return status === "published" ? "Plan live!" : "Draft saved";
      },
      error: (err: Error) => {
        setIsSubmitting(false);
        return err.message || "Failed to save plan";
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mt-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <PlusCircle className="text-emerald-600 w-8 h-8" />
            Create New Plan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Design your professional nutrition program.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <Save size={18} className="inline mr-2" /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
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
                  label="Specialization"
                  value={form.specialization}
                  options={categories}
                  disabled={loadingCategories}
                  error={errors.specialization}
                  onChange={(v) =>
                    updateField("specialization", v as Specialization)
                  }
                />

                <Select
                  label="Duration"
                  value={form.durationDays}
                  options={DURATIONS}
                  error={errors.durationDays}
                  onChange={(v) => updateField("durationDays", v)}
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
              {/* Platform features reminder — these are already included, don't duplicate them below */}
              <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                <Info
                  size={15}
                  className="text-blue-500 flex-shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-blue-900 mb-1.5">
                    Already included on every plan — no need to add these below
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORM_FEATURES.map((f) => (
                      <span
                        key={f}
                        className="text-[11px] font-medium text-blue-700 bg-white border border-blue-200 px-2 py-0.5 rounded-md"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {form.features.map((f, i) => {
                const trimmed = f.trim();
                const isDuplicate =
                  trimmed.length > 0 &&
                  form.features.filter(
                    (other) =>
                      other.trim().toLowerCase() === trimmed.toLowerCase(),
                  ).length > 1;
                const isTooShort = trimmed.length > 0 && trimmed.length < 3;
                const isPlatformFeature = PLATFORM_FEATURES.some(
                  (pf) => pf.toLowerCase() === trimmed.toLowerCase(),
                );
                const fieldError = isDuplicate
                  ? "Duplicate feature"
                  : isTooShort
                    ? "Too short"
                    : isPlatformFeature
                      ? "Already included platform-wide — no need to list it"
                      : null;

                return (
                  <div key={i}>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <CheckCircle2
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                            fieldError ? "text-red-400" : "text-emerald-500"
                          }`}
                        />
                        <input
                          value={f}
                          onChange={(e) => {
                            const updated = [...form.features];
                            updated[i] = e.target.value;
                            updateField("features", updated);
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm focus:ring-2 ${
                            fieldError
                              ? "border-red-300 focus:ring-red-500/20"
                              : "border-slate-200 focus:ring-emerald-500/20"
                          }`}
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
                          className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Remove feature"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    {fieldError && (
                      <p className="text-xs text-red-500 font-medium mt-1 pl-1">
                        {fieldError}
                      </p>
                    )}
                  </div>
                );
              })}
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
              prefix={<IndianRupee className="w-4 h-4 text-slate-400" />}
              onChange={(v) => {
                if (/^\d*$/.test(v)) updateField("price", v);
              }}
            />
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
                  Price must be between{" "}
                  <span className="font-bold">₹{priceLimits.min}</span> and{" "}
                  <span className="font-bold">₹{priceLimits.max}</span>.
                </p>
              </div>
            ) : (
              priceLimits && (
                <p className="text-[10px] text-slate-400 mt-1 italic px-1 flex items-center gap-1">
                  <Info size={10} /> Allowed range: ₹{priceLimits.min} - ₹
                  {priceLimits.max}
                </p>
              )
            )}
          </SectionCard>

          <div className="bg-emerald-900 rounded-2xl p-6 text-white">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6">
              Live Summary
            </h3>
            <div className="space-y-4">
              <SummaryItem label="Plan Name" value={form.title || "Untitled"} />
              <SummaryItem
                label="Duration"
                value={
                  DURATIONS.find((d) => d.id === form.durationDays)?.label ||
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
