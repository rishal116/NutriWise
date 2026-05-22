import { ChevronDown } from "lucide-react";

export function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group">
      {children}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors duration-200">
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
      </div>
    </div>
  );
}
