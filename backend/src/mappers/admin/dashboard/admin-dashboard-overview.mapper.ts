import type { AdminDashboardOverviewDTO } from "../../../dtos/admin/dashboard/admin-dashboard-overview.dto";
import type { IAdminDashboardOverviewProjection } from "../../../types/admin/dashboard/admin-dashboard-overview.projection";

export const mapAdminDashboardOverviewToDTO = (
  projection: IAdminDashboardOverviewProjection,
): AdminDashboardOverviewDTO => {
  return {
    summary: {
      totalUsers: projection.summary.totalUsers,
      totalNutritionists: projection.summary.totalNutritionists,
      pendingNutritionistApplications:
        projection.summary.pendingNutritionistApplications,
      totalPurchases: projection.summary.totalPurchases,
      totalRevenue: projection.summary.totalRevenue,
    },

    nutritionists: {
      approved: projection.nutritionists.approved,
      pending: projection.nutritionists.pending,
      rejected: projection.nutritionists.rejected,
      blocked: projection.nutritionists.blocked,
    },

    challenges: {
      total: projection.challenges.total,
      published: projection.challenges.published,
      draft: projection.challenges.draft,
      archived: projection.challenges.archived,
    },

    coaching: {
      publishedPlans: projection.coaching.publishedPlans,
      purchases: projection.coaching.purchases,
      activePrograms: projection.coaching.activePrograms,
    },

    trends: {
      users: projection.trends.users.map((item) => ({
        date: item.date,
        value: item.value,
      })),

      revenue: projection.trends.revenue.map((item) => ({
        date: item.date,
        value: item.value,
      })),

      nutritionists: projection.trends.nutritionists.map((item) => ({
        date: item.date,
        value: item.value,
      })),
    },

    attention: projection.attention.map((item) => ({
      type: item.type,
      title: item.title,
      count: item.count,
      action: item.action,
    })),

    recentActivity: projection.recentActivity.map((item) => ({
      type: item.type,
      title: item.title,
      createdAt: item.createdAt.toISOString(),
    })),
  };
};
