import type { NutriDashboardRecentActivityItemDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-recent-activities.dto";
import type { INutriDashboardRecentActivityItemProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-recent-activity.projection";

export const toNutriDashboardRecentActivityItemDTO = (
  projection: INutriDashboardRecentActivityItemProjection,
): NutriDashboardRecentActivityItemDTO => ({
  id: projection.id,
  type: projection.type,
  title: projection.title,
  description: projection.description,
  createdAt: projection.createdAt,
  ...(projection.actor && {
    actor: {
      id: projection.actor.id,
      name: projection.actor.name,
      ...(projection.actor.avatar && {
        avatar: projection.actor.avatar,
      }),
    },
  }),
  ...(projection.resource && {
    resource: {
      id: projection.resource.id,
      name: projection.resource.name,
      href: projection.resource.href,
    },
  }),
});
