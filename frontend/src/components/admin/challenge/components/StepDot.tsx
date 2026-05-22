import { CheckCircle2 } from "lucide-react";

interface StepDotProps {
  num: number;
  active: boolean;
  done: boolean;
}

export function StepDot({ num, active, done }: StepDotProps) {
  if (done) {
    return (
      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_0_3px_rgba(16,185,129,0.12)]">
        <CheckCircle2 size={13} className="text-white" strokeWidth={2.5} />
      </div>
    );
  }

  if (active) {
    return (
      <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center shadow-[0_0_0_4px_rgba(13,148,136,0.15)]">
        <span className="text-[10px] font-bold text-white">{num}</span>
      </div>
    );
  }

  return (
    <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400">{num}</span>
    </div>
  );
}
