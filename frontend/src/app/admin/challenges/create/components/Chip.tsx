interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 border ${
        active
          ? "bg-teal-600 text-white border-teal-600 shadow-[0_4px_14px_rgba(13,148,136,0.35)]"
          : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/40"
      }`}
    >
      {children}
    </button>
  );
}