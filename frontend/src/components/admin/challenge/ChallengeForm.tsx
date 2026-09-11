"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ClipboardList, ListChecks, Settings2 } from "lucide-react";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
} from "@/types/admin/challenge/challenge.types";

import { CreateChallengeDTO } from "@/dtos/admin/challenge/create-challenge.dto";

import { adminChallengeService } from "@/services/admin/adminChallenge.service";

import ImageCropUpload from "@/components/common/ImageCropUpload";

interface ChallengeFormProps {
  mode: "create" | "edit";
  challengeId?: string;
  initialValues?: Partial<CreateChallengeDTO> & {
    thumbnailUrl?: string;
  };
}

type ChallengeFormState = CreateChallengeDTO & {
  thumbnailUrl?: string;
};

const defaultFormState: ChallengeFormState = {
  title: "",
  description: "",
  instructions: "",
  thumbnailUrl: "",
  category: "nutrition",
  difficulty: "beginner",
  accessType: "free",
  durationDays: 7,
};

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

const selectClassName =
  "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M4%206l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.9rem_center] bg-no-repeat px-3.5 pr-9 text-sm capitalize text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

const textareaClassName =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

export default function ChallengeForm({
  mode,
  challengeId,
  initialValues,
}: ChallengeFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ChallengeFormState>({
    ...defaultFormState,
    ...initialValues,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof ChallengeFormState>(
    field: K,
    value: ChallengeFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (!form.title.trim()) {
        setError("Challenge title is required.");
        return;
      }

      if (!form.description.trim()) {
        setError("Challenge description is required.");
        return;
      }

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());

      if (form.instructions?.trim()) {
        formData.append("instructions", form.instructions.trim());
      }

      formData.append("category", form.category);
      formData.append("difficulty", form.difficulty);
      formData.append("accessType", form.accessType);
      formData.append("durationDays", String(form.durationDays));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (mode === "create") {
        await adminChallengeService.createChallenge(formData);
      } else {
        if (!challengeId) {
          setError("Challenge ID is required.");
          return;
        }

        await adminChallengeService.updateChallenge(challengeId, formData);
      }

      router.push(
        mode === "create"
          ? "/admin/challenges"
          : `/admin/challenges/${challengeId}`,
      );

      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        mode === "create"
          ? "Failed to create challenge. Please verify your inputs and try again."
          : "Failed to update challenge. Please verify your inputs and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={ClipboardList}
          title="Basic Information"
          description="Add the basic details for your challenge."
        />

        <div className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="title"
                className="text-sm font-medium text-slate-700"
              >
                Challenge Title
              </label>

              <span className="text-xs text-slate-400">
                {form.title.length}/150
              </span>
            </div>

            <input
              id="title"
              type="text"
              required
              maxLength={150}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="7-Day Hydration Challenge"
              className={inputClassName}
            />
          </div>

          {/* Description */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <span className="text-xs text-slate-400">
                {form.description.length}/3000
              </span>
            </div>

            <textarea
              id="description"
              required
              maxLength={3000}
              rows={4}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Drink enough water every day for 7 days."
              className={textareaClassName}
            />
          </div>

          {/* Instructions */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="instructions"
                className="text-sm font-medium text-slate-700"
              >
                Instructions
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <span className="text-xs text-slate-400">
                {form.instructions?.length ?? 0}/5000
              </span>
            </div>

            <textarea
              id="instructions"
              maxLength={5000}
              rows={5}
              value={form.instructions ?? ""}
              onChange={(event) =>
                updateField("instructions", event.target.value)
              }
              placeholder="Explain how participants should approach this challenge..."
              className={textareaClassName}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <div className="mb-2">
              <label className="text-sm font-medium text-slate-700">
                Thumbnail
              </label>

              <p className="mt-0.5 text-xs text-slate-400">
                Use a clear landscape image that represents the challenge.
              </p>
            </div>

            <ImageCropUpload
              existingImageUrl={form.thumbnailUrl}
              aspect={16 / 9}
              maxFileSizeMB={5}
              onChange={(file) => {
                setThumbnailFile(file);
              }}
              onRemoveExisting={() => {
                setThumbnailFile(null);
                updateField("thumbnailUrl", undefined);
              }}
              disabled={loading}
            />
          </div>
        </div>
      </section>

      {/* Challenge Configuration */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={Settings2}
          title="Challenge Configuration"
          description="Define the category, difficulty, access, and duration."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="category"
              value={form.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value as CreateChallengeDTO["category"],
                )
              }
              className={selectClassName}
            >
              {CHALLENGE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label
              htmlFor="difficulty"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Difficulty
            </label>

            <select
              id="difficulty"
              value={form.difficulty}
              onChange={(event) =>
                updateField(
                  "difficulty",
                  event.target.value as CreateChallengeDTO["difficulty"],
                )
              }
              className={selectClassName}
            >
              {CHALLENGE_DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          {/* Access Type */}
          <div>
            <label
              htmlFor="accessType"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Access Type
            </label>

            <select
              id="accessType"
              value={form.accessType}
              onChange={(event) =>
                updateField(
                  "accessType",
                  event.target.value as CreateChallengeDTO["accessType"],
                )
              }
              className={selectClassName}
            >
              {CHALLENGE_ACCESS_TYPES.map((accessType) => (
                <option key={accessType} value={accessType}>
                  {accessType}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="durationDays"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Duration
            </label>

            <div className="relative">
              <input
                id="durationDays"
                type="number"
                required
                min={1}
                max={365}
                value={form.durationDays}
                onChange={(event) =>
                  updateField(
                    "durationDays",
                    event.target.value ? Number(event.target.value) : 1,
                  )
                }
                className={`${inputClassName} pr-16`}
              />

              <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-slate-400">
                days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Structure */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={ListChecks}
          title="Challenge Structure"
          description="Configure individual days and activities after creating the challenge."
        />

        <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
          <p className="text-sm leading-6 text-teal-900">
            This challenge will contain{" "}
            <span className="font-semibold">
              {form.durationDays} {form.durationDays === 1 ? "day" : "days"}
            </span>
            . After saving, you can add and manage the activities for each day.
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={() =>
            router.push(
              mode === "edit" && challengeId
                ? `/admin/challenges/${challengeId}`
                : "/admin/challenges",
            )
          }
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Challenge"
              : "Update Challenge"}
        </button>
      </div>
    </form>
  );
}
