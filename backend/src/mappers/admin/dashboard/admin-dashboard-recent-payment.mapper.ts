import type { AdminDashboardRecentPayment } from "../../../types/admin/dashboard/admin-dashboard.types";
import { AdminDashboardRecentPaymentDTO } from "../../../dtos/admin/dashboard/admin-dashboard-recent-payment.dto";

export function mapAdminDashboardRecentPaymentToDTO(
  payment: AdminDashboardRecentPayment,
): AdminDashboardRecentPaymentDTO {
  return {
    id: payment.id,
    userId: payment.userId,
    customerName: payment.customerName,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    createdAt: payment.createdAt,
  };
}