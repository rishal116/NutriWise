"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ChevronDown,
  Unlock,
  Star,
  AlertTriangle,
  Lightbulb,
  ListOrdered,
  Lock,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRef } from "react";
import { adminTaskService } from "@/services/admin/adminTask.service";
import { CreateChallengeTaskDTO } from "@/types/task";
import {  getErrorMessage } from "@/utils/errorHandler";
import { InstructionStepsEditor } from "@/components/admin/tasks/InstructionStepsEditor";
import { SectionHeader } from "@/components/admin/tasks/SectionHeader";
import { StringListEditor } from "@/components/admin/tasks/StringListEditor";
import { SelectWrapper } from "@/components/admin/tasks/SelectWrapper";
import { MediaEditor } from "@/components/admin/tasks/MediaEditor";




const SECTION =
  "bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[24px] p-7 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]";

const LABEL =
  "block text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em] mb-2 px-1";

const INPUT =
  "w-full bg-zinc-50/50 border border-zinc-200/60 rounded-2xl px-5 py-3.5 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white transition-all duration-200 shadow-sm";

const SELECT =
  "w-full bg-zinc-50/50 border border-zinc-200/60 rounded-2xl px-5 py-3.5 text-[14px] text-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white transition-all duration-200 appearance-none cursor-pointer shadow-sm";

const BADGE: Record<string, string> = {
  fitness: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  nutrition: "bg-amber-50 text-amber-600 border border-amber-100",
  mental: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  easy: "bg-sky-50 text-sky-600 border border-sky-100",
  medium: "bg-orange-50 text-orange-600 border border-orange-100",
  hard: "bg-rose-50 text-rose-600 border border-rose-100",
  draft: "bg-zinc-50 text-zinc-500 border border-zinc-200",
  published: "bg-green-50 text-green-600 border border-green-100",
  archived: "bg-zinc-100 text-zinc-400 border border-zinc-200",
};

