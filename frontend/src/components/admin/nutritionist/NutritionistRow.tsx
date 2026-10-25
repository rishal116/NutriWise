"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";

import type { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";

import UserActionsMenu from "../user/UserActionsMenu";
import UserAvatar from "../user/UserAvatar";
import { AccountStatusBadge } from "../user/UserBadges";
import { formatDate } from "../user/user-table.utils";

import { CoachLevelBadge, RatingDisplay } from "./NutritionistBadges";

interface NutritionistRowProps {
  nutritionist: AdminNutritionistListItemDto;
  onRequestToggleBlock: (nutritionist: AdminNutritionistListItemDto) => void;
}

function NutritionistRow({
  nutritionist,
  onRequestToggleBlock,
}: NutritionistRowProps) {
  const router = useRouter();

  return (
    <tr className="transition-colors hover:bg-slate-50/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            fullName={nutritionist.fullName}
            src={nutritionist.profileImage}
          />

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-bold text-slate-900">
              {nutritionist.fullName}
            </span>
            <span className="truncate text-xs text-slate-500">
              @{nutritionist.username} · {nutritionist.email}
            </span>

            {/* Level + rating collapse under the name on small screens */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2 sm:hidden">
              <CoachLevelBadge level={nutritionist.coachLevel} />
              <RatingDisplay
                rating={nutritionist.rating}
                totalReviews={nutritionist.totalReviews}
              />
            </div>
          </div>
        </div>
      </td>

      <td className="hidden px-6 py-4 sm:table-cell">
        <CoachLevelBadge level={nutritionist.coachLevel} />
      </td>

      <td className="hidden px-6 py-4 md:table-cell">
        <RatingDisplay
          rating={nutritionist.rating}
          totalReviews={nutritionist.totalReviews}
        />
      </td>

      <td className="hidden px-6 py-4 font-medium text-slate-500 lg:table-cell">
        {formatDate(nutritionist.createdAt)}
      </td>

      <td className="px-6 py-4 text-center">
        <AccountStatusBadge blocked={nutritionist.isBlocked} />
      </td>

      <td className="px-6 py-4 text-right">
        <UserActionsMenu
          fullName={nutritionist.fullName}
          isBlocked={nutritionist.isBlocked}
          onView={() =>
            router.push(`/admin/nutritionists/${nutritionist.userId}`)
          }
          onToggleBlock={() => onRequestToggleBlock(nutritionist)}
        />
      </td>
    </tr>
  );
}

export default memo(NutritionistRow);
