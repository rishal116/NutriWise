"use client";

import React, { useState } from "react";
import { adminChallengeService } from "@/services/admin/adminChallenge.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createChallengeSchema } from "@/validations/challenge.validation";
import {
  CreateChallengeDTO,
  ChallengeType,
  ChallengeDifficulty,
  ChallengeCategory,
  ChallengeVisibility,
} from "@/types/challenge";
import { Section } from "./components/Section";
import { FieldError } from "./components/FieldError";
import { Chip } from "./components/Chip";
import { Pill } from "./components/Pill";
import { StepDot } from "./components/StepDot";
import { MediaGallerySection } from "./components/MediaGallerySection";
import { SingleMediaUploader } from "./components/SingleMediaUploader";
import {
  FileText,
  Tag,
  CreditCard,
  Rocket,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Flame,
  Globe,
  Lock,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { getErrorMessage } from "@/utils/errorHandler";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ZodLikeError {
  errors?: Array<{ message: string }>;
}

// ── Constants ──────────────────────────────────────────────────────────────────

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
  isFeatured: false,
  isTrending: false,
  isRecommended: false,
  visibility: "public",
  benefits: [],
  equipmentNeeded: [],
  estimatedCaloriesBurn: 0,
  seoTitle: "",
  seoDescription: "",
};

const STEPS = [
  { id: 1, label: "Basics", icon: FileText, sub: "Title, description & type" },
  { id: 2, label: "Media", icon: Tag, sub: "Visuals & categorization" },
  { id: 3, label: "Access", icon: CreditCard, sub: "Pricing & visibility" },
  { id: 4, label: "Review", icon: Rocket, sub: "Summary & SEO" },
] as const;

const DIFFICULTY_CONFIG: Record<
  ChallengeDifficulty,
  { dot: string; text: string; bg: string }
