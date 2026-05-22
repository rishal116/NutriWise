import { TaskMediaDTO } from "@/types/task";
import { useState, useRef } from "react";
import { Video, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

type MediaType = "image" | "video";

const MEDIA_TYPES: {
  key: MediaType;
  label: string;
  icon: React.ReactNode;
  accept: string;
}[] = [
  {
    key: "image",
    label: "Image",
    icon: <ImageIcon className="w-5 h-5" />,
    accept: "image/*",
  },
  {
    key: "video",
    label: "Video",
    icon: <Video className="w-5 h-5" />,
    accept: "video/*",
  },
];

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (media: TaskMediaDTO) => void;
}

export function UploadAttachmentModal({
  open,
  onClose,
  onConfirm,
}: UploadModalProps) {
  const [selectedType, setSelectedType] = useState<MediaType>("image");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);

  const currentType = MEDIA_TYPES.find((t) => t.key === selectedType)!;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleConfirm = () => {
    if (!file) return;

    onConfirm({
      type: selectedType,
      url: preview,
      title: title || file.name,
      file,
    });


    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle("");
    setFile(null);
    setPreview("");
    setSelectedType("image");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-zinc-900/40 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && resetAndClose()}
    >
      <div
        className="w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-zinc-200/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
              Upload Media
            </h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
              New Resource Attachment
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">
              Resource Title
            </label>
            <input
              className="w-full bg-zinc-50/50 border border-zinc-200/60 rounded-2xl px-5 py-3.5 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all duration-200"
              placeholder="e.g. Exercise Demo Video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">
              Select Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {MEDIA_TYPES.map((t) => {
                const active = selectedType === t.key;

                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.key);
                      setFile(null);
                      setPreview("");
                    }}
                    className={`flex flex-col items-center justify-center gap-3 py-5 rounded-2xl border-2 transition-all duration-300 ${
                      active
                        ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                        : "bg-zinc-50/50 border-zinc-100 text-zinc-400 hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className={`${active ? "text-white" : "text-zinc-300"}`}>
                      {t.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept={currentType.accept}
              className="hidden"
              onChange={handleFileChange}
            />

            {!file ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex flex-col items-center gap-4 py-10 rounded-[24px] border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/50 hover:border-zinc-300 transition-all duration-300 group"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-600">Choose a file</p>
                  <p className="text-[11px] text-zinc-400 font-medium mt-1">
                    Click to browse your computer
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-sm">
                    {currentType.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-bold opacity-70">
                      {(file.size / 1024).toFixed(1)} KB · READY
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                    }}
                    className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {preview && selectedType === "image" && (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm animate-in zoom-in-95 duration-300">
                    <Image
                      src={preview}
                      alt="preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="flex-1 py-4 rounded-2xl text-[13px] font-bold text-zinc-500 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!file}
              className="flex-1 py-4 rounded-2xl text-[13px] font-bold bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
            >
              Confirm Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
