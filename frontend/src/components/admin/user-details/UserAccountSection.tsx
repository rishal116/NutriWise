import { UserRound } from "lucide-react";

import type { AdminUserDetailsDto } from "@/dtos/admin/user/admin-user-details.dto";

import { DetailList, SectionCard } from "./SectionCard";
import { formatLabel } from "./user-details.utils";

export default function UserAccountSection({
  user,
}: {
  user: AdminUserDetailsDto;
}) {
  return (
    <SectionCard
      icon={UserRound}
      title="Account details"
      description="Personal information and account configuration"
    >
      <DetailList
        items={[
          { label: "Full name", value: user.fullName },
          { label: "Username", value: `@${user.username}` },
          { label: "Email address", value: user.email },
          {
            label: "Gender",
            value: user.gender ? formatLabel(user.gender) : "Not provided",
          },
          {
            label: "Authentication provider",
            value: formatLabel(user.authProvider),
          },
          {
            label: "Profile completion",
            value: user.isProfileCompleted ? "Completed" : "Incomplete",
          },
        ]}
      />

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-medium text-slate-500">Assigned roles</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {user.roles.map((role) => {
            const isActive = role === user.activeRole;

            return (
              <li
                key={role}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {formatLabel(role)}
                {isActive && " · Active"}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionCard>
  );
}
