
"use client";

import { Image as ImageIcon } from "lucide-react";

import ThumbnailField from "../thumbnail-field";
import SectionHeader from "./section-header";

import type { ImageState } from "../challenge-form.types";

interface ThumbnailSectionProps {
  thumbnail: ImageState;
  imageError: string | null;
  disabled: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export default function ThumbnailSection({
  thumbnail,
  imageError,
  disabled,
  onSelect,
  onRemove,
}: ThumbnailSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeader
        icon={ImageIcon}
        title="Challenge Thumbnail"
        description="Square image used for challenge listing cards."
      />

      <div className="mt-6 max-w-md">
        <ThumbnailField
          state={thumbnail}
          onSelect={onSelect}
          onRemove={onRemove}
          disabled={disabled}
        />

        {imageError && (
          <p role="alert" className="mt-3 text-xs font-medium text-red-600">
            {imageError}
          </p>
        )}
      </div>
    </section>
  );
}
