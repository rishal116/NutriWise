"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Star,
  ListOrdered,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { adminTaskService } from "@/services/admin/adminTask.service";
import {
  CreateChallengeTaskDTO,
  IChallengeTask,
  ChallengeTaskMediaDTO,
  ChallengeTaskInstructionStepDTO,
} from "@/types/task";
import { getErrorMessage } from "@/utils/errorHandler";

import { SectionHeader } from "@/components/admin/tasks/SectionHeader";
import { MediaEditor } from "@/components/admin/tasks/MediaEditor";
import { InstructionStepsEditor } from "@/components/admin/tasks/InstructionStepsEditor";

const SECTION =
  "bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[24px] p-7 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

const LABEL =
  "block text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em] mb-2 px-1";

const INPUT =
  "w-full bg-zinc-50/50 border border-zinc-200/60 rounded-2xl px-5 py-3.5 text-[14px] text-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white transition-all duration-200";

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverPreview, setCoverPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [form, setForm] = useState<CreateChallengeTaskDTO>({
    challengeId: "",
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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);

        const res = await adminTaskService.getTaskById(taskId);
        const task: IChallengeTask = res.data;

        setForm({
          challengeId: task.challengeId,
          title: task.title,
          dayNumber: task.dayNumber,
          order: task.order,
          type: task.type,
          shortDescription: task.shortDescription ?? "",
          description: task.description ?? "",
          difficulty: task.difficulty,
          unit: task.unit,
          targetValue: task.targetValue,
          minimumValue: task.minimumValue,
          maximumValue: task.maximumValue,
          estimatedDurationMinutes: task.estimatedDurationMinutes,
          category: task.category,
          isOptional: task.isOptional,
          isLocked: task.isLocked,
          status: task.status,
          media: task.media ?? [],
          instructionSteps: task.instructionSteps ?? [],
          aiTips: task.aiTips ?? [],
          safetyWarnings: task.safetyWarnings ?? [],
          coverImage: task.coverImage,
        });

        if (task.coverImage) {
          setCoverPreview(task.coverImage);
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error) || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      void fetchTask();
    }
  }, [taskId]);

  const handleCoverImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const updateFormValue = <K extends keyof CreateChallengeTaskDTO>(
    key: K,
    value: CreateChallengeTaskDTO[K],
  ): void => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value, type } = e.target;

    const parsedValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
          ? Number(value)
          : value;

    updateFormValue(
      name as keyof CreateChallengeTaskDTO,
      parsedValue as never,
    );
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) {
      toast.error("Task title is required");
      return false;
    }

    if (form.instructionSteps?.length) {
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (
          ["media", "instructionSteps", "aiTips", "safetyWarnings"].includes(
            key,
          )
        ) {
          return;
        }

        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (coverFile) {
        formData.append("coverImage", coverFile);
      }

      const mediaMetadata: Omit<ChallengeTaskMediaDTO, "file" | "thumbnailFile">[] =
        [];

      form.media?.forEach((media) => {
        if (media.file) {
          formData.append("mediaFiles", media.file);
        }

        const { file, thumbnailFile, ...rest } = media;
        void file;
        void thumbnailFile;

        mediaMetadata.push(rest);
      });

      formData.append("mediaMetadata", JSON.stringify(mediaMetadata));

      const validInstructionSteps = (form.instructionSteps ?? []).filter(
        (step) => step.title.trim() || step.description.trim(),
      );

      const cleanedSteps: ChallengeTaskInstructionStepDTO[] =
        validInstructionSteps.map((step) => {
          const cleanedMedia =
            step.media?.map((media) => {
              if (media.file) {
                formData.append("instructionMediaFiles", media.file);
              }

              const { file, thumbnailFile, ...mediaRest } = media;
              void file;
              void thumbnailFile;

              return mediaRest;
            }) ?? [];

          return {
            ...step,
            media: cleanedMedia,
          };
        });

      formData.append("instructionSteps", JSON.stringify(cleanedSteps));
      formData.append("aiTips", JSON.stringify(form.aiTips ?? []));
      formData.append(
        "safetyWarnings",
        JSON.stringify(form.safetyWarnings ?? []),
      );

      await adminTaskService.updateTask(taskId, formData);

      toast.success("Task updated successfully");

      router.push(`/admin/challenges/${form.challengeId}/tasks`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 mb-2 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
              Edit Task
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={SECTION}>
            <SectionHeader
              icon={<Star className="w-4 h-4" />}
              title="Basics"
              subtitle="Core task details"
            />

            <div className="space-y-4">
              <div>
                <label className={LABEL}>Title</label>
                <input
                  name="title"
                  required
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
                  value={form.shortDescription ?? ""}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Full Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description ?? ""}
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

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 group">
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                      <Upload size={32} />
                      <p className="text-xs font-bold mt-2">
                        Click to upload
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={SECTION}>
            <SectionHeader
              icon={<ListOrdered className="w-4 h-4" />}
              title="Scheduling"
              subtitle="Day and order"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Day Number</label>
                <input
                  type="number"
                  name="dayNumber"
                  value={form.dayNumber}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Order</label>
                <input
                  type="number"
                  name="order"
                  value={form.order ?? 1}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>
            </div>
          </div>

          <MediaEditor
            media={form.media ?? []}
            onChange={(updated) => updateFormValue("media", updated)}
          />

          <InstructionStepsEditor
            steps={form.instructionSteps ?? []}
            onChange={(updated) =>
              updateFormValue("instructionSteps", updated)
            }
          />

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 rounded-2xl font-bold text-sm text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-10 py-4 rounded-2xl font-bold text-sm bg-zinc-900 text-white hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
              {saving && <Loader2 className="animate-spin w-4 h-4" />}
              {saving ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}