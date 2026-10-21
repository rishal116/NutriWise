"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import ControlButton from "./ControlButton";

const REACTIONS = ["💖", "👍", "👏", "😂", "🔥"] as const;

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

const ReactionPicker = ({ onSelect }: ReactionPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <ControlButton
        label="Reactions"
        variant={open ? "active" : "default"}
        onClick={() => setOpen((v) => !v)}
      >
        <Smile size={20} />
      </ControlButton>
      {open && (
        <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-1 rounded-xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
              className="rounded-lg p-1.5 text-lg transition-transform hover:scale-125 hover:bg-white/5"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionPicker;