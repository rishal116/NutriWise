"use client";

import React, { useState } from "react";
import { adminChallengeService } from "@/services/admin/adminChallenge.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createChallengeSchema } from "@/validation/challenge.validation";
import { CreateChallengeDTO, IChallengeMedia } from "@/dtos/admin/createChallenge.dto";
import { Section } from "./components/Section";
import { FieldError } from "./components/FieldError";
import { Chip } from "./components/Chip";
import { Pill } from "./components/Pill";
import { StepDot } from "./components/StepDot";
import { MediaGallerySection } from "./components/MediaGallerySection";
import { ExtractErrorMessage } from "./components/ExtractErrorMessage";
import { SingleMediaUploader } from "./components/SingleMediaUploader";
import {
  FileText, Tag, CreditCard, Trophy, Rocket,
  ChevronRight, ChevronLeft, CheckCircle2, Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Difficulty = CreateChallengeDTO["difficulty"];
type ChallengeType = CreateChallengeDTO["type"];
type Category = NonNullable<CreateChallengeDTO["category"]>;
type Visibility = NonNullable<CreateChallengeDTO["visibility"]>;

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_STATE: CreateChallengeDTO = {
  title: "",
  shortDescription: "",
  description: "",
  duration: 7,
  difficulty: "easy",
  type: "hybrid",
  category: "custom",
  customCategory: "",
  tags: [],
  isPremium: false,
  coverImage: "",
  bannerImage: "",
  introVideo: "",
  media: [],
  rewards: { xpPoints: 0, certificate: false, premiumUnlock: false },
  isFeatured: false,
  isTrending: false,
  isRecommended: false,
  visibility: "public",
  benefits: [],
  equipmentNeeded: [],
  seoTitle: "",
  seoDescription: "",
};

const STEPS = [
  { id: 1, label: "Basics",   icon: FileText,    sub: "Title, description and format"      },
  { id: 2, label: "Category", icon: Tag,         sub: "Category, tags and media assets"    },
  { id: 3, label: "Pricing",  icon: CreditCard,  sub: "Pricing and access control"         },
  { id: 4, label: "Rewards",  icon: Trophy,      sub: "XP, rewards and benefits"           },
  { id: 5, label: "Publish",  icon: Rocket,      sub: "Visibility, SEO and publish"        },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { dot: string; text: string; bg: string }> = {
  easy:   { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  medium: { dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50 border-amber-200"     },
  hard:   { dot: "bg-red-400",     text: "text-red-700",     bg: "bg-red-50 border-red-200"         },
};

// ─── Shared class strings ─────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";

const inputErrCls =
  "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30";

const selectCls =
  "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-[13px] text-slate-700 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";

const labelCls =
  "block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreateChallengePage() {
  const [form, setForm] = useState<CreateChallengeDTO>(DEFAULT_STATE);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // ── Helpers ────────────────────────────────────────────────────────────────
  const update = <K extends keyof CreateChallengeDTO>(
    key: K,
    value: CreateChallengeDTO[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const validateField = (
    field: keyof CreateChallengeDTO,
    value: CreateChallengeDTO[keyof CreateChallengeDTO],
  ) => {
    try {
      createChallengeSchema
        .pick({ [field]: true } as Record<string, true>)
        .parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error: unknown) {
      let message = "Invalid field";
      if (error instanceof Error) {
        const zodError = error as { errors?: Array<{ message: string }> };
        message = zodError.errors?.[0]?.message ?? message;
      }
      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  const validateCurrentStep = (): boolean => {
    if (step === 1 && (!form.title || form.title.length < 5)) {
      toast.error("Title must be at least 5 characters");
      return false;
    }
    if (step === 2 && form.category === "custom" && !form.customCategory?.trim()) {
      toast.error("Custom category name is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setStep((s) => Math.min(STEPS.length, s + 1));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      // 1. Validate structured payload (no files)
      const payload: CreateChallengeDTO = {
        title: form.title,
        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        duration: form.duration,
        difficulty: form.difficulty,
        type: form.type,
        category: form.category || "custom",
        customCategory: form.category === "custom" ? form.customCategory || undefined : undefined,
        tags: form.tags?.length ? form.tags : [],
        isPremium: form.isPremium ?? false,
        rewards: form.rewards,
        isFeatured: form.isFeatured ?? false,
        isTrending: form.isTrending ?? false,
        isRecommended: form.isRecommended ?? false,
        visibility: form.visibility ?? "public",
        benefits: form.benefits?.length ? form.benefits : [],
        equipmentNeeded: form.equipmentNeeded?.length ? form.equipmentNeeded : [],
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        coverImage: undefined,
        bannerImage: undefined,
        introVideo: undefined,
        media: [],
      };

      const result = createChallengeSchema.safeParse(payload);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const field = err.path[0];
          if (typeof field === "string") fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Validation failed", { description: "Please fix the highlighted fields." });
        return;
      }

      // 2. Build FormData
      const fd = new FormData();
      fd.append("title",            form.title);
      fd.append("shortDescription", form.shortDescription || "");
      fd.append("description",      form.description || "");
      fd.append("duration",         String(form.duration));
      fd.append("difficulty",       form.difficulty);
      fd.append("type",             form.type);
      fd.append("category",         form.category || "custom");
      fd.append("customCategory",   form.customCategory || "");
      fd.append("tags",             JSON.stringify(form.tags || []));
      fd.append("isPremium",        String(form.isPremium ?? false));
      fd.append("rewards",          JSON.stringify(form.rewards || {}));
      fd.append("isFeatured",       String(form.isFeatured ?? false));
      fd.append("isTrending",       String(form.isTrending ?? false));
      fd.append("isRecommended",    String(form.isRecommended ?? false));
      fd.append("visibility",       form.visibility || "public");
      fd.append("benefits",         JSON.stringify(form.benefits || []));
      fd.append("equipmentNeeded",  JSON.stringify(form.equipmentNeeded || []));
      fd.append("seoTitle",         form.seoTitle || "");
      fd.append("seoDescription",   form.seoDescription || "");

      // 3. File fields
      if (form.coverImageFile instanceof File)  fd.append("coverImage", form.coverImageFile);
      if (form.bannerImageFile instanceof File)  fd.append("bannerImage", form.bannerImageFile);
      if (form.introVideoFile instanceof File)   fd.append("introVideo", form.introVideoFile);

      // 4. Gallery
      type MediaMeta = { type: IChallengeMedia["type"]; title: string; description: string; duration?: number; thumbnailUrl?: string };
      const mediaMeta: MediaMeta[] = [];
      form.media?.forEach((item) => {
        if (item.file instanceof File) {
          fd.append("mediaFiles", item.file);
          mediaMeta.push({ type: item.type, title: item.title || "", description: item.description || "", duration: item.duration, thumbnailUrl: item.thumbnailUrl });
        }
      });
      if (mediaMeta.length > 0) fd.append("mediaMetadata", JSON.stringify(mediaMeta));

      // 5. Call API
      await adminChallengeService.createChallenge(fd);
      toast.success("Challenge published!", { description: `"${form.title}" has been created.` });
      router.push("/admin/challenges");
    } catch (err: unknown) {
      toast.error("Failed to publish", { description: ExtractErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const progress   = ((step - 1) / (STEPS.length - 1)) * 100;
  const currentDiff = DIFFICULTY_CONFIG[form.difficulty] ?? DIFFICULTY_CONFIG.easy;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Challenge
            </h1>
            <p className="text-[13px] text-slate-400 mt-0.5 font-medium">
              Build a new health challenge for the NutriWise community
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400">Step</span>
            <span className="text-[11px] font-extrabold text-teal-600">{step}</span>
            <span className="text-[11px] text-slate-300">/</span>
            <span className="text-[11px] font-bold text-slate-400">{STEPS.length}</span>
          </div>
        </div>

        {/* ── Step rail ── */}
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const isActive = step === s.id;
            const isDone   = step > s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className="flex flex-col items-center gap-1.5 group min-w-[48px]"
                >
                  <StepDot num={s.id} active={isActive} done={isDone} />
                  <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-colors ${
                    isActive ? "text-teal-600" : isDone ? "text-emerald-500" : "text-slate-400"
                  }`}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-1 mb-5">
                    <div className={`h-0.5 rounded-full transition-all duration-500 ${isDone ? "bg-emerald-300" : "bg-slate-200"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step header strip */}
          <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-slate-100">
            {(() => {
              const current = STEPS.find((s) => s.id === step)!;
              const Icon = current.icon;
              return (
                <>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <Icon size={17} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold text-slate-800 tracking-tight">
                      {current.label}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">{current.sub}</p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* ── Step content ── */}
          <div className="p-6 md:p-7 min-h-[380px] space-y-7">

            {/* ─── STEP 1 — Basics ─── */}
            {step === 1 && (
              <>
                <Section title="Core information" subtitle="What participants will see first">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Title *</label>
                      <input
                        className={`${inputCls} ${errors.title ? inputErrCls : ""}`}
                        placeholder="e.g. 30-Day Hydration Reset"
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                      />
                      <FieldError msg={errors.title} />
                    </div>
                    <div>
                      <label className={labelCls}>Short description</label>
                      <input
                        className={inputCls}
                        placeholder="One-liner that hooks participants"
                        value={form.shortDescription ?? ""}
                        onChange={(e) => update("shortDescription", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Full description</label>
                      <textarea
                        rows={4}
                        className={`${inputCls} resize-none leading-relaxed`}
                        placeholder="Explain the challenge goals, structure, and benefits…"
                        value={form.description ?? ""}
                        onChange={(e) => update("description", e.target.value)}
                      />
                    </div>
                  </div>
                </Section>

                <Section title="Format" subtitle="Duration, difficulty and challenge type">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Duration</label>
                      <select
                        className={selectCls}
                        value={form.duration}
                        onChange={(e) => update("duration", Number(e.target.value))}
                      >
                        <option value={7}>7 Days</option>
                        <option value={14}>14 Days</option>
                        <option value={30}>30 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Difficulty</label>
                      <div className="relative">
                        <select
                          className={`${selectCls} pl-8`}
                          value={form.difficulty}
                          onChange={(e) => update("difficulty", e.target.value as Difficulty)}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${currentDiff.dot}`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Type</label>
                      <select
                        className={selectCls}
                        value={form.type}
                        onChange={(e) => update("type", e.target.value as ChallengeType)}
                      >
                        <option value="fitness">Fitness</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="mental">Mental</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold mt-3 ${currentDiff.bg} ${currentDiff.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentDiff.dot}`} />
                    {form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1)} · {form.duration} days · {form.type}
                  </div>
                </Section>
              </>
            )}

            {/* ─── STEP 2 — Category + Media ─── */}
            {step === 2 && (
              <>
                <Section title="Classification" subtitle="How this challenge will be discovered">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Category</label>
                      <select
                        className={selectCls}
                        value={form.category}
                        onChange={(e) => update("category", e.target.value as Category)}
                      >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="mental_wellness">Mental Wellness</option>
                        <option value="hydration">Hydration</option>
                        <option value="productivity">Productivity</option>
                        <option value="custom">Custom</option>
                      </select>
                      {form.category === "custom" && (
                        <div className="mt-3">
                          <label className={labelCls}>Custom category name *</label>
                          <input
                            className={inputCls}
                            placeholder="Enter custom category"
                            value={form.customCategory ?? ""}
                            onChange={(e) => update("customCategory", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Tags (comma separated)</label>
                      <input
                        className={inputCls}
                        placeholder="e.g. water, health, daily habit"
                        value={form.tags?.join(", ") ?? ""}
                        onChange={(e) =>
                          update("tags", e.target.value ? e.target.value.split(",").map((t) => t.trim()) : [])
                        }
                      />
                      {(form.tags?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {form.tags?.filter((t) => t.trim()).map((tag, i) => (
                            <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                              <span className="w-1 h-1 rounded-full bg-teal-400" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Section>

                <Section title="Hero media" subtitle="Cover image, banner and intro video">
                  <div className="space-y-5">
                    <SingleMediaUploader
                      label="Cover image"
                      accept="image/png,image/jpeg,image/webp"
                      value={form.coverImage ?? ""}
                      onChange={(_file: File | null, previewUrl: string) => update("coverImage", previewUrl)}
                      mediaType="image"
                      error={errors.coverImage}
                    />
                    <SingleMediaUploader
                      label="Banner image"
                      accept="image/png,image/jpeg,image/webp"
                      value={form.bannerImage ?? ""}
                      onChange={(_file: File | null, previewUrl: string) => update("bannerImage", previewUrl)}
                      mediaType="image"
                      error={errors.bannerImage}
                    />
                    <SingleMediaUploader
                      label="Intro video"
                      accept="video/mp4,video/webm"
                      value={form.introVideo ?? ""}
                      onChange={(_file: File | null, previewUrl: string) => update("introVideo", previewUrl)}
                      mediaType="video"
                      error={errors.introVideo}
                    />
                  </div>
                </Section>

                <MediaGallerySection
                  items={(form.media as IChallengeMedia[]) ?? []}
                  onChange={(items) => setForm((prev) => ({ ...prev, media: items }))}
                />
              </>
            )}

            {/* ─── STEP 3 — Pricing ─── */}
            {step === 3 && (
              <Section title="Pricing & access" subtitle="Who can access this challenge">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Free */}
                    <button
                      type="button"
                      onClick={() => update("isPremium", false)}
                      className={`relative flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        !form.isPremium
                          ? "border-teal-500 bg-teal-50/40 shadow-[0_0_0_4px_rgba(13,148,136,0.08)]"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {!form.isPremium && <CheckCircle2 size={16} className="absolute top-4 right-4 text-teal-500" />}
                      <span className="text-2xl">🌱</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">Free</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Available to all users</p>
                      </div>
                    </button>
                    {/* Premium */}
                    <button
                      type="button"
                      onClick={() => update("isPremium", true)}
                      className={`relative flex flex-col items-start gap-2 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        form.isPremium
                          ? "border-amber-400 bg-amber-50/40 shadow-[0_0_0_4px_rgba(251,191,36,0.08)]"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {form.isPremium && <CheckCircle2 size={16} className="absolute top-4 right-4 text-amber-500" />}
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">Premium</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Subscribers only</p>
                      </div>
                    </button>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-[12px] font-semibold transition-all duration-300 ${
                    form.isPremium
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-teal-50 border-teal-100 text-teal-700"
                  }`}>
                    <Sparkles size={14} />
                    {form.isPremium
                      ? "Premium challenges are gated behind a subscription."
                      : "Free challenges are open to the entire community."}
                  </div>
                </div>
              </Section>
            )}

            {/* ─── STEP 4 — Rewards ─── */}
            {step === 4 && (
              <>
                <Section title="XP & rewards" subtitle="What participants earn on completion">
                  <div className="space-y-4">
                    <div className="max-w-[200px]">
                      <label className={labelCls}>XP points awarded</label>
                      <div className="relative">
                        <input
                          type="number"
                          className={`${inputCls} pr-12`}
                          placeholder="500"
                          value={form.rewards?.xpPoints ?? 0}
                          onChange={(e) => update("rewards", { ...form.rewards, xpPoints: Number(e.target.value) })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-teal-500">XP</span>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Reward bonuses</label>
                      <div className="flex flex-wrap gap-2">
                        <Chip
                          active={!!form.rewards?.certificate}
                          onClick={() => update("rewards", { ...form.rewards, xpPoints: form.rewards?.xpPoints ?? 0, certificate: !form.rewards?.certificate })}
                        >
                          🏅 Certificate
                        </Chip>
                        <Chip
                          active={!!form.rewards?.premiumUnlock}
                          onClick={() => update("rewards", { ...form.rewards, xpPoints: form.rewards?.xpPoints ?? 0, premiumUnlock: !form.rewards?.premiumUnlock })}
                        >
                          🔓 Premium Unlock
                        </Chip>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Benefits & equipment" subtitle="What participants need and gain">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Benefits (comma separated)</label>
                      <input
                        className={inputCls}
                        placeholder="e.g. Better sleep, More energy, Improved focus"
                        value={form.benefits?.join(", ") ?? ""}
                        onChange={(e) =>
                          update("benefits", e.target.value ? e.target.value.split(",").map((b) => b.trim()) : [])
                        }
                      />
                      {(form.benefits?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {form.benefits?.filter((b) => b.trim()).map((b, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Equipment needed (comma separated)</label>
                      <input
                        className={inputCls}
                        placeholder="e.g. Water bottle, Yoga mat, Resistance bands"
                        value={form.equipmentNeeded?.join(", ") ?? ""}
                        onChange={(e) =>
                          update("equipmentNeeded", e.target.value ? e.target.value.split(",").map((eq) => eq.trim()) : [])
                        }
                      />
                      {(form.equipmentNeeded?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {form.equipmentNeeded?.filter((e) => e.trim()).map((eq, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              <span className="w-1 h-1 rounded-full bg-blue-400" />
                              {eq}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ─── STEP 5 — Publish ─── */}
            {step === 5 && (
              <>
                <Section title="Visibility & flags" subtitle="Who sees this and how it's surfaced">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Visibility</label>
                      <div className="flex flex-wrap gap-2">
                        {(["public", "private"] as Visibility[]).map((v) => (
                          <Chip key={v} active={form.visibility === v} onClick={() => update("visibility", v)}>
                            {v === "public" ? "🌍 Public" : "🔒 Private"}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Feature flags</label>
                      <div className="flex flex-wrap gap-2">
                        <Chip active={!!form.isFeatured}    onClick={() => update("isFeatured",    !form.isFeatured)}>⭐ Featured</Chip>
                        <Chip active={!!form.isTrending}    onClick={() => update("isTrending",    !form.isTrending)}>🔥 Trending</Chip>
                        <Chip active={!!form.isRecommended} onClick={() => update("isRecommended", !form.isRecommended)}>👍 Recommended</Chip>
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="SEO" subtitle="Metadata for search engines">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>SEO title</label>
                      <input
                        className={inputCls}
                        placeholder="Optimized page title"
                        value={form.seoTitle ?? ""}
                        onChange={(e) => update("seoTitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>SEO description</label>
                      <textarea
                        rows={3}
                        className={`${inputCls} resize-none leading-relaxed`}
                        placeholder="Meta description for search engines…"
                        value={form.seoDescription ?? ""}
                        onChange={(e) => update("seoDescription", e.target.value)}
                      />
                    </div>
                  </div>
                </Section>

                {/* Summary card */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ready to publish</p>
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  </div>
                  <p className="text-[16px] font-extrabold text-slate-800 leading-tight">
                    {form.title || "Untitled Challenge"}
                  </p>
                  {form.shortDescription && (
                    <p className="text-[12px] text-slate-500 leading-relaxed">{form.shortDescription}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <Pill>{form.duration} days</Pill>
                    <Pill>
                      <span className={`mr-1 w-1.5 h-1.5 rounded-full inline-block ${currentDiff.dot}`} />
                      <span className={`capitalize ${currentDiff.text}`}>{form.difficulty}</span>
                    </Pill>
                    <Pill>{form.type}</Pill>
                    <Pill>{form.visibility === "public" ? "🌍 Public" : "🔒 Private"}</Pill>
                    {form.isPremium             && <Pill>⭐ Premium</Pill>}
                    {form.isFeatured            && <Pill>⭐ Featured</Pill>}
                    {(form.rewards?.xpPoints ?? 0) > 0 && <Pill>{form.rewards!.xpPoints} XP</Pill>}
                    {form.rewards?.certificate  && <Pill>🏅 Certificate</Pill>}
                    {(form.media as IChallengeMedia[])?.length > 0 && (
                      <Pill>🎞 {(form.media as IChallengeMedia[]).length} media item{(form.media as IChallengeMedia[]).length > 1 ? "s" : ""}</Pill>
                    )}
                  </div>
                  {(form.coverImage || form.bannerImage) && (
                    <div className="flex gap-2">
                      {form.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.coverImage} alt="cover" className="h-12 w-20 rounded-xl object-cover border border-slate-200" />
                      )}
                      {form.bannerImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.bannerImage} alt="banner" className="h-12 flex-1 rounded-xl object-cover border border-slate-200" />
                      )}
                    </div>
                  )}
                </div>

                {/* Publish button */}
                <button
                  type="button"
                  disabled={loading || !form.title}
                  onClick={handleSubmit}
                  className="w-full group relative overflow-hidden rounded-2xl bg-slate-900 py-4 text-[13px] font-extrabold text-white shadow-[0_8px_24px_-4px_rgba(15,118,110,0.45)] transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(15,118,110,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5">
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Rocket size={15} strokeWidth={2} />
                        Publish Challenge
                      </>
                    )}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* ── Footer nav ── */}
          <div className="px-6 md:px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} /> Back
            </button>

            <div className="flex items-center gap-1">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all duration-300 ${
                    step === s.id ? "w-5 h-1.5 bg-teal-500" : step > s.id ? "w-1.5 h-1.5 bg-emerald-400" : "w-1.5 h-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={step === STEPS.length}
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-slate-900 border border-transparent rounded-xl hover:bg-teal-600 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}