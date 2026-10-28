import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { IAdminDashboardService } from "../../interfaces/admin/IAdminDashboardService";
import { IAdminDashboardRepository } from "../../../repositories/interfaces/admin/IAdminDashboardRepository";

import { AdminDashboardOverviewDTO } from "../../../dtos/admin/dashboard/admin-dashboard-overview.dto";
import { AdminDashboardRegistrationTrendDTO } from "../../../dtos/admin/dashboard/admin-dashboard-registration-trend.dto";
import { AdminDashboardRevenueTrendDTO } from "../../../dtos/admin/dashboard/admin-dashboard-revenue-trend.dto";
import { AdminDashboardRecentUserDTO } from "../../../dtos/admin/dashboard/admin-dashboard-recent-user.dto";
import { AdminDashboardPendingNutritionistDTO } from "../../../dtos/admin/dashboard/admin-dashboard-pending-nutritionist.dto";
import { AdminDashboardRecentPaymentDTO } from "../../../dtos/admin/dashboard/admin-dashboard-recent-payment.dto";

import { mapAdminDashboardOverviewToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-overview.mapper";
import { mapAdminDashboardRegistrationTrendToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-registration-trend.mapper";
import { mapAdminDashboardRevenueTrendToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-revenue-trend.mapper";
import { mapAdminDashboardRecentUserToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-recent-user.mapper";
import { mapAdminDashboardPendingNutritionistToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-pending-nutritionist.mapper";
import { mapAdminDashboardRecentPaymentToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-recent-payment.mapper";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(TYPES.IAdminDashboardRepository)
    private readonly dashboardRepository: IAdminDashboardRepository,
  ) {}

  async getOverview(): Promise<AdminDashboardOverviewDTO> {
    const endDate = new Date();
    const startDate = new Date(endDate);

    startDate.setDate(startDate.getDate() - 30);

    const overview = await this.dashboardRepository.getOverview(startDate);

    return mapAdminDashboardOverviewToDTO(overview);
  }

  async getRegistrationTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRegistrationTrendDTO[]> {
    const trends = await this.dashboardRepository.getRegistrationTrend(
      startDate,
      endDate,
    );

    return trends.map(mapAdminDashboardRegistrationTrendToDTO);
  }

  async getRevenueTrend(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminDashboardRevenueTrendDTO[]> {
    const trends = await this.dashboardRepository.getRevenueTrend(
      startDate,
      endDate,
    );

    return trends.map(mapAdminDashboardRevenueTrendToDTO);
  }

  async getRecentUsers(limit: number): Promise<AdminDashboardRecentUserDTO[]> {
    const users = await this.dashboardRepository.getRecentUsers(limit);

    return users.map(mapAdminDashboardRecentUserToDTO);
  }

  async getPendingNutritionists(
    limit: number,
  ): Promise<AdminDashboardPendingNutritionistDTO[]> {
    const nutritionists =
      await this.dashboardRepository.getPendingNutritionists(limit);

    return nutritionists.map(mapAdminDashboardPendingNutritionistToDTO);
  }

  async getRecentPayments(
    limit: number,
  ): Promise<AdminDashboardRecentPaymentDTO[]> {
    const payments = await this.dashboardRepository.getRecentPayments(limit);

    return payments.map(mapAdminDashboardRecentPaymentToDTO);
  }
}
