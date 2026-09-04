"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Send } from "lucide-react";

import { userPostService } from "@/services/user/userPost.service";
import { PostMediaPicker } from "@/components/user/posts/PostMediaPicker";

const MAX_LENGTH = 2000;

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedContent = content.trim();
  const hasContent = trimmedContent.length > 0;
  const hasMedia = file !== null;
  const canSubmit = (hasContent || hasMedia) && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasContent && !hasMedia) {
      setError("Add a caption or attach media before publishing.");
      return;
    }
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const response = await userPostService.createPost(
        { content: hasContent ? trimmedContent : undefined },
        file ?? undefined,
      );
      router.push(`/user/posts/${response.data._id}`);
    } catch {
      setError("We couldn't publish your post. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Posts
        </button>

        <div className="flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-emerald-600" />
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Create Post
          </h1>
        </div>
        <p className="mt-1.5 text-xs font-medium text-slate-500 sm:text-sm">
          Share an update, a win, or a moment from your journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6"
      >
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="What's on your mind?"
            rows={6}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-slate-700 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">
              Add a caption, attach media, or both.
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {content.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Media
          </label>
          <div className="max-w-xs">
            <PostMediaPicker
              file={file}
              onSelectFile={setFile}
              onClear={() => setFile(null)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