> = {
  easy: {
    dot: "bg-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  medium: {
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  hard: {
    dot: "bg-red-400",
    text: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
};

const DURATION_OPTIONS = [7, 14, 21, 30, 45, 60, 90] as const;

// ── Shared class strings ───────────────────────────────────────────────────────

const INPUT_CLS =
  "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";

const INPUT_ERR_CLS =
  "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30";

const SELECT_CLS =
  "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-[13px] text-slate-700 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";

const LABEL_CLS =
  "block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5";

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractErrorMessage(err: unknown): string {
  return getErrorMessage(err);
}

function splitByComma(value: string): string[] {
  return value.split(",").map((s) => s.trim());
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreateChallengePage() {
  const [form, setForm] = useState<CreateChallengeDTO>(DEFAULT_STATE);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // ── Field updater ──────────────────────────────────────────────────────────

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
        .pick({ [field]: true } as Record<typeof field, true>)
        .parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err: unknown) {
      const zodErr = err as ZodLikeError;
      const message = zodErr.errors?.[0]?.message ?? "Invalid field";
      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const validateCurrentStep = (): boolean => {
    if (step === 1 && (!form.title || form.title.length < 5)) {
      toast.error("Title must be at least 5 characters");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setStep((s) => Math.min(STEPS.length, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      // Strip File objects for schema validation
      const payload = {
        ...form,
        coverImageFile: undefined,
        bannerImageFile: undefined,
        introVideoFile: undefined,
        media: form.media?.map(({ file: _file, thumbnailFile: _thumbnailFile, ...rest }) => rest),
      };

      const result = createChallengeSchema.safeParse(payload);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (typeof field === "string") fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        toast.error("Validation failed", {
          description: "Please fix the highlighted fields.",
        });
        return;
      }

      // Build FormData
      const fd = new FormData();
      (Object.entries(form) as [string, unknown][]).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key.endsWith("File") || key === "media") return;

        if (Array.isArray(value)) {
          fd.append(key, JSON.stringify(value));
        } else if (typeof value === "object") {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, String(value));
        }
      });

      // File fields
      if (form.coverImageFile) fd.append("coverImage", form.coverImageFile);
      if (form.bannerImageFile) fd.append("bannerImage", form.bannerImageFile);
      if (form.introVideoFile) fd.append("introVideo", form.introVideoFile);

      // Gallery
      const mediaMeta: object[] = [];
      form.media?.forEach((item) => {
        if (item.file) {
          fd.append("mediaFiles", item.file);
          const { file: _file, thumbnailFile: _thumbnailFile, ...rest } = item;
          mediaMeta.push(rest);
        }
      });
      if (mediaMeta.length > 0) {
        fd.append("mediaMetadata", JSON.stringify(mediaMeta));
      }

      await adminChallengeService.createChallenge(fd);
      toast.success("Challenge published!", {
        description: `"${form.title}" has been created.`,
      });
      router.push("/admin/challenges");
    } catch (err: unknown) {
      toast.error("Failed to publish", {
        description: extractErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;
  const currentDiff = DIFFICULTY_CONFIG[form.difficulty];
  const currentStep = STEPS.find((s) => s.id === step)!;
  const StepIcon = currentStep.icon;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-slate-50 to-white px-4 py-10 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Sparkles className="text-teal-500" size={28} />
              Create Challenge
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-md">
              Design a transformative health journey for your community.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phase</span>
            <span className="text-lg font-black text-teal-600 leading-none">{step}</span>
            <span className="text-lg text-slate-300 leading-none">/</span>
            <span className="text-sm font-bold text-slate-400 leading-none">{STEPS.length}</span>
          </div>
        </div>

        {/* Step rail */}
        <div className="flex items-center justify-between px-2 overflow-x-auto pb-4 scrollbar-hide">
          {STEPS.map((s, i) => {
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => { if (s.id <= step) setStep(s.id); }}
                  className="flex flex-col items-center gap-2 group min-w-[70px] transition-all"
                >
                  <StepDot num={s.id} active={isActive} done={isDone} />
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    isActive ? "text-teal-600" : isDone ? "text-emerald-500" : "text-slate-400"
                  }`}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 min-w-[30px] mx-2 mb-6">
                    <div className={`h-1 rounded-full transition-all duration-700 ${
                      isDone
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                        : "bg-slate-200"
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(20,184,166,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step header */}
          <div className="px-8 pt-8 pb-6 flex items-center gap-5 bg-gradient-to-b from-white to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm shadow-teal-100/50">
              <StepIcon size={22} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {currentStep.label}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {currentStep.sub}
              </p>
            </div>
          </div>

          {/* Step content */}
          <div className="px-8 pb-10 min-h-[420px] space-y-8 animate-in fade-in duration-500">

            {/* ── STEP 1 — Basics ── */}
            {step === 1 && (
              <>
                <Section title="The Hook" subtitle="Name and describe your transformation program">
                  <div className="space-y-6">
                    <div>
                      <label className={LABEL_CLS}>Challenge Title *</label>
                      <input
                        className={`${INPUT_CLS} text-[15px] font-bold py-4 ${errors.title ? INPUT_ERR_CLS : ""}`}
                        placeholder="e.g. 30-Day Hydration Mastery"
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                      />
                      <FieldError msg={errors.title} />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Short Description</label>
                      <input
                        className={INPUT_CLS}
                        placeholder="A powerful one-liner that summarizes the goal"
                        value={form.shortDescription ?? ""}
                        onChange={(e) => update("shortDescription", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Detailed Journey</label>
                      <textarea
                        rows={4}
                        className={`${INPUT_CLS} resize-none leading-relaxed min-h-[120px]`}
                        placeholder="Deep dive into what participants will achieve day by day…"
                        value={form.description ?? ""}
                        onChange={(e) => update("description", e.target.value)}
                      />
                    </div>
                  </div>
                </Section>

                <Section title="Dynamics" subtitle="Define the pace and intensity">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className={LABEL_CLS}>Duration</label>
                      <select
                        className={SELECT_CLS}
                        value={form.duration}
                        onChange={(e) => update("duration", Number(e.target.value))}
                      >
                        {DURATION_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d} Days</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={LABEL_CLS}>Difficulty</label>
                      <div className="relative">
                        <select
                          className={`${SELECT_CLS} pl-10`}
                          value={form.difficulty}
                          onChange={(e) => update("difficulty", e.target.value as ChallengeDifficulty)}
                        >
                          <option value="easy">Beginner</option>
                          <option value="medium">Intermediate</option>
                          <option value="hard">Advanced</option>
                        </select>
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-sm ${currentDiff.dot}`} />
                      </div>
                    </div>

                    <div>
                      <label className={LABEL_CLS}>Main Focus</label>
                      <select
                        className={SELECT_CLS}
                        value={form.type}
                        onChange={(e) => update("type", e.target.value as ChallengeType)}
                      >
                        <option value="fitness">Fitness</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="mental">Mental Health</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="productivity">Productivity</option>
                      </select>
                    </div>

                    <div>
                      <label className={LABEL_CLS}>Est. Calorie Burn</label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          className={`${INPUT_CLS} pr-12`}
                          placeholder="0"
                          value={form.estimatedCaloriesBurn ?? 0}
                          onChange={(e) => update("estimatedCaloriesBurn", Number(e.target.value))}
                        />
                        <Flame size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ── STEP 2 — Media & Tags ── */}
            {step === 2 && (
              <>
                <Section title="Classification" subtitle="How this challenge will be organized">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={LABEL_CLS}>Primary Category</label>
                      <select
                        className={SELECT_CLS}
                        value={form.category}
                        onChange={(e) => update("category", e.target.value as ChallengeCategory)}
                      >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="mental_wellness">Mental Wellness</option>
                        <option value="hydration">Hydration</option>
                        <option value="productivity">Productivity</option>
                        <option value="custom">Other / Custom</option>
                      </select>
                      {form.category === "custom" && (
                        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                          <label className={LABEL_CLS}>Custom Category Name</label>
                          <input
                            className={INPUT_CLS}
                            placeholder="e.g. Heart Health"
                            value={form.customCategory ?? ""}
                            onChange={(e) => update("customCategory", e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={LABEL_CLS}>Search Tags</label>
                      <input
                        className={INPUT_CLS}
                        placeholder="cardio, vegan, mindset (comma-separated)"
                        value={form.tags?.join(", ") ?? ""}
                        onChange={(e) =>
                          update("tags", e.target.value ? splitByComma(e.target.value) : [])
                        }
                      />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.tags?.filter(Boolean).map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg bg-slate-100 text-[11px] font-black text-slate-500 border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="Cinematics" subtitle="High-quality visuals to attract users">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SingleMediaUploader
                      label="Cover (3:4 aspect)"
                      accept="image/*"
                      value={form.coverImage ?? ""}
                      onChange={(file, url) => {
                        update("coverImage", url);
                        setForm((p) => ({ ...p, coverImageFile: file ?? undefined }));
                      }}
                      mediaType="image"
                    />
                    <SingleMediaUploader
                      label="Banner (16:9 aspect)"
                      accept="image/*"
                      value={form.bannerImage ?? ""}
                      onChange={(file, url) => {
                        update("bannerImage", url);
                        setForm((p) => ({ ...p, bannerImageFile: file ?? undefined }));
                      }}
                      mediaType="image"
                    />
                    <div className="md:col-span-2">
                      <SingleMediaUploader
                        label="Intro Video Trailer"
                        accept="video/*"
                        value={form.introVideo ?? ""}
                        onChange={(file, url) => {
                          update("introVideo", url);
                          setForm((p) => ({ ...p, introVideoFile: file ?? undefined }));
                        }}
                        mediaType="video"
                      />
                    </div>
                  </div>
                </Section>

                <MediaGallerySection
                  items={form.media ?? []}
                  onChange={(items) => update("media", items)}
                />
              </>
            )}

            {/* ── STEP 3 — Access & Benefits ── */}
            {step === 3 && (
              <>
                <Section title="Access Control" subtitle="Select the pricing model">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <button
                      type="button"
                      onClick={() => update("isPremium", false)}
                      className={`relative flex items-center gap-4 p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                        !form.isPremium
                          ? "border-teal-500 bg-teal-50/50 shadow-lg shadow-teal-500/10"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        !form.isPremium ? "bg-teal-500 text-white shadow-md shadow-teal-500/20" : "bg-slate-50 text-slate-400"
                      }`}>
                        🌱
                      </div>
                      <div>
                        <p className="text-[15px] font-black text-slate-800">Community Free</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Open to everyone</p>
                      </div>
                      {!form.isPremium && (
                        <CheckCircle2 size={18} className="absolute top-4 right-4 text-teal-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => update("isPremium", true)}
                      className={`relative flex items-center gap-4 p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                        form.isPremium
                          ? "border-amber-400 bg-amber-50/50 shadow-lg shadow-amber-500/10"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        form.isPremium ? "bg-amber-400 text-white shadow-md shadow-amber-500/20" : "bg-slate-50 text-slate-400"
                      }`}>
                        ⭐
                      </div>
                      <div>
                        <p className="text-[15px] font-black text-slate-800">Premium Vault</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Subscribers only</p>
                      </div>
                      {form.isPremium && (
                        <CheckCircle2 size={18} className="absolute top-4 right-4 text-amber-600" />
                      )}
                    </button>
                  </div>
                </Section>

                <Section title="Visibility" subtitle="Who can discover this challenge">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(["public", "private"] as ChallengeVisibility[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => update("visibility", v)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                          form.visibility === v
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-100 bg-white text-slate-700 hover:border-slate-200"
                        }`}
                      >
                        {v === "public" ? <Globe size={18} /> : <Lock size={18} />}
                        <span className="text-[13px] font-extrabold">
                          {v === "public" ? "Public & Searchable" : "Private (Invite Link)"}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Key Takeaways" subtitle="What participants gain and need">
                  <div className="space-y-6">
                    <div>
                      <label className={LABEL_CLS}>Benefits</label>
                      <textarea
                        rows={2}
                        className={INPUT_CLS}
                        placeholder="Better sleep, Increased strength, etc. (comma-separated)"
                        value={form.benefits?.join(", ") ?? ""}
                        onChange={(e) => update("benefits", splitByComma(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Equipment Needed</label>
                      <textarea
                        rows={2}
                        className={INPUT_CLS}
                        placeholder="Yoga mat, Dumbbells, etc. (comma-separated)"
                        value={form.equipmentNeeded?.join(", ") ?? ""}
                        onChange={(e) => update("equipmentNeeded", splitByComma(e.target.value))}
                      />
                    </div>
                  </div>
                </Section>
              </>
            )}

            {/* ── STEP 4 — Review & SEO ── */}
            {step === 4 && (
              <>
                <Section title="SEO Mastery" subtitle="How search engines see this challenge">
                  <div className="space-y-5">
                    <div>
                      <label className={LABEL_CLS}>Meta Title</label>
                      <input
                        className={INPUT_CLS}
                        placeholder="Optimized for search results"
                        value={form.seoTitle ?? ""}
                        onChange={(e) => update("seoTitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Meta Description</label>
                      <textarea
                        rows={2}
                        className={INPUT_CLS}
                        placeholder="Compelling snippet for Google…"
                        value={form.seoDescription ?? ""}
                        onChange={(e) => update("seoDescription", e.target.value)}
                      />
                    </div>
                  </div>
                </Section>

                <Section title="Final Polish" subtitle="Flags and summary">
                  <div className="flex flex-wrap gap-3">
                    <Chip
                      active={!!form.isFeatured}
                      onClick={() => update("isFeatured", !form.isFeatured)}
                    >
                      ⭐ Feature on Home
                    </Chip>
                    <Chip
                      active={!!form.isTrending}
                      onClick={() => update("isTrending", !form.isTrending)}
                    >
                      🔥 Set as Trending
                    </Chip>
                    <Chip
                      active={!!form.isRecommended}
                      onClick={() => update("isRecommended", !form.isRecommended)}
                    >
                      👍 AI Recommended
                    </Chip>
                  </div>
                </Section>

                {/* Review card */}
                <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 space-y-6 shadow-xl shadow-slate-200/50">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white rotate-12 shadow-lg shadow-teal-500/20">
                    <CheckCircle2 size={24} />
                  </div>

                  <div className="flex items-center gap-4">
                    {form.coverImage && (
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                        <Image
                          src={form.coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-xl font-black text-slate-800 leading-tight">
                        {form.title || "Untitled Masterpiece"}
                      </p>
                      <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Layers size={11} />
                        {form.type} · {form.duration} Days
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Pill>{form.category}</Pill>
                    <Pill>
                      <span className={`mr-2 w-1.5 h-1.5 rounded-full inline-block ${currentDiff.dot}`} />
                      {form.difficulty}
                    </Pill>
                    {(form.estimatedCaloriesBurn ?? 0) > 0 && (
                      <Pill>🔥 {form.estimatedCaloriesBurn} kcal</Pill>
                    )}
                    {form.isPremium && (
                      <Pill className="bg-amber-100 text-amber-700 border-amber-200">Premium</Pill>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={loading || !form.title}
                    onClick={handleSubmit}
                    className="w-full relative group overflow-hidden rounded-[1.25rem] bg-slate-900 py-4 text-sm font-black text-white shadow-2xl shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Generating Challenge…
                        </>
                      ) : (
                        <>
                          <Rocket size={18} strokeWidth={2.5} />
                          Publish to Live Feed
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer nav */}
          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-[13px] font-black text-slate-500 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <div className="flex items-center gap-2">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all duration-500 ${
                    step === s.id
                      ? "w-8 h-2 bg-teal-500 shadow-sm shadow-teal-500/40"
                      : step > s.id
                      ? "w-2 h-2 bg-emerald-400"
                      : "w-2 h-2 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 text-[13px] font-black text-white bg-slate-900 rounded-2xl hover:bg-teal-600 shadow-lg shadow-teal-900/10 transition-all"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <div className="w-[112px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}