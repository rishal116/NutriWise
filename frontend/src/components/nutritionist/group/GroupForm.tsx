"use client";

import { useState, type FormEvent } from "react";
import { ImagePlus, Lock, Users, Globe2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { nutriGroupService } from "@/services/nutritionist/nutriGroup.service";

import type { CreateGroupDTO } from "@/dtos/nutritionist/group/create-group.dto";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

export default function GroupForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [visibility, setVisibility] =
    useState<CreateGroupDTO["visibility"]>("private");

  const [saving, setSaving] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedAvatar = groupAvatar.trim();

    if (!trimmedTitle) {
      toast.error("Group title is required.");
      return;
    }

    setSaving(true);

    try {
      const payload: CreateGroupDTO = {
        title: trimmedTitle,
        visibility,
      };

      if (trimmedDescription) {
        payload.description = trimmedDescription;
      }

      if (trimmedAvatar) {
        payload.groupAvatar = trimmedAvatar;
      }

      const group = await nutriGroupService.createGroup(payload);

      toast.success("Group created successfully.");
      router.push(`/nutritionist/groups/${group.id}`);
      router.refresh();
    } catch {
      toast.error("Unable to create group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="group-title"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Group name
        </label>

        <input
          id="group-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          placeholder="e.g. Healthy Habits Community"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="mt-1.5 flex justify-end text-[11px] font-medium text-slate-400">
          {title.length}/{MAX_TITLE_LENGTH}
        </div>
      </div>

      <div>
        <label
          htmlFor="group-description"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Description
        </label>

        <textarea
          id="group-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={5}
          placeholder="Tell members what this group is about..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="mt-1.5 flex justify-end text-[11px] font-medium text-slate-400">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </div>
      </div>

      <div>
        <label
          htmlFor="group-avatar"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Group image URL
          <span className="ml-1 font-normal text-slate-400">(optional)</span>
        </label>

        <div className="relative">
          <ImagePlus
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="group-avatar"
            type="url"
            value={groupAvatar}
            onChange={(event) => setGroupAvatar(event.target.value)}
            placeholder="https://..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-800">
          Group visibility
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setVisibility("private")}
            className={`rounded-2xl border p-4 text-left transition ${
              visibility === "private"
                ? "border-emerald-300 bg-emerald-50/70"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  visibility === "private"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Lock size={17} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">Private</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Best for client communities managed by you.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setVisibility("public")}
            className={`rounded-2xl border p-4 text-left transition ${
              visibility === "public"
                ? "border-emerald-300 bg-emerald-50/70"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  visibility === "public"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Globe2 size={17} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">Public</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Let users discover the group publicly.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/nutritionist/groups")}
          disabled={saving}
          className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Users size={16} />
              Create Group
            </>
          )}
        </button>
      </div>
    </form>
  );
}