"use client";

import { useState, useRef } from "react";
import { CreateTaskDTO } from "@/types/challenge";
import {
  Plus,
  Trash2,
  ChevronDown,
  Dumbbell,
  Salad,
  Brain,
  Image as ImageIcon,
  Video,
  X,
  Upload,
  Link,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminUploadService } from "@/services/admin/adminUpload.service";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  duration: number;
  tasks: CreateTaskDTO[];
  onChange: (tasks: CreateTaskDTO[]) => void;
}

type TaskType = CreateTaskDTO["type"];
type TaskUnit = NonNullable<CreateTaskDTO["unit"]>;
type TaskCategory = NonNullable<CreateTaskDTO["category"]>;
type TaskErrors = Record<string, string>;

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-[12px] text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20";

const errorInputCls =
  "border-red-300 focus:border-red-400 focus:ring-red-400/20 bg-red-50/40";

const selectCls =
  "w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-[12px] text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 cursor-pointer";

const labelCls =
  "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1";

const TYPE_ICONS: Record<TaskType, React.ReactNode> = {
  fitness: <Dumbbell size={12} strokeWidth={2.5} />,
  nutrition: <Salad size={12} strokeWidth={2.5} />,
  mental: <Brain size={12} strokeWidth={2.5} />,
};

const TYPE_COLORS: Record<TaskType, string> = {
  fitness: "bg-blue-50 text-blue-600 border-blue-100",
  nutrition: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mental: "bg-violet-50 text-violet-600 border-violet-100",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-600",
  medium: "bg-amber-50 text-amber-600",
  hard: "bg-red-50 text-red-500",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getError = (
  errors: TaskErrors,
  index: number,
  field: keyof CreateTaskDTO,
) => errors[`tasks.${index}.${field}`];

const validateTask = (task: CreateTaskDTO, index: number): TaskErrors => {
  const errors: TaskErrors = {};
  if (!task.title?.trim()) errors[`tasks.${index}.title`] = "Title is required";
  if (!task.type) errors[`tasks.${index}.type`] = "Type is required";
  if (!task.difficulty)
    errors[`tasks.${index}.difficulty`] = "Difficulty is required";
  if (task.targetValue === undefined || task.targetValue < 0)
    errors[`tasks.${index}.targetValue`] = "Target value must be 0 or greater";
  if (!task.unit) errors[`tasks.${index}.unit`] = "Unit is required";
  if (
    task.minimumValue !== undefined &&
    task.maximumValue !== undefined &&
    task.minimumValue > task.maximumValue
  )
    errors[`tasks.${index}.minimumValue`] = "Min cannot exceed max";
  return errors;
};

// ─── MediaUploadModal ─────────────────────────────────────────────────────────
type MediaMode = "url" | "upload";
type MediaModalType = "image" | "video";

function MediaUploadModal({
  type,
  value,
  onConfirm,
  onClose,
}: {
  type: MediaModalType;
  value: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<MediaMode>(value ? "url" : "url");
  const [urlInput, setUrlInput] = useState(value ?? "");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileRef = useRef<HTMLInputElement>(null);

  const accept =
    type === "image"
      ? "image/png,image/jpeg,image/webp,image/gif"
      : "video/mp4,video/webm,video/mov";
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);

    try {
      const data = await adminUploadService.uploadMedia(file);

      setUrlInput(data.url);
      setPreview(data.url);

      toast.success("Upload successful");
    } catch (err) {
      console.log(err);
      
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlBlur = () => setPreview(urlInput);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              {type === "image" ? <ImageIcon size={15} /> : <Video size={15} />}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">
                {type === "image" ? "Cover Image" : "Task Video"}
              </p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {type === "image" ? "PNG, JPG, WEBP" : "MP4, WEBM, MOV"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="px-5 pt-4">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            {(["url", "upload"] as MediaMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                  mode === m
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m === "url" ? <Link size={11} /> : <Upload size={11} />}
                {m === "url" ? "Paste URL" : "Upload File"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {mode === "url" ? (
            <div>
              <label className={labelCls}>
                {type === "image" ? "Image URL" : "Video URL"}
              </label>
              <input
                className={inputCls}
                placeholder={
                  type === "image"
                    ? "https://cdn.example.com/image.jpg"
                    : "https://cdn.example.com/video.mp4"
                }
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={handleUrlBlur}
              />
            </div>
          ) : (
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                uploading
                  ? "border-teal-200 bg-teal-50/30"
                  : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/20"
              }`}
            >
              {uploading ? (
                <>
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
                  <p className="text-[12px] text-teal-600 font-semibold">
                    Uploading…
                  </p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    {type === "image" ? (
                      <ImageIcon size={18} />
                    ) : (
                      <Video size={18} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-semibold text-slate-600">
                      Click to browse
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {type === "image"
                        ? "PNG, JPG, WEBP up to 10MB"
                        : "MP4, WEBM, MOV up to 100MB"}
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFile}
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              {type === "image" ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={() => setPreview("")}
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 size={9} />
                    Preview
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <Video size={13} />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium truncate flex-1">
                    {preview}
                  </p>
                  <CheckCircle2
                    size={13}
                    className="text-emerald-500 shrink-0"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[12px] font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!urlInput && !preview}
            onClick={() => {
              onConfirm(urlInput || preview);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-[12px] font-bold text-white hover:bg-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MediaThumbnail ───────────────────────────────────────────────────────────
function MediaThumbnail({
  type,
  value,
  onEdit,
  onClear,
}: {
  type: MediaModalType;
  value: string;
  onEdit: () => void;
  onClear: () => void;
}) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-200">
      {type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Cover" className="w-full h-20 object-cover" />
      ) : (
        <div className="w-full h-20 bg-slate-900 flex flex-col items-center justify-center gap-1.5">
          <Video size={18} className="text-slate-400" />
          <p className="text-[9px] text-slate-500 font-medium px-2 truncate w-full text-center">
            {value.split("/").pop()}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="px-2.5 py-1 rounded-lg bg-white text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Change
        </button>
        <button
          type="button"
          onClick={onClear}
          className="w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  );
}

// ─── MediaAddButton ───────────────────────────────────────────────────────────
function MediaAddButton({
  type,
  onClick,
}: {
  type: MediaModalType;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:border-teal-300 hover:text-teal-500 hover:bg-teal-50/30 transition-all duration-200 group"
    >
      {type === "image" ? (
        <ImageIcon size={16} strokeWidth={1.5} />
      ) : (
        <Video size={16} strokeWidth={1.5} />
      )}
      <span className="text-[10px] font-bold uppercase tracking-wider">
        Add {type === "image" ? "Cover" : "Video"}
      </span>
    </button>
  );
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────
function TaskCard({
  task,
  taskIdx,
  errors,
  onUpdate,
  onRemove,
}: {
  task: CreateTaskDTO & { _idx: number };
  taskIdx: number;
  errors: TaskErrors;
  onUpdate: <K extends keyof CreateTaskDTO>(
    key: K,
    value: CreateTaskDTO[K],
  ) => void;
  onRemove: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mediaModal, setMediaModal] = useState<MediaModalType | null>(null);

  const fieldError = (field: keyof CreateTaskDTO) =>
    getError(errors, task._idx, field);

  const hasErrors = Object.keys(errors).some((k) =>
    k.startsWith(`tasks.${task._idx}.`),
  );

  return (
    <>
      {mediaModal && (
        <MediaUploadModal
          type={mediaModal}
          value={
            mediaModal === "image"
              ? (task.coverImage ?? "")
              : (task.media?.find((m) => m.type === "video")?.url ?? "")
          }
          onConfirm={(url) => {
            if (mediaModal === "image") {
              onUpdate("coverImage", url);
            } else {
              const existing =
                task.media?.filter((m) => m.type !== "video") ?? [];
              onUpdate("media", [...existing, { type: "video", url }]);
            }
          }}
          onClose={() => setMediaModal(null)}
        />
      )}

      <div
        className={`rounded-2xl border bg-white overflow-hidden transition-all duration-200 ${hasErrors ? "border-red-200 shadow-red-50/50 shadow-sm" : "border-slate-100 shadow-sm"}`}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[task.type]}`}
              >
                {TYPE_ICONS[task.type]}
                {task.type}
              </span>
              {task.difficulty && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${DIFFICULTY_COLORS[task.difficulty]}`}
                >
                  {task.difficulty}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Task {taskIdx + 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasErrors && <AlertCircle size={13} className="text-red-400" />}
            <button
              type="button"
              onClick={onRemove}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Title + type row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                className={`${inputCls} ${fieldError("title") ? errorInputCls : ""}`}
                placeholder="e.g. Morning Run, Drink Water"
                value={task.title ?? ""}
                onChange={(e) => onUpdate("title", e.target.value)}
              />
              {fieldError("title") && (
                <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                  <AlertCircle size={9} /> {fieldError("title")}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Type</label>
              <select
                className={selectCls}
                value={task.type}
                onChange={(e) => onUpdate("type", e.target.value as TaskType)}
              >
                <option value="fitness">Fitness</option>
                <option value="nutrition">Nutrition</option>
                <option value="mental">Mental</option>
              </select>
            </div>
          </div>

          {/* Target + unit + difficulty */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Target *</label>
              <input
                type="number"
                className={`${inputCls} ${fieldError("targetValue") ? errorInputCls : ""}`}
                placeholder="0"
                value={task.targetValue ?? ""}
                onChange={(e) =>
                  onUpdate("targetValue", Number(e.target.value))
                }
              />
              {fieldError("targetValue") && (
                <p className="text-red-400 text-[10px] mt-1">
                  {fieldError("targetValue")}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Unit *</label>
              <select
                className={`${selectCls} ${fieldError("unit") ? errorInputCls : ""}`}
                value={task.unit ?? "reps"}
                onChange={(e) => onUpdate("unit", e.target.value as TaskUnit)}
              >
                <option value="reps">Reps</option>
                <option value="minutes">Minutes</option>
                <option value="steps">Steps</option>
                <option value="liters">Liters</option>
                <option value="count">Count</option>
                <option value="calories">Calories</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Difficulty *</label>
              <select
                className={`${selectCls} ${fieldError("difficulty") ? errorInputCls : ""}`}
                value={task.difficulty ?? "easy"}
                onChange={(e) =>
                  onUpdate(
                    "difficulty",
                    e.target.value as CreateTaskDTO["difficulty"],
                  )
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Media row */}
          <div>
            <label className={labelCls}>Media</label>
            <div className="grid grid-cols-2 gap-3">
              {task.coverImage ? (
                <MediaThumbnail
                  type="image"
                  value={task.coverImage}
                  onEdit={() => setMediaModal("image")}
                  onClear={() => onUpdate("coverImage", undefined)}
                />
              ) : (
                <MediaAddButton
                  type="image"
                  onClick={() => setMediaModal("image")}
                />
              )}

              {task.media?.find((m) => m.type === "video") ? (
                <MediaThumbnail
                  type="video"
                  value={task.media.find((m) => m.type === "video")!.url}
                  onEdit={() => setMediaModal("video")}
                  onClear={() =>
                    onUpdate(
                      "media",
                      task.media?.filter((m) => m.type !== "video") ?? [],
                    )
                  }
                />
              ) : (
                <MediaAddButton
                  type="video"
                  onClick={() => setMediaModal("video")}
                />
              )}
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronRight
              size={12}
              className={`transition-transform duration-200 ${showAdvanced ? "rotate-90" : ""}`}
            />
            {showAdvanced ? "Hide" : "Show"} advanced fields
          </button>

          {showAdvanced && (
            <div className="pt-3 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    className={selectCls}
                    value={task.category ?? "general"}
                    onChange={(e) =>
                      onUpdate("category", e.target.value as TaskCategory)
                    }
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="hydration">Hydration</option>
                    <option value="diet">Diet</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="sleep">Sleep</option>
                    <option value="focus">Focus</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Est. Duration (min)</label>
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="15"
                    value={task.estimatedDurationMinutes ?? ""}
                    onChange={(e) =>
                      onUpdate(
                        "estimatedDurationMinutes",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div>
                  <label className={labelCls}>Min Value</label>
                  <input
                    type="number"
                    className={`${inputCls} ${fieldError("minimumValue") ? errorInputCls : ""}`}
                    placeholder="0"
                    value={task.minimumValue ?? ""}
                    onChange={(e) =>
                      onUpdate("minimumValue", Number(e.target.value))
                    }
                  />
                  {fieldError("minimumValue") && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {fieldError("minimumValue")}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Max Value</label>
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="0"
                    value={task.maximumValue ?? ""}
                    onChange={(e) =>
                      onUpdate("maximumValue", Number(e.target.value))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Short Description</label>
                  <input
                    className={inputCls}
                    placeholder="Brief summary of the task"
                    value={task.shortDescription ?? ""}
                    onChange={(e) =>
                      onUpdate("shortDescription", e.target.value)
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="Full task description…"
                    value={task.description ?? ""}
                    onChange={(e) => onUpdate("description", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>AI Tips (comma separated)</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Stay hydrated, Keep form correct"
                    value={task.aiTips?.join(", ") ?? ""}
                    onChange={(e) =>
                      onUpdate(
                        "aiTips",
                        e.target.value
                          ? e.target.value.split(",").map((t) => t.trim())
                          : [],
                      )
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>
                    Safety Warnings (comma separated)
                  </label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Stop if pain occurs"
                    value={task.safetyWarnings?.join(", ") ?? ""}
                    onChange={(e) =>
                      onUpdate(
                        "safetyWarnings",
                        e.target.value
                          ? e.target.value.split(",").map((w) => w.trim())
                          : [],
                      )
                    }
                  />
                </div>

                <div className="sm:col-span-2 flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!task.isOptional}
                      onChange={(e) => onUpdate("isOptional", e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-400 w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">
                      Optional task
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!task.isLocked}
                      onChange={(e) => onUpdate("isLocked", e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-400 w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">
                      Locked task
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── TaskBuilder ──────────────────────────────────────────────────────────────
export default function TaskBuilder({ duration, tasks, onChange }: Props) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));
  const [errors, setErrors] = useState<TaskErrors>({});

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const updated = new Set(prev);

      if (updated.has(day)) {
        updated.delete(day);
      } else {
        updated.add(day);
      }

      return updated;
    });
  };

  const addTask = (day: number) => {
    const newTask: CreateTaskDTO = {
      dayNumber: day,
      title: "",
      type: "fitness",
      difficulty: "easy",
      unit: "reps",
      targetValue: 0,
      isOptional: false,
      isLocked: false,
      category: "general",
    };
    onChange([...tasks, newTask]);
  };

  const updateTask = <K extends keyof CreateTaskDTO>(
    index: number,
    key: K,
    value: CreateTaskDTO[K],
  ) => {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);

    const taskErrors = validateTask(updated[index], index);
    setErrors((prev) => {
      const cleaned = { ...prev };
      Object.keys(cleaned).forEach((k) => {
        if (k.startsWith(`tasks.${index}.`)) delete cleaned[k];
      });
      return { ...cleaned, ...taskErrors };
    });
  };

  const removeTask = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);
    onChange(updated);
    setErrors((prev) => {
      const cleaned = { ...prev };
      Object.keys(cleaned).forEach((k) => {
        if (k.startsWith(`tasks.${index}.`)) delete cleaned[k];
      });
      return cleaned;
    });
  };

  const totalTasks = tasks.length;
  const totalErrors = Object.keys(errors).length;

  return (
    <div className="space-y-2">
      {/* Summary bar */}
      {totalTasks > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500">
              {totalTasks} task{totalTasks !== 1 ? "s" : ""} across {duration}{" "}
              days
            </span>
          </div>
          {totalErrors > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
              <AlertCircle size={10} />
              {totalErrors} error{totalErrors !== 1 ? "s" : ""}
            </span>
          )}
          {totalErrors === 0 && totalTasks > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
              <CheckCircle2 size={10} />
              All valid
            </span>
          )}
        </div>
      )}

      {Array.from({ length: duration }).map((_, i) => {
        const day = i + 1;
        const isOpen = openDays.has(day);
        const dayTasks = tasks
          .map((task, idx) => ({ ...task, _idx: idx }))
          .filter((task) => task.dayNumber === day);
        const dayErrors = dayTasks.some((t) =>
          Object.keys(errors).some((k) => k.startsWith(`tasks.${t._idx}.`)),
        );

        return (
          <div
            key={day}
            className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
              dayErrors ? "border-red-200" : "border-slate-100"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleDay(day)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-white hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold ${
                    dayErrors
                      ? "bg-red-400"
                      : dayTasks.length > 0
                        ? "bg-teal-600"
                        : "bg-slate-200"
                  }`}
                >
                  {dayErrors ? <AlertCircle size={13} /> : day}
                </div>
                <div className="text-left">
                  <span className="font-bold text-slate-700 text-[13px]">
                    Day {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="ml-2 text-[10px] font-medium text-slate-400">
                      {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {dayTasks.length > 0 && !dayErrors && (
                  <div className="flex -space-x-1">
                    {[...new Set(dayTasks.map((t) => t.type))].map((type) => (
                      <span
                        key={type}
                        className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] ${
                          TYPE_COLORS[type as TaskType]
                        }`}
                      >
                        {TYPE_ICONS[type as TaskType]}
                      </span>
                    ))}
                  </div>
                )}
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-2 bg-slate-50/60 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                {dayTasks.map((task, taskIdx) => (
                  <TaskCard
                    key={task._idx}
                    task={task}
                    taskIdx={taskIdx}
                    errors={errors}
                    onUpdate={(key, value) => updateTask(task._idx, key, value)}
                    onRemove={() => removeTask(task._idx)}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => addTask(day)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-teal-300 text-teal-600 text-[12px] font-bold hover:bg-teal-50/50 transition-all duration-200"
                >
                  <Plus size={14} />
                  Add Task to Day {day}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
