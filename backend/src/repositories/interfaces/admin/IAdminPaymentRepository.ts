import type { IBaseRepository } from "../common/IBaseRepository";
import type { IPayment } from "../../../models/payment.model";

export interface IAdminPaymentFilters {
  search?: string;
  status?: IPayment["status"];
  resourceType?: IPayment["resourceType"];
  page: number;
  limit: number;
}

export interface IAdminPaymentListResult {
  payments: IPayment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAdminPaymentRepository extends IBaseRepository<IPayment> {
  findAll(filters: IAdminPaymentFilters): Promise<IAdminPaymentListResult>;

  findById(paymentId: string): Promise<IPayment | null>;

  count(
    filters: Pick<IAdminPaymentFilters, "status" | "resourceType">,
  ): Promise<number>;
}
