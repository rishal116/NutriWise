import type { ReactNode } from "react";

export type ControlVariant = "default" | "active" | "off" | "danger" | "softDanger";

const VARIANT_CLASS: Record<ControlVariant, string> = {
  default: "bg-neutral-800 text-white hover:bg-neutral-700",
  active: "bg-emerald-600/25 text-emerald-300 hover:bg-emerald-600/35",
  off: "bg-red-600 text-white hover:bg-red-500",
  danger: "bg-red-600 px-5 text-white hover:bg-red-500",
  softDanger: "bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white",
};

export const controlButtonClass = (variant: ControlVariant = "default"): string =>
  `rounded-full p-3 transition-colors ${VARIANT_CLASS[variant]}`;

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  variant?: ControlVariant;
  badge?: number;
  children: ReactNode;
}

const ControlButton = ({
  label,
  onClick,
  variant = "default",
  badge = 0,
  children,
}: ControlButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={`relative ${controlButtonClass(variant)}`}
  >
    {children}
    {badge > 0 && (
      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
  </button>
);

export default ControlButton;