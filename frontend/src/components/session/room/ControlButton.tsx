import type { ComponentType } from "react";

export type ControlTheme = "dark" | "light";

interface ControlButtonProps {
  pressed: boolean;
  onClick: () => void;
  label: string;
  icon: ComponentType<{ className?: string }>;
  danger?: boolean;
  disabled?: boolean;
  badge?: number;
  /** Match the page behind the button. Defaults to the dark room. */
  theme?: ControlTheme;
}

const NEUTRAL: Record<ControlTheme, string> = {
  dark: "bg-white/[0.12] text-white backdrop-blur-sm hover:bg-white/[0.2]",
  light:
    "border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50",
};

const FOCUS_RING: Record<ControlTheme, string> = {
  dark: "focus-visible:ring-offset-[#0a0a0f]",
  light: "focus-visible:ring-offset-white",
};

// Same in both themes: these are saturated colors with white icons.
const ACTIVE = "bg-emerald-600 text-white hover:bg-emerald-500";
const ALERT = "bg-red-500 text-white hover:bg-red-600";

export default function ControlButton({
  pressed,
  onClick,
  label,
  icon: Icon,
  danger = false,
  disabled = false,
  badge = 0,
  theme = "dark",
}: ControlButtonProps) {
  // danger: "off" is the alarming state (mic/camera muted).
  // normal: "on" is the highlighted state (chat open, hand raised).
  const tone = danger
    ? pressed
      ? NEUTRAL[theme]
      : ALERT
    : pressed
      ? ACTIVE
      : NEUTRAL[theme];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`relative flex h-11 w-11 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12 ${FOCUS_RING[theme]} ${tone}`}
    >
      <Icon className="h-5 w-5" />

      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}