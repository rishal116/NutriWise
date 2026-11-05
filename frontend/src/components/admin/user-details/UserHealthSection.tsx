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

const TILE_TONES = {
  blue: "bg-admin-pastel-blue",
  green: "bg-admin-pastel-green",
} as const;

function StatTile({
  icon: Icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  tone: keyof typeof TILE_TONES;
}) {
  return (
    <div className={`rounded-xl p-4 ${TILE_TONES[tone]}`}>
      <div className="flex items-center gap-2 text-admin-text/70">
        <Icon size={17} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-admin-text">
        {value}
        <span className="ml-1 text-sm font-medium text-admin-text/70">
          {unit}
        </span>
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
              tone="blue"
            />
            <StatTile
              icon={Weight}
              label="Weight"
              value={health.weightKg}
              unit="kg"
              tone="green"
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
        <div className="rounded-xl border border-dashed border-admin-border px-5 py-10 text-center">
          <Activity size={26} className="mx-auto text-admin-muted" />
          <p className="mt-3 text-sm font-semibold text-admin-text">
            No health profile available
          </p>
          <p className="mt-1 text-xs text-admin-muted">
            This user has not provided health details yet.
          </p>
        </div>
      )}
    </SectionCard>
  );
}