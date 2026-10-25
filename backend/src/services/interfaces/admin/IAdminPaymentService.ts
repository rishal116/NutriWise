import type {
  IAdminPaymentFilters,
  IAdminPaymentListResult,
} from "../../../repositories/interfaces/admin/IAdminPaymentRepository";

export interface IAdminPaymentService {
  getPayments(filters: IAdminPaymentFilters): Promise<IAdminPaymentListResult>;

  getPaymentById(
    paymentId: string,
  ): Promise<IAdminPaymentListResult["payments"][number]>;

  getPaymentCount(
    filters: Pick<IAdminPaymentFilters, "status" | "resourceType">,
  ): Promise<number>;
}
