import type { AdminDashboardRecentUser } from "../../../types/admin/dashboard/admin-dashboard.types";
import { AdminDashboardRecentUserDTO } from "../../../dtos/admin/dashboard/admin-dashboard-recent-user.dto";

export function mapAdminDashboardRecentUserToDTO(
  user: AdminDashboardRecentUser,
): AdminDashboardRecentUserDTO {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    isBlocked: user.isBlocked,
  };
}