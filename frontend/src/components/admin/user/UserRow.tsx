"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";

import type { AdminUserListItemDto } from "@/dtos/admin/user/admin-user-list-item.dto";

import UserActionsMenu from "./UserActionsMenu";
import UserAvatar from "./UserAvatar";
import { AccountStatusBadge, RoleBadge } from "./UserBadges";
import { formatDate } from "./user-table.utils";

interface UserRowProps {
  user: AdminUserListItemDto;
  onRequestToggleBlock: (user: AdminUserListItemDto) => void;
}

function UserRow({ user, onRequestToggleBlock }: UserRowProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleToggleBlock = () => {
    onRequestToggleBlock(user);
  };

  return (
    <tr className="transition-colors hover:bg-admin-surface-hover">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar fullName={user.fullName} src={user.profileImage} />

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-bold text-admin-text">
              {user.fullName}
            </span>

            <span className="truncate text-xs text-admin-muted">
              @{user.username} · {user.email}
            </span>

            <div className="mt-1.5 flex items-center gap-2 sm:hidden">
              <RoleBadge role={user.activeRole} />
            </div>
          </div>
        </div>
      </td>

      <td className="hidden px-6 py-4 sm:table-cell">
        <RoleBadge role={user.activeRole} />
      </td>

      <td className="hidden px-6 py-4 font-medium text-admin-muted lg:table-cell">
        {formatDate(user.createdAt)}
      </td>

      <td className="px-6 py-4 text-center">
        <AccountStatusBadge blocked={user.isBlocked} />
      </td>

      <td className="px-6 py-4 text-right">
        <UserActionsMenu
          fullName={user.fullName}
          isBlocked={user.isBlocked}
          onView={handleView}
          onToggleBlock={handleToggleBlock}
        />
      </td>
    </tr>
  );
}

export default memo(UserRow);