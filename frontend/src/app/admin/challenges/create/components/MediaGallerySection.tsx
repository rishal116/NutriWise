import { IChallengeMedia } from "@/dtos/admin/createChallenge.dto";
import { ImageIcon, Plus, Video, Music, FileIcon } from "lucide-react";
import { MediaItemCard } from "./MediaItemCard";

import { Section } from "./Section";

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

interface MediaGallerySectionProps {
  items: IChallengeMedia[];
  onChange: (items: IChallengeMedia[]) => void;
}

export function MediaGallerySection({
  items,
  onChange,
}: MediaGallerySectionProps) {
  const addItem = (type: MediaType): void => {
    onChange([
      ...items,
      {
        type,
        url: "",
      },
    ]);
  };

  const updateAt = (index: number, updated: IChallengeMedia): void => {
    const updatedItems: IChallengeMedia[] = [...items];

    updatedItems[index] = updated;

    onChange(updatedItems);
  };

  const removeAt = (index: number): void => {
    onChange(items.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <Section
      title="Media gallery"
      subtitle="Additional images, videos, audio or PDFs shown inside the challenge"
    >
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mb-2">
              <ImageIcon size={18} className="text-slate-300" />
            </div>

            <p className="text-[12px] font-semibold text-slate-400">
              No media added yet
            </p>

            <p className="text-[11px] text-slate-300 mt-0.5">
              Use the buttons below to add items
            </p>
          </div>
        ) : null}

        {items.map((item, index) => (
          <MediaItemCard
            key={`${item.type}-${index}`}
            item={item}
            index={index}
            onChange={(updated) => updateAt(index, updated)}
            onRemove={() => removeAt(index)}
          />
        ))}

        {/* ── Add Media Buttons ── */}
        <div className="pt-1">
          <p className={labelCls}>Add media item</p>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(MEDIA_TYPE_CONFIG) as MediaType[]).map((type) => {
              const mediaConfig = MEDIA_TYPE_CONFIG[type];
              const TypeIcon = mediaConfig.icon;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addItem(type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold border border-dashed transition-all duration-200 hover:opacity-80 ${mediaConfig.bg} ${mediaConfig.color} border-current`}
                >
                  <Plus size={11} />
                  <TypeIcon size={11} />
                  {mediaConfig.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
