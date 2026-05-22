import { TaskMediaDTO, TaskInstructionStepDTO } from "@/types/task";
import { useState } from "react";
import { UploadAttachmentModal } from "./UploadAttachmentModal";
import { SectionHeader } from "./SectionHeader";

import {
  ListOrdered,
  GripVertical,
  Trash2,
  Paperclip,
  Plus,
  X,
} from "lucide-react";

const SECTION =
  "bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[24px] p-7 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

const LABEL =
  "block text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em] mb-2 px-1";

const INPUT =
  "w-full bg-zinc-50/50 border border-zinc-200/60 rounded-2xl px-5 py-3.5 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white transition-all duration-200 shadow-sm";

const MEDIA_ICON_MAP: Record<string, React.ReactNode> = {
  image: <Paperclip className="w-4 h-4" />,
  video: <Paperclip className="w-4 h-4" />,
};

export function InstructionStepsEditor({
  steps,
  onChange,
}: {
  steps: TaskInstructionStepDTO[];
  onChange: (updated: TaskInstructionStepDTO[]) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);

  const add = () =>
    onChange([
      ...steps,
      {
        stepNumber: steps.length + 1,
        title: "",
        description: "",
        media: [],
      },
    ]);

  const remove = (i: number) =>
    onChange(
      steps
        .filter((_, idx) => idx !== i)
        .map((s, idx) => ({
          ...s,
          stepNumber: idx + 1,
        })),
    );

  const update = <K extends keyof TaskInstructionStepDTO>(
    i: number,
    field: K,
    value: TaskInstructionStepDTO[K],
  ) =>
    onChange(
      steps.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    );

  const addStepMedia = (stepIdx: number, m: TaskMediaDTO) => {
    onChange(
      steps.map((s, i) =>
        i === stepIdx ? { ...s, media: [...(s.media || []), m] } : s,
      ),
    );
  };

  const openMediaModal = (i: number) => {
    setActiveStepIdx(i);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveStepIdx(null);
  };

  return (
    <>
      <UploadAttachmentModal
        open={modalOpen}
        onClose={closeModal}
        onConfirm={(m) => {
          if (activeStepIdx !== null) {
            addStepMedia(activeStepIdx, m);
          }
          closeModal();
        }}
      />

      <div className={SECTION}>
        <SectionHeader
          icon={<ListOrdered className="w-4 h-4" />}
          title="Instruction Steps"
          subtitle="Define a clear, step-by-step path for task completion"
        />

        {steps.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-zinc-400 border-2 border-dashed border-zinc-200/60 rounded-[20px] bg-zinc-50/30">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <ListOrdered className="w-6 h-6 text-zinc-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-500">No steps defined</p>
              <p className="text-[12px] text-zinc-400">Click the button below to add your first step</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="group bg-zinc-50/50 border border-zinc-200/50 rounded-[20px] p-6 space-y-5 transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing p-1 text-zinc-300 hover:text-zinc-500 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-900 px-3 py-1.5 rounded-xl shadow-lg shadow-zinc-900/10">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                      Step {s.stepNumber}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-2 hover:bg-rose-50 hover:text-rose-500 text-zinc-300 rounded-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className={LABEL}>Step Title</label>
                  <input
                    className={INPUT}
                    placeholder="e.g. Prepare your workspace"
                    value={s.title}
                    onChange={(e) => update(i, "title", e.target.value)}
                  />
                </div>

                <div>
                  <label className={LABEL}>Detailed Description</label>
                  <textarea
                    className={INPUT}
                    rows={3}
                    placeholder="Provide specific instructions for this step..."
                    value={s.description}
                    onChange={(e) => update(i, "description", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL}>Step Attachments</label>

                <div className="flex flex-wrap gap-2 mb-3">
                  {(s.media || []).map((sm, mi) => (
                    <div
                      key={mi}
                      className="flex items-center gap-2.5 bg-white border border-zinc-200/60 rounded-xl px-3 py-2 shadow-sm animate-in fade-in zoom-in duration-200"
                    >
                      <span className="p-1.5 bg-zinc-50 rounded-lg text-zinc-400">
                        {MEDIA_ICON_MAP[sm.type] || (
                          <Paperclip className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <span className="text-xs font-bold text-zinc-600 max-w-[120px] truncate">
                        {sm.title || "Untitled File"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          update(
                            i,
                            "media",
                            (s.media || []).filter((_, xi) => xi !== mi),
                          )
                        }
                        className="p-1 text-zinc-300 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => openMediaModal(i)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 bg-white border border-dashed border-zinc-300 hover:border-zinc-500 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Media
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={add}
          className="group relative flex items-center gap-2 text-[13px] font-bold text-zinc-600 hover:text-zinc-900 border-2 border-dashed border-zinc-200 hover:border-zinc-900/20 rounded-[20px] px-6 py-4 transition-all duration-300 w-full justify-center bg-zinc-50/50 hover:bg-zinc-900/[0.02]"
        >
          <div className="p-1 bg-white rounded-lg shadow-sm border border-zinc-100 group-hover:border-zinc-900/10 transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          Add New Step to Instructions
        </button>
      </div>
    </>
  );
}
