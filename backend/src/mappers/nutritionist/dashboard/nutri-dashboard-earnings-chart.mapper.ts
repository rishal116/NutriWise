import type { NutriDashboardEarningsChartDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-earnings-chart.dto";
import type { INutriDashboardEarningsChartProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-earnings-chart.projection";

export const toNutriDashboardEarningsChartDTO = (
  projection: INutriDashboardEarningsChartProjection,
): NutriDashboardEarningsChartDTO => ({
  currency: projection.currency,
  period: {
    from: projection.period.from,
    to: projection.period.to,
  },
  data: projection.data.map((item) => ({
    month: item.month,
    year: item.year,
    earnings: item.earnings,
    transactions: item.transactions,
  })),
});