export default function CreateTaskPage() {
  const { id: challengeId } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [form, setForm] = useState<CreateChallengeTaskDTO>({
    challengeId,
    title: "",
    dayNumber: 1,
    order: 1,
    type: "fitness",
    shortDescription: "",
    description: "",
    difficulty: "easy",
    unit: "reps",
    targetValue: 1,
    estimatedDurationMinutes: 10,
    category: "general",
    isOptional: false,
    isLocked: false,
    status: "draft",
    media: [],
    instructionSteps: [],
    aiTips: [],
    safetyWarnings: [],
  });

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);

    // Update form state with preview URL for immediate feedback
    updateFormValue("coverImage", url);
  };

  const updateFormValue = <K extends keyof CreateChallengeTaskDTO>(
    key: K,
    value: CreateChallengeTaskDTO[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };
  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Task title is required");
      return false;
    }

    if (form.dayNumber < 1) {
      toast.error("Day number must be at least 1");
      return false;
    }

    if ((form.order ?? 1) < 1) {
      toast.error("Task order must be at least 1");
      return false;
    }

    // Validate instruction steps
    if (form.instructionSteps && form.instructionSteps.length > 0) {
      for (let i = 0; i < form.instructionSteps.length; i++) {
        const step = form.instructionSteps[i];
        if (!step.title.trim()) {
          toast.error(`Step ${i + 1} needs a title`);
          return false;
        }
        if (!step.description.trim()) {
          toast.error(`Step ${i + 1} needs a description`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      // ... (append all basic fields)
      formData.append("title", form.title);
      formData.append("dayNumber", String(form.dayNumber));
      formData.append("order", String(form.order));
      formData.append("type", form.type);
      formData.append("shortDescription", form.shortDescription || "");
      formData.append("description", form.description || "");
      formData.append("difficulty", form.difficulty || "easy");
      formData.append("unit", form.unit || "reps");
      formData.append("targetValue", String(form.targetValue));
      formData.append(
        "estimatedDurationMinutes",
        String(form.estimatedDurationMinutes),
      );
      formData.append("category", form.category || "general");
      formData.append("isOptional", String(form.isOptional));
      formData.append("isLocked", String(form.isLocked));
      formData.append("status", form.status || "draft");

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      // Media Files
      const mediaMetadata: Record<string, unknown>[] = [];
      if (form.media && form.media.length > 0) {
        form.media.forEach((m) => {
          if (m.file) {
            formData.append("mediaFiles", m.file);
          }
          const { file, ...rest } = m;
          mediaMetadata.push(rest);
        });
      }
      formData.append("mediaMetadata", JSON.stringify(mediaMetadata));

      // Instruction Steps & Files
      const instructionSteps = (form.instructionSteps || []).filter(
        (s) => s.title.trim() || s.description.trim(),
      );

      const cleanedSteps = instructionSteps.map((step) => {
        const stepCopy = { ...step };
        if (stepCopy.media) {
          stepCopy.media = stepCopy.media.map((m) => {
            if (m.file) {
              formData.append("instructionMediaFiles", m.file);
            }
            const { file, ...mediaRest } = m;
            return mediaRest;
          });
        }
        return stepCopy;
      });

      formData.append("instructionSteps", JSON.stringify(cleanedSteps));

      formData.append("aiTips", JSON.stringify(form.aiTips));
      formData.append("safetyWarnings", JSON.stringify(form.safetyWarnings));

      await adminTaskService.createTask(challengeId, formData);
      toast.success("Task created successfully");
      router.push(`/admin/challenges/${challengeId}/tasks`);
    } catch (error: unknown) {
      console.log("FULL ERROR:", error);
      setLoading(false);
      const message = getErrorMessage(error);
      console.log(message);
      

      toast.error(message);
    }
  };


  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12 flex items-end justify-between flex-wrap gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                Admin Portal
              </span>
              <div className="w-1 h-1 rounded-full bg-zinc-300" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Task Builder
              </span>
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
              Create Task
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              Design a new challenge task for your community.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200/50 shadow-sm">
            <span
              className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm transition-all ${BADGE[form.type]}`}
            >
              {form.type}
            </span>
            <span
              className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm transition-all ${BADGE[form.difficulty || "easy"]}`}
            >
              {form.difficulty}
            </span>
            <span
              className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm transition-all ${BADGE[form.status || "draft"]}`}
            >
              {form.status}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Basic Info */}
          <div className={SECTION}>
            <SectionHeader
              icon={<Star className="w-4 h-4" />}
              title="Basic Information"
              subtitle="Core details about this task"
            />
            <div>
              <label className={LABEL}>Title *</label>
              <input
                name="title"
                required
                placeholder="e.g. 30-minute morning run"
                value={form.title}
                onChange={handleChange}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Short Description</label>
              <textarea
                name="shortDescription"
                rows={2}
                placeholder="A brief one-liner shown in task cards…"
                value={form.shortDescription || ""}
                onChange={handleChange}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Full Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Detailed explanation of the task, goals, and context…"
                value={form.description || ""}
                onChange={handleChange}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Cover Image</label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />

              {!coverPreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition"
                >
                  <Upload className="w-5 h-5 text-zinc-500" />
                  <span className="text-sm text-zinc-600">
                    Upload cover image
                  </span>
                  <span className="text-xs text-zinc-400">PNG, JPG, WEBP</span>
                </button>
              ) : (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-200">
                  <Image
                    src={coverPreview}
                    alt="cover preview"
                    fill
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setCoverPreview("");
                      setCoverFile(null);
                      updateFormValue("coverImage", "");
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Scheduling */}
          <div className={SECTION}>
            <SectionHeader
              icon={<ListOrdered className="w-4 h-4" />}
              title="Scheduling"
              subtitle="When and where this task appears"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Day Number *</label>
                <input
                  type="number"
                  name="dayNumber"
                  min={1}
                  required
                  value={form.dayNumber}
                  onChange={handleChange}
                  className={INPUT}
                  placeholder="1"
                />
              </div>
              <div>
                <label className={LABEL}>Order</label>
                <input
                  type="number"
                  name="order"
                  min={1}
                  value={form.order}
                  onChange={handleChange}
                  className={INPUT}
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* 3. Classification */}
          <div className={SECTION}>
            <SectionHeader
              icon={<ChevronDown className="w-4 h-4" />}
              title="Classification"
              subtitle="Type, category, and difficulty"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>Type *</label>
                <SelectWrapper>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={SELECT}
                  >
                    <option value="fitness">Fitness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="mental">Mental</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <label className={LABEL}>Category</label>
                <SelectWrapper>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={SELECT}
                  >
                    <option value="general">General</option>
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="hydration">Hydration</option>
                    <option value="diet">Diet</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="sleep">Sleep</option>
                    <option value="focus">Focus</option>
                  </select>
                </SelectWrapper>
              </div>
              <div>
                <label className={LABEL}>Difficulty</label>
                <SelectWrapper>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className={SELECT}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </SelectWrapper>
              </div>
            </div>
          </div>

          {/* 4. Metrics */}
          <div className={SECTION}>
            <SectionHeader
              icon={<Star className="w-4 h-4" />}
              title="Metrics & Duration"
              subtitle="How progress is measured"
            />
            <div>
              <label className={LABEL}>Unit</label>
              <SelectWrapper>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className={SELECT}
                >
                  <option value="reps">Reps</option>
                  <option value="minutes">Minutes</option>
                  <option value="liters">Liters</option>
                  <option value="count">Count</option>
                  <option value="steps">Steps</option>
                  <option value="calories">Calories</option>
                </select>
              </SelectWrapper>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>Target Value</label>
                <input
                  type="number"
                  name="targetValue"
                  min={0}
                  value={form.targetValue || ""}
                  onChange={handleChange}
                  className={INPUT}
                  placeholder="e.g. 30"
                />
              </div>
              <div>
                <label className={LABEL}>Min Value</label>
                <input
                  type="number"
                  name="minimumValue"
                  min={0}
                  value={form.minimumValue || ""}
                  onChange={handleChange}
                  className={INPUT}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className={LABEL}>Max Value</label>
                <input
                  type="number"
                  name="maximumValue"
                  min={0}
                  value={form.maximumValue || ""}
                  onChange={handleChange}
                  className={INPUT}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <label className={LABEL}>Estimated Duration (minutes)</label>
              <input
                type="number"
                name="estimatedDurationMinutes"
                min={0}
                value={form.estimatedDurationMinutes || ""}
                onChange={handleChange}
                className={INPUT}
                placeholder="e.g. 20"
              />
            </div>
          </div>

          {/* Media */}
          <MediaEditor
            media={form.media || []}
            onChange={(u) => updateFormValue("media", u)}
          />

          {/* Instruction Steps */}
          <InstructionStepsEditor
            steps={form.instructionSteps || []}
            onChange={(u) => updateFormValue("instructionSteps", u)}
          />

          {/* AI Tips */}
          <StringListEditor
            label="AI Tips"
            icon={<Lightbulb className="w-4 h-4" />}
            subtitle="Helpful suggestions surfaced to the user during the task"
            items={form.aiTips || []}
            placeholder="e.g. Keep your back straight throughout the movement"
            onChange={(u) => updateFormValue("aiTips", u)}
          />

          {/* Safety Warnings */}
          <StringListEditor
            label="Safety Warnings"
            icon={<AlertTriangle className="w-4 h-4" />}
            subtitle="Important cautions the user should be aware of"
            items={form.safetyWarnings || []}
            placeholder="e.g. Stop immediately if you feel sharp pain"
            onChange={(u) => updateFormValue("safetyWarnings", u)}
          />

          {/* 9. Settings */}
          <div className={SECTION}>
            <SectionHeader
              icon={<Lock className="w-4 h-4" />}
              title="Settings & Visibility"
              subtitle="Control accessibility and publication status"
            />
            <div>
              <label className={LABEL}>Status</label>
              <SelectWrapper>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={SELECT}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </SelectWrapper>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => updateFormValue("isOptional", !form.isOptional)}
                className={`flex items-center gap-4 px-5 py-4 rounded-[20px] border transition-all duration-300 ${form.isOptional ? "bg-emerald-50/50 border-emerald-200 text-emerald-700 shadow-[0_4px_15px_rgb(16,185,129,0.08)]" : "bg-zinc-50 border-zinc-200/60 text-zinc-500 shadow-sm"}`}
              >
                <div
                  className={`p-2.5 rounded-xl ${form.isOptional ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-500"}`}
                >
                  <Star className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold tracking-tight">
                    Optional Task
                  </p>
                  <p className="text-[11px] font-medium opacity-70">
                    {form.isOptional
                      ? "User can skip this"
                      : "Required for progress"}
                  </p>
                </div>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${form.isOptional ? "bg-emerald-500" : "bg-zinc-300"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${form.isOptional ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateFormValue("isLocked", !form.isLocked)}
                className={`flex items-center gap-4 px-5 py-4 rounded-[20px] border transition-all duration-300 ${form.isLocked ? "bg-amber-50/50 border-amber-200 text-amber-700 shadow-[0_4px_15px_rgb(245,158,11,0.08)]" : "bg-zinc-50 border-zinc-200/60 text-zinc-500 shadow-sm"}`}
              >
                <div
                  className={`p-2.5 rounded-xl ${form.isLocked ? "bg-amber-500 text-white" : "bg-zinc-200 text-zinc-500"}`}
                >
                  {form.isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold tracking-tight">
                    Locked Task
                  </p>
                  <p className="text-[11px] font-medium opacity-70">
                    {form.isLocked
                      ? "Manual unlock required"
                      : "Always accessible"}
                  </p>
                </div>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${form.isLocked ? "bg-amber-500" : "bg-zinc-300"}`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${form.isLocked ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 pb-20">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-[20px] hover:border-zinc-400 transition-all duration-300 shadow-sm active:scale-95"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative group flex items-center gap-3 px-10 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-[20px] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create New Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
