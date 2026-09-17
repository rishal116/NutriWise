import type { AdminPlanListItemDTO } from "../../../dtos/admin/plan/admin-plan-list-item.dto";
import type { IAdminPlanListProjection } from "../../../types/admin/plan/admin-plan-list.projection";

export const toAdminPlanListItemDTO = (
  plan: IAdminPlanListProjection,
): AdminPlanListItemDTO => ({
  id: plan.id,
  nutritionistId: plan.nutritionistId,
  nutritionist: {
    fullName: plan.nutritionist.fullName,
    profileImage: plan.nutritionist.profileImage,
  },
  title: plan.title,
  specialization: plan.specialization,
  durationDays: plan.durationDays,
  price: plan.price,
  currency: plan.currency,
  status: plan.status,
  createdAt: plan.createdAt.toISOString(),
});
