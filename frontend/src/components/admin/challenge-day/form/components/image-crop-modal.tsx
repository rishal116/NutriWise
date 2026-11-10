"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import {
  getCroppedImageFile,
  IMAGE_ASPECT,
} from "../helper/challenge-day-form.helpers";

interface ImageCropModalProps {
  source: {
    url: string;
    file: File;
  };
  onCancel: () => void;
 onComplete: (file: File) => void | Promise<void>;
}

export default function ImageCropModal({
  source,
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const handleComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      setSaving(true);

      const croppedFile = await getCroppedImageFile(
        source.url,
        croppedAreaPixels,
        source.file.name,
      );

      await onComplete(croppedFile);
    } catch {
      toast.error("Unable to crop the image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
          <div>
            <h2
              id="crop-modal-title"
              className="text-base font-bold text-admin-text"
            >
              Crop Activity Image
            </h2>

            <p className="mt-0.5 text-xs text-admin-muted">
              Adjust the image to the standard 16:9 ratio.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg p-2 text-admin-muted transition-colors hover:bg-admin-bg hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60"
            aria-label="Close image cropper"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative h-[55vh] min-h-[320px] bg-black">
          <Cropper
            image={source.url}
            crop={crop}
            zoom={zoom}
            aspect={IMAGE_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleComplete}
            restrictPosition
          />
        </div>

        <div className="space-y-4 border-t border-admin-border p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="crop-zoom"
                className="text-xs font-semibold text-admin-text"
              >
                Zoom
              </label>

              <span className="text-xs font-medium text-admin-muted">
                {zoom.toFixed(1)}x
              </span>
            </div>

            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-admin-accent"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text transition-colors hover:bg-admin-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !croppedAreaPixels}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}

              {saving ? "Applying..." : "Apply Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
