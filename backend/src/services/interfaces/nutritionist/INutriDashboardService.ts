import type { NutriDashboardOverviewDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-overview.dto";

export interface INutriDashboardService {
  getOverview(nutritionistId: string): Promise<NutriDashboardOverviewDTO>;
}