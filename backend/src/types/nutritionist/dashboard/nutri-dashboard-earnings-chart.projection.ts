export interface INutriDashboardEarningsChartProjection {
  currency: string;
  period: {
    from: Date;
    to: Date;
  };
  data: {
    month: string;
    year: number;
    earnings: number;
    transactions: number;
  }[];
}