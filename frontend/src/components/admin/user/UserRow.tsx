"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";

import type { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";

import UserActionsMenu from "./UserActionsMenu";
import UserAvatar from "./UserAvatar";
import { AccountStatusBadge, ProfileStatus, RoleBadge } from "./UserBadges";
import { formatDate } from "./user-table.utils";

interface UserRowProps {
  user: AdminUserListItemDto;
  onRequestToggleBlock: (user: AdminUserListItemDto) => void;
}

function UserRow({ user, onRequestToggleBlock }: UserRowProps) {
  const router = useRouter();

  return (
    <tr className="transition-colors hover:bg-slate-50/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar fullName={user.fullName} src={user.profileImage} />

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-bold text-slate-900">
              {user.fullName}
            </span>
            <span className="truncate text-xs text-slate-500">
              @{user.username} · {user.email}
            </span>

            {/* Role + profile collapse under the name on small screens */}
            <div className="mt-1.5 flex items-center gap-2 sm:hidden">
              <RoleBadge role={user.activeRole} />
              <ProfileStatus completed={user.isProfileCompleted} />
            </div>
          </div>
        </div>
      </td>

      <td className="hidden px-6 py-4 sm:table-cell">
        <RoleBadge role={user.activeRole} />
      </td>

      <td className="hidden px-6 py-4 md:table-cell">
        <ProfileStatus completed={user.isProfileCompleted} />
      </td>

      <td className="hidden px-6 py-4 font-medium text-slate-500 lg:table-cell">
        {formatDate(user.createdAt)}
      </td>

      <td className="px-6 py-4 text-center">
        <AccountStatusBadge blocked={user.isBlocked} />
      </td>

      <td className="px-6 py-4 text-right">
        <UserActionsMenu
          fullName={user.fullName}
          isBlocked={user.isBlocked}
          onView={() => router.push(`/admin/users/${user.id}`)}
          onToggleBlock={() => onRequestToggleBlock(user)}
        />
      </td>
    </tr>
  );
}

export default memo(UserRow);
