import {
  Activity,
  HeartPulse,
  Ruler,
  Weight,
  type LucideIcon,
} from "lucide-react";

import type { AdminUserDetailsDto } from "@/dtos/admin/user/admin-user-details.dto";

import { DetailList, SectionCard } from "./SectionCard";
import { formatLabel } from "./user-details.utils";

function StatTile({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={17} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
        <span className="ml-1 text-sm font-medium text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

export default function UserHealthSection({
  health,
}: {
  health: AdminUserDetailsDto["healthDetails"];
}) {
  return (
    <SectionCard
      icon={HeartPulse}
      title="Health profile"
      description="Health information provided by the user"
    >
      {health ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
            <StatTile
              icon={Ruler}
              label="Height"
              value={health.heightCm}
              unit="cm"
            />
            <StatTile
              icon={Weight}
              label="Weight"
              value={health.weightKg}
              unit="kg"
            />
          </div>

          <DetailList
            items={[
              {
                label: "Activity level",
                value: formatLabel(health.activityLevel),
              },
              { label: "Diet type", value: formatLabel(health.dietType) },
              { label: "Health goal", value: formatLabel(health.goal) },
              {
                label: "Target weight",
                value:
                  health.targetWeightKg != null
                    ? `${health.targetWeightKg} kg`
                    : "Not provided",
              },
              {
                label: "Preferred timeline",
                value: health.preferredTimeline
                  ? formatLabel(health.preferredTimeline)
                  : "Not provided",
              },
            ]}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
          <Activity size={26} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No health profile available
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This user has not provided health details yet.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
