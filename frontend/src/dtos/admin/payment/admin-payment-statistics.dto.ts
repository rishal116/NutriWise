export interface AdminPaymentStatisticsDTO {
  totalPayments: number;
  paidPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalRevenue: number;
  totalCommission: number;
  totalRefunded: number;
}