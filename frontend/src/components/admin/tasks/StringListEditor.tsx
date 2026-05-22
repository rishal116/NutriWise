import { ReactNode } from "react";
import { Trash2, Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const SECTION =
  "bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[24px] p-7 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

const INPUT =
  "w-full bg-zinc-50/50 border border-zinc-200/60 rounded-2xl px-5 py-3.5 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:bg-white transition-all duration-200 shadow-sm";

type StringListEditorProps = {
  label: string;
  icon: ReactNode;
  subtitle?: string;
  items: string[];
  placeholder: string;
  onChange: (updated: string[]) => void;
};

export function StringListEditor({
  label,
  icon,
  subtitle,
  items,
  placeholder,
  onChange,
}: StringListEditorProps) {
  const add = () => onChange([...items, ""]);

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const update = (i: number, val: string) =>
    onChange(items.map((x, idx) => (idx === i ? val : x)));

  return (
    <div className={SECTION}>
      <SectionHeader icon={icon} title={label} subtitle={subtitle} />

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-center py-6 text-zinc-400 text-xs font-medium bg-zinc-50/30 border border-dashed border-zinc-200/60 rounded-2xl">
            No {label.toLowerCase()} added yet.
          </p>
        )}
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 group animate-in fade-in slide-in-from-left-2 duration-200"
          >
            <div className="flex-1">
              <input
                className={INPUT}
                placeholder={placeholder}
                value={item}
                onChange={(e) => update(i, e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(i)}
              className="p-3 hover:bg-rose-50 hover:text-rose-500 text-zinc-300 rounded-2xl transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
        Add New {label}
      </button>
    </div>
  );
}
