import { useState } from "react";
import { TaskMediaDTO } from "@/types/task";
import { UploadAttachmentModal } from "./UploadAttachmentModal";
import { SectionHeader } from "./SectionHeader";

import { ImageIcon, Video, Paperclip, Plus, Trash2 } from "lucide-react";

const SECTION =
  "bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[24px] p-7 space-y-6 shadow-[0_8px_30_rgb(0,0,0,0.04)]";

type MediaType = "image" | "video";


const MEDIA_ICON_MAP: Record<MediaType, React.ReactNode> = {
  image: <ImageIcon className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
};

const MEDIA_COLOR_MAP: Record<MediaType, string> = {
  image: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  video: "bg-blue-50 text-blue-600 border-blue-100/50",
};

// safe fallback helper
const getMediaType = (type: string): MediaType =>
  type === "video" ? "video" : "image";

export function MediaEditor({
  media,
  onChange,
}: {
  media: TaskMediaDTO[];
  onChange: (updated: TaskMediaDTO[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const remove = (i: number) => onChange(media.filter((_, idx) => idx !== i));

  const add = (m: TaskMediaDTO) => onChange([...media, m]);

  return (
    <>
      <UploadAttachmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(m) => {
          add(m);
          setModalOpen(false);
        }}
      />

      <div className={SECTION}>
        <SectionHeader
          icon={<Paperclip className="w-4 h-4" />}
          title="Media Library"
          subtitle="Manage high-quality visuals and resources for this task"
        />

        {/* EMPTY STATE */}
        {media.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-zinc-400 border-2 border-dashed border-zinc-200/60 rounded-[20px] bg-zinc-50/30">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Paperclip className="w-6 h-6 text-zinc-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-500">No media attached</p>
              <p className="text-[12px] text-zinc-400">Add images or videos to enhance user engagement</p>
            </div>
          </div>
        )}

        {/* LIST */}
        {media.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {media.map((m, i) => {
              const safeType = getMediaType(m.type);

              return (
                <div
                  key={i}
                  className="group flex items-center gap-4 px-4 py-4 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl transition-all duration-300 hover:bg-white hover:border-zinc-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 border shadow-sm transition-transform duration-300 group-hover:scale-110 ${MEDIA_COLOR_MAP[safeType]}`}
                  >
                    {MEDIA_ICON_MAP[safeType]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-zinc-800 truncate leading-tight mb-0.5">
                      {m.title || "Resource Item"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider bg-zinc-100 px-1.5 py-0.5 rounded-md">
                        {safeType}
                      </span>
                      <p className="text-[11px] text-zinc-400 truncate font-medium">
                        {m.url.split("/").pop() || "source link"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-2 hover:bg-rose-50 hover:text-rose-500 text-zinc-300 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group relative flex items-center gap-2 text-[13px] font-bold text-zinc-600 hover:text-zinc-900 border-2 border-dashed border-zinc-200 hover:border-zinc-900/20 rounded-[20px] px-6 py-4 transition-all duration-300 w-full justify-center bg-zinc-50/50 hover:bg-zinc-900/[0.02]"
        >
          <div className="p-1 bg-white rounded-lg shadow-sm border border-zinc-100 group-hover:border-zinc-900/10 transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          Attach New Media Resource
        </button>
      </div>
    </>
  );
}
