import { useState, useRef } from "react";
import { toast } from "sonner";
import { ExtractErrorMessage } from "./ExtractErrorMessage";
import Image from "next/image";
import { UploadProgressBar } from "./UploadProgressBar";
import { FieldError } from "./FieldError";
import { Upload, X, Video, ImageIcon } from "lucide-react";

const labelCls =
  "block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1.5";

interface SingleMediaUploaderProps {
  label: string;
  accept: string;
  value: string;
  onChange: (file: File | null, previewUrl: string) => void;
  mediaType?: "image" | "video";
  error?: string;
}

export function SingleMediaUploader({
  label,
  accept,
  value,
  onChange,
  mediaType = "image",
  error,
}: SingleMediaUploaderProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [pct, setPct] = useState<number>(0);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setPct(0);

    const tick = window.setInterval(() => {
      setPct((prev) => Math.min(prev + 15, 90));
    }, 80);

    try {
      const previewUrl = URL.createObjectURL(file);

      clearInterval(tick);
      setPct(100);

      onChange(file, previewUrl);

      toast.success(`${label} selected`);
    } catch (err: unknown) {
      clearInterval(tick);

      toast.error("File selection failed", {
        description: ExtractErrorMessage(err),
      });
    } finally {
      setUploading(false);

      setTimeout(() => {
        setPct(0);
      }, 300);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleRemove = (): void => {
    onChange(null, "");
  };

  const isImage = mediaType === "image";

  return (
    <div>
      <label className={labelCls}>{label}</label>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
          {isImage ? (
            <div className="relative w-full h-40">
              <Image
                src={value}
                alt={label}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <video src={value} className="w-full h-40 object-cover" controls />
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 text-[12px] font-bold text-slate-700 hover:bg-white transition-colors"
            >
              <Upload size={12} />
              Replace
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/90 text-[12px] font-bold text-white hover:bg-red-500 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />

              <p className="text-[11px] font-semibold text-teal-600">
                Processing… {pct}%
              </p>

              <UploadProgressBar value={pct} />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => {
            if (!uploading) {
              fileRef.current?.click();
            }
          }}
          className={`flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            uploading
              ? "border-teal-300 bg-teal-50/40"
              : error
                ? "border-red-300 bg-red-50/20"
                : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/20"
          }`}
        >
          {uploading ? (
            <>
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />

              <p className="text-[12px] font-semibold text-teal-600">
                Processing… {pct}%
              </p>

              <UploadProgressBar value={pct} />
            </>
          ) : (
            <>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isImage
                    ? "bg-teal-50 text-teal-400"
                    : "bg-violet-50 text-violet-400"
                }`}
              >
                {isImage ? (
                  <ImageIcon size={22} strokeWidth={1.5} />
                ) : (
                  <Video size={22} strokeWidth={1.5} />
                )}
              </div>

              <div className="text-center">
                <p className="text-[13px] font-semibold text-slate-600">
                  Click to browse {isImage ? "image" : "video"}
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {accept.replace(/,/g, ", ")}
                </p>
              </div>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-500">
                <Upload size={11} />
                Choose from gallery
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />

      <FieldError msg={error} />
    </div>
  );
}
