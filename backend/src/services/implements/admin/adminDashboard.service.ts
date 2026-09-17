import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { IAdminDashboardService } from "../../interfaces/admin/IAdminDashboardService";
import { IAdminDashboardRepository } from "../../../repositories/interfaces/admin/IAdminDashboardRepository";
import { AdminDashboardOverviewDTO } from "../../../dtos/admin/dashboard/admin-dashboard-overview.dto";
import { mapAdminDashboardOverviewToDTO } from "../../../mappers/admin/dashboard/admin-dashboard-overview.mapper";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(TYPES.IAdminDashboardRepository)
    private readonly _dashboardRepository: IAdminDashboardRepository,
  ) {}

  async getOverview(): Promise<AdminDashboardOverviewDTO> {
    const overview = await this._dashboardRepository.getOverview();

    return mapAdminDashboardOverviewToDTO(overview);
  }
}
