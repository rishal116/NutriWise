import type { AdminDashboardOverviewDTO } from "../../../dtos/admin/dashboard/admin-dashboard-overview.dto";
import type { AdminDashboardOverview } from "../../../types/admin/dashboard/admin-dashboard.types";

export const mapAdminDashboardOverviewToDTO = (
  projection: AdminDashboardOverview,
): AdminDashboardOverviewDTO => {
  return {
    summary: {
      totalUsers: projection.summary.totalUsers,
      newUsers: projection.summary.newUsers,
      blockedUsers: projection.summary.blockedUsers,
      deletedUsers: projection.summary.deletedUsers,
      unverifiedUsers: projection.summary.unverifiedUsers,
      totalNutritionists: projection.summary.totalNutritionists,
      pendingNutritionistApplications:
        projection.summary.pendingNutritionistApplications,
      totalPurchases: projection.summary.totalPurchases,
      totalRevenue: projection.summary.totalRevenue,
      refundedAmount: projection.summary.refundedAmount,
      netRevenue: projection.summary.netRevenue,
      commissionEarned: projection.summary.commissionEarned,
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
      upcomingPrograms: projection.coaching.upcomingPrograms,
      pausedPrograms: projection.coaching.pausedPrograms,
      completedPrograms: projection.coaching.completedPrograms,
      cancelledPrograms: projection.coaching.cancelledPrograms,
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
