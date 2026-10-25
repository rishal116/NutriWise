import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

import type {
  IAdminPaymentRepository,
  IAdminPaymentFilters,
  IAdminPaymentListResult,
} from "../../../repositories/interfaces/admin/IAdminPaymentRepository";
import { IAdminPaymentService } from "../../interfaces/admin/IAdminPaymentService";

@injectable()
export class AdminPaymentService implements IAdminPaymentService {
  constructor(
    @inject(TYPES.IAdminPaymentRepository)
    private readonly _adminPaymentRepository: IAdminPaymentRepository,
  ) {}

  async getPayments(
    filters: IAdminPaymentFilters,
  ): Promise<IAdminPaymentListResult> {
    const { page, limit } = filters;

    if (!Number.isInteger(page) || page < 1) {
      throw new CustomError(
        "Page must be a positive integer",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new CustomError(
        "Limit must be between 1 and 100",
        StatusCode.BAD_REQUEST,
      );
    }

    return this._adminPaymentRepository.findAll({
      ...filters,
      search: filters.search?.trim() || undefined,
    });
  }

  async getPaymentById(paymentId: string) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new CustomError("Invalid payment ID", StatusCode.BAD_REQUEST);
    }

    const payment = await this._adminPaymentRepository.findById(paymentId);

    if (!payment) {
      throw new CustomError("Payment not found", StatusCode.NOT_FOUND);
    }

    return payment;
  }

  async getPaymentCount(
    filters: Pick<IAdminPaymentFilters, "status" | "resourceType">,
  ): Promise<number> {
    return this._adminPaymentRepository.count(filters);
  }
}
