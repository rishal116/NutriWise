import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface ActivityActionsProps {
  index: number;
  total: number;
  disabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function ActivityActions({
  index,
  total,
  disabled,
  onMoveUp,
  onMoveDown,
  onRemove,
}: ActivityActionsProps) {
  return (
    <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disabled || index === 0}
        aria-label={`Move activity ${index + 1} up`}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronUp size={16} />
      </button>

      <button
        type="button"
        onClick={onMoveDown}
        disabled={disabled || index === total - 1}
        aria-label={`Move activity ${index + 1} down`}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronDown size={16} />
      </button>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove activity ${index + 1}`}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
