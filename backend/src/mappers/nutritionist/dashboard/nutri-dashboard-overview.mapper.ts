import type { NutriDashboardOverviewDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-overview.dto";
import type { INutritionistDashboardOverviewProjection } from "../../../types/nutritionist/dashboard/nutritionist-dashboard-overview.projection";

export const toNutriDashboardOverviewDTO = (
  projection: INutritionistDashboardOverviewProjection,
): NutriDashboardOverviewDTO => {
  return {
    summary: {
      totalClients: projection.summary.totalClients,
      activeClients: projection.summary.activeClients,
      totalPrograms: projection.summary.totalPrograms,
      activePrograms: projection.summary.activePrograms,
      publishedPlans: projection.summary.publishedPlans,
      totalPlanPurchases: projection.summary.totalPlanPurchases,
      totalGroups: projection.summary.totalGroups,
      publishedResources: projection.summary.publishedResources,
    },

    programs: {
      upcoming: projection.programs.upcoming,
      active: projection.programs.active,
      paused: projection.programs.paused,
      completed: projection.programs.completed,
      cancelled: projection.programs.cancelled,
    },

    groups: {
      total: projection.groups.total,
      totalMembers: projection.groups.totalMembers,
    },

    resources: {
      published: projection.resources.published,
      totalViews: projection.resources.totalViews,
      totalDownloads: projection.resources.totalDownloads,
    },

    recentActivity: projection.recentActivity.map((activity) => ({
      type: activity.type,
      title: activity.title,
      createdAt: activity.createdAt,
    })),
  };
};
