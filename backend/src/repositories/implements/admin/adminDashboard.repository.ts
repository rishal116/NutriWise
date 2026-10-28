import { injectable } from "inversify";

import { IAdminDashboardRepository } from "../../interfaces/admin/IAdminDashboardRepository";

import { getDashboardStats } from "./dashboard/adminDashboardStats.repository";

import {
  getRegistrationTrend,
  getRevenueTrend,
  getUserTrend,
  getNutritionistTrend,
} from "./dashboard/adminDashboardTrends.repository";

import {
  getRecentUsers,
  getPendingNutritionists,
  getRecentPayments,
} from "./dashboard/adminDashboardLists.repository";

import {
  getAttentionItems,
  getRecentActivity,
} from "./dashboard/adminDashboardActivity.repository";

import type {
  AdminDashboardOverview,
  AdminDashboardRegistrationTrend,
  AdminDashboardRevenueTrend,
  AdminDashboardRecentUser,
  AdminDashboardPendingNutritionist,
  AdminDashboardRecentPayment,
} from "../../../types/admin/dashboard/admin-dashboard.types";

@injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
  async getOverview(startDate: Date): Promise<AdminDashboardOverview> {
    const endDate = new Date();

    const [stats, users, revenue, nutritionists, attention, recentActivity] =
      await Promise.all([
        getDashboardStats(startDate),
        getUserTrend(startDate, endDate),
        getRevenueTrend(startDate, endDate),
        getNutritionistTrend(startDate, endDate),
        getAttentionItems(),
        getRecentActivity(),
      ]);

    return {
      ...stats,
      trends: {
        users,
        revenue: revenue.map((item) => ({
          date: item.date,
          value: item.netRevenue,
        })),
        nutritionists,
      },
      attention,
      recentActivity,
    };
  }

  getRegistrationTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRegistrationTrend[]> {
    return getRegistrationTrend(startDate, endDate);
  }

  getRevenueTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRevenueTrend[]> {
    return getRevenueTrend(startDate, endDate);
  }

  getRecentUsers(limit: number): Promise<AdminDashboardRecentUser[]> {
    return getRecentUsers(limit);
  }

  getPendingNutritionists(
    limit: number,
  ): Promise<AdminDashboardPendingNutritionist[]> {
    return getPendingNutritionists(limit);
  }

  getRecentPayments(limit: number): Promise<AdminDashboardRecentPayment[]> {
    return getRecentPayments(limit);
  }
}
