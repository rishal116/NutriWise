import type { ComponentType } from "react";

interface ControlButtonProps {
  pressed: boolean;
  onClick: () => void;
  label: string;
  icon: ComponentType<{ className?: string }>;
  danger?: boolean;
  disabled?: boolean;
  badge?: number;
}

export default function ControlButton({
  pressed,
  onClick,
  label,
  icon: Icon,
  danger = false,
  disabled = false,
  badge = 0,
}: ControlButtonProps) {
  const tone = danger
    ? pressed
      ? "bg-white/[0.08] hover:bg-white/[0.14]"
      : "bg-red-500 hover:bg-red-600"
    : pressed
      ? "bg-emerald-600 hover:bg-emerald-500"
      : "bg-white/[0.08] hover:bg-white/[0.14]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12 ${tone}`}
    >
      <Icon className="h-5 w-5" />

      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}