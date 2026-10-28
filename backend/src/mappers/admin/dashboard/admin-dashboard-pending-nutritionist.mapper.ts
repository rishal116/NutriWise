import type { AdminDashboardPendingNutritionist } from "../../../types/admin/dashboard/admin-dashboard.types";
import { AdminDashboardPendingNutritionistDTO } from "../../../dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";

export function mapAdminDashboardPendingNutritionistToDTO(
  nutritionist: AdminDashboardPendingNutritionist,
): AdminDashboardPendingNutritionistDTO {
  return {
    id: nutritionist.id,
    userId: nutritionist.userId,
    fullName: nutritionist.fullName,
    email: nutritionist.email,
    applicationStatus: nutritionist.applicationStatus,
    createdAt: nutritionist.createdAt,
  };
}