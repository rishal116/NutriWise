import {
  Activity,
  CheckCircle2,
  Clock3,
  PauseCircle,
  XCircle,
} from "lucide-react";

interface DashboardPrograms {
  upcoming: number;
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
}

interface DashboardProgramOverviewProps {
  programs: DashboardPrograms;
}

interface ProgramStatusBarProps {
  label: string;
  value: number;
  total: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconClassName: string;
  backgroundClassName: string;
  barClassName: string;
}

function ProgramStatusBar({
  label,
  value,
  total,
  icon: Icon,
  iconClassName,
  backgroundClassName,
  barClassName,
}: ProgramStatusBarProps) {
  const percentage =
    total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${backgroundClassName}`}
        >
          <Icon size={14} className={iconClassName} />
        </div>

        <span className="text-xs font-semibold text-slate-600">{label}</span>

        <span className="ml-auto text-xs font-bold text-slate-900">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardProgramOverview({
  programs,
}: DashboardProgramOverviewProps) {
  const total =
    programs.upcoming +
    programs.active +
    programs.paused +
    programs.completed +
    programs.cancelled;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Activity size={19} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">
            Program overview
          </h2>

          <p className="text-xs text-slate-400">
            Status across your coaching programs
          </p>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-center">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-slate-50">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-3xl font-bold text-slate-900">
              {total}
            </span>

            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Programs
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <ProgramStatusBar
          label="Active"
          value={programs.active}
          total={total}
          icon={Activity}
          iconClassName="text-emerald-600"
          backgroundClassName="bg-emerald-50"
          barClassName="bg-emerald-500"
        />

        <ProgramStatusBar
          label="Upcoming"
          value={programs.upcoming}
          total={total}
          icon={Clock3}
          iconClassName="text-blue-600"
          backgroundClassName="bg-blue-50"
          barClassName="bg-blue-500"
        />

        <ProgramStatusBar
          label="Paused"
          value={programs.paused}
          total={total}
          icon={PauseCircle}
          iconClassName="text-amber-600"
          backgroundClassName="bg-amber-50"
          barClassName="bg-amber-500"
        />

        <ProgramStatusBar
          label="Completed"
          value={programs.completed}
          total={total}
          icon={CheckCircle2}
          iconClassName="text-slate-600"
          backgroundClassName="bg-slate-100"
          barClassName="bg-slate-500"
        />

        <ProgramStatusBar
          label="Cancelled"
          value={programs.cancelled}
          total={total}
          icon={XCircle}
          iconClassName="text-rose-600"
          backgroundClassName="bg-rose-50"
          barClassName="bg-rose-500"
        />
      </div>
    </div>
  );
}