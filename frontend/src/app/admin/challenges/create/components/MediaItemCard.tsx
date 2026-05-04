import { IChallengeMedia } from "@/dtos/admin/createChallenge.dto";
import { useState, useRef } from "react";
import { FieldError } from "./FieldError";

import {
  CheckCircle2,
  X,
  ImageIcon,
  Video,
  Music,
  FileIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const inputCls =
  "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";

const inputErrCls =
  "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30";

const labelCls =
  "block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5";

type MediaType = IChallengeMedia["type"];

const MEDIA_TYPE_CONFIG: Record<
  MediaType,
  {
    icon: React.ElementType;
    accept: string;
    label: string;
    color: string;
    bg: string;
  }
> = {
  image: {
    icon: ImageIcon,
    accept: "image/png,image/jpeg,image/webp,image/gif",
    label: "Image",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  video: {
    icon: Video,
    accept: "video/mp4,video/webm",
    label: "Video",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  audio: {
    icon: Music,
    accept: "audio/mpeg,audio/wav,audio/ogg",
    label: "Audio",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  pdf: {
    icon: FileIcon,
    accept: "application/pdf",
    label: "PDF",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
};

interface MediaItemCardProps {
  item: IChallengeMedia;
  index: number;
  onChange: (updated: IChallengeMedia) => void;
  onRemove: () => void;
}

interface MediaItemErrors {
  url?: string;
  title?: string;
  thumbnailUrl?: string;
  duration?: string;
}

export function MediaItemCard({
  item,
  index,
  onChange,
  onRemove,
}: MediaItemCardProps) {
  const [errs, setErrs] = useState<MediaItemErrors>({});
  const [expanded, setExpanded] = useState<boolean>(true);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const thumbRef = useRef<HTMLInputElement | null>(null);

  const cfg = MEDIA_TYPE_CONFIG[item.type];
  const Icon = cfg.icon;

  const validateMediaField = (
    field: keyof MediaItemErrors,
    value: string | number | undefined,
  ): void => {
    setErrs((prev) => {
      const next: MediaItemErrors = { ...prev };

      switch (field) {
        case "url":
          if (!value || String(value).trim() === "") {
            next.url = "File is required";
          } else {
            delete next.url;
          }
          break;

        case "title":
          if (value && String(value).trim().length < 2) {
            next.title = "Title must be at least 2 characters";
          } else {
            delete next.title;
          }
          break;

        case "thumbnailUrl":
          delete next.thumbnailUrl;
          break;

        case "duration":
          if (value !== undefined && Number(value) < 0) {
            next.duration = "Duration cannot be negative";
          } else {
            delete next.duration;
          }
          break;
      }

      return next;
    });
  };

  const patch = <K extends keyof IChallengeMedia>(
    field: K,
    value: IChallengeMedia[K],
  ): void => {
    onChange({
      ...item,
      [field]: value,
    });

    if (
      field === "url" ||
      field === "title" ||
      field === "thumbnailUrl" ||
      field === "duration"
    ) {
      validateMediaField(field, value as string | number | undefined);
    }
  };

  const handleMainFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    patch("file", file);
    patch("previewUrl", URL.createObjectURL(file));

    toast.success("File selected");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleThumbFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    patch("thumbnailFile", file);

    patch("thumbnailUrl", previewUrl);

    toast.success("Thumbnail selected");

    if (thumbRef.current) {
      thumbRef.current.value = "";
    }
  };

  const hasErrors = Object.keys(errs).length > 0;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        hasErrors ? "border-red-200" : "border-slate-200"
      }`}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/80 border-b border-slate-100">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg}`}
        >
          <Icon size={15} className={cfg.color} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-slate-700 truncate">
            {item.title || `${cfg.label} #${index + 1}`}
          </p>

          <p className="text-[10px] text-slate-400 font-medium">
            {item.file ? "✓ File selected" : "No file yet"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <X size={13} />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* ── Type selector ── */}
          <div>
            <label className={labelCls}>Media type</label>

            <div className="flex gap-2 flex-wrap">
              {(Object.keys(MEDIA_TYPE_CONFIG) as MediaType[]).map((type) => {
                const mediaCfg = MEDIA_TYPE_CONFIG[type];
                const TypeIcon = mediaCfg.icon;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...item,
                        type,
                        url: "",
                        file: undefined,
                      })
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 ${
                      item.type === type
                        ? `${mediaCfg.bg} ${mediaCfg.color} border-current shadow-sm`
                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <TypeIcon size={11} />
                    {mediaCfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main file upload ── */}
          <div>
            <label className={labelCls}>File *</label>

            {item.previewUrl ? (
              <div className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />

                {item.type === "image" ? (
                  <div className="relative h-10 w-14 shrink-0">
                    <Image
                      src={item.previewUrl}
                      alt="preview"
                      fill
                      unoptimized
                      className="rounded-lg object-cover border border-emerald-100"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg.bg}`}
                  >
                    <Icon size={16} className={cfg.color} />
                  </div>
                )}

                <span className="text-[11px] text-emerald-700 truncate flex-1 font-medium">
                  {item.file?.name || "Selected file"}
                </span>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="shrink-0 text-[11px] font-semibold text-slate-500 hover:text-teal-600 px-2 py-1 rounded-lg hover:bg-teal-50 transition-all"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2.5 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  errs.url
                    ? "border-red-300 bg-red-50/20"
                    : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/20"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}
                >
                  <Icon size={18} strokeWidth={1.5} className={cfg.color} />
                </div>

                <div className="text-center">
                  <p className="text-[12px] font-semibold text-slate-600">
                    Click to browse {cfg.label.toLowerCase()}
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {cfg.accept.replace(/,/g, ", ")}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept={cfg.accept}
              className="hidden"
              onChange={handleMainFile}
            />

            <FieldError msg={errs.url} />
          </div>

          {/* ── Title ── */}
          <div>
            <label className={labelCls}>Title</label>

            <input
              className={`${inputCls} ${errs.title ? inputErrCls : ""}`}
              placeholder={`${cfg.label} title (optional)`}
              value={item.title ?? ""}
              onChange={(e) => patch("title", e.target.value)}
            />

            <FieldError msg={errs.title} />
          </div>

          {/* ── Description ── */}
          <div>
            <label className={labelCls}>Description</label>

            <textarea
              rows={2}
              className={`${inputCls} resize-none leading-relaxed`}
              placeholder="Short description (optional)"
              value={item.description ?? ""}
              onChange={(e) => patch("description", e.target.value)}
            />
          </div>

          {/* ── Thumbnail ── */}
          <div>
            <label className={labelCls}>Thumbnail</label>

            {item.thumbnailUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-16 shrink-0">
                  <Image
                    src={item.thumbnailUrl}
                    alt="thumb"
                    fill
                    unoptimized
                    className="rounded-xl object-cover border border-slate-200"
                  />
                </div>

                <span className="text-[11px] text-emerald-700 truncate flex-1 font-medium">
                  {item.thumbnailFile?.name || "Thumbnail selected"}
                </span>

                <button
                  type="button"
                  onClick={() => thumbRef.current?.click()}
                  className="shrink-0 text-[11px] font-semibold text-slate-500 hover:text-teal-600 px-2 py-1 rounded-lg hover:bg-teal-50 transition-all"
                >
                  Replace
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...item,
                      thumbnailUrl: undefined,
                      thumbnailFile: undefined,
                    })
                  }
                  className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 text-[12px] font-semibold text-slate-500 hover:text-teal-600 transition-all duration-200 w-full justify-center"
              >
                <ImageIcon size={13} />
                Upload thumbnail (optional)
              </button>
            )}

            <input
              ref={thumbRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleThumbFile}
            />

            <FieldError msg={errs.thumbnailUrl} />
          </div>

          {/* ── Duration ── */}
          {(item.type === "video" || item.type === "audio") && (
            <div className="max-w-[180px]">
              <label className={labelCls}>Duration (seconds)</label>

              <div className="relative">
                <input
                  type="number"
                  min={0}
                  className={`${inputCls} ${
                    errs.duration ? inputErrCls : ""
                  } pr-8`}
                  placeholder="e.g. 120"
                  value={item.duration ?? ""}
                  onChange={(e) =>
                    patch(
                      "duration",
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                  s
                </span>
              </div>

              <FieldError msg={errs.duration} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
