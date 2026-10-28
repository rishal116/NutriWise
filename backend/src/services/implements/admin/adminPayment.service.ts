import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

import type { IAdminPaymentRepository } from "../../../repositories/interfaces/admin/IAdminPaymentRepository";
import type {
  IAdminPaymentFilters,
  IAdminWalletFilters,
  IAdminWalletTransactionFilters,
  IAdminPaymentCountFilters,
} from "../../../types/admin/payment/admin-payment.types";

import {
  AdminPaymentQueryDTO,
  AdminWalletQueryDTO,
  AdminWalletTransactionQueryDTO,
  AdminPaymentCountQueryDTO,
} from "../../../dtos/admin/payment/admin-payment.dto";

import { AdminPaymentMapper } from "../../../mappers/admin/payment/admin-payment.mapper";
import type { IAdminPaymentService } from "../../interfaces/admin/IAdminPaymentService";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class AdminPaymentService implements IAdminPaymentService {
  constructor(
    @inject(TYPES.IAdminPaymentRepository)
    private readonly _adminPaymentRepository: IAdminPaymentRepository,
  ) {}

  async getPayments(filters: AdminPaymentQueryDTO) {
    this.validatePagination(filters.cursor, filters.limit);

    const validator = await validateDto(AdminPaymentQueryDTO, filters);

    const repositoryFilters: IAdminPaymentFilters = {
      ...validator,
      search: validator.search?.trim() || undefined,
    };

    const result =
      await this._adminPaymentRepository.findAll(repositoryFilters);

    return AdminPaymentMapper.toPaymentListDTO(result);
  }

  async getPaymentById(paymentId: string) {
    this.validateObjectId(paymentId, "payment");

    const payment = await this._adminPaymentRepository.findById(paymentId);

    if (!payment) {
      throw new CustomError("Payment not found", StatusCode.NOT_FOUND);
    }

    return AdminPaymentMapper.toPaymentDTO(payment);
  }

  async getPaymentCount(filters: AdminPaymentCountQueryDTO) {
    const repositoryFilters: IAdminPaymentCountFilters = {
      status: filters.status as IAdminPaymentCountFilters["status"],
      resourceType:
        filters.resourceType as IAdminPaymentCountFilters["resourceType"],
    };

    return this._adminPaymentRepository.count(repositoryFilters);
  }

  async getWallets(filters: AdminWalletQueryDTO) {
    this.validatePagination(filters.cursor, filters.limit);

    const repositoryFilters: IAdminWalletFilters = {
      ...filters,
      search: filters.search?.trim() || undefined,
    };

    const result =
      await this._adminPaymentRepository.findWallets(repositoryFilters);

    return AdminPaymentMapper.toWalletListDTO(result);
  }

  async getWalletById(walletId: string) {
    this.validateObjectId(walletId, "wallet");

    const wallet = await this._adminPaymentRepository.findWalletById(walletId);

    if (!wallet) {
      throw new CustomError("Wallet not found", StatusCode.NOT_FOUND);
    }

    return AdminPaymentMapper.toWalletDTO(wallet);
  }

  async getWalletTransactions(filters: AdminWalletTransactionQueryDTO) {
    this.validateObjectId(filters.walletId, "wallet");
    this.validatePagination(filters.cursor, filters.limit);

    const repositoryFilters: IAdminWalletTransactionFilters = {
      ...filters,
      type: filters.type as IAdminWalletTransactionFilters["type"],
      reason: filters.reason as IAdminWalletTransactionFilters["reason"],
      status: filters.status as IAdminWalletTransactionFilters["status"],
    };

    const result =
      await this._adminPaymentRepository.findWalletTransactions(
        repositoryFilters,
      );

    return AdminPaymentMapper.toWalletTransactionListDTO(result);
  }

  async getPaymentStatistics() {
    const statistics =
      await this._adminPaymentRepository.getPaymentStatistics();

    return AdminPaymentMapper.toPaymentStatisticsDTO(statistics);
  }

  private validatePagination(cursor: string | undefined, limit: number): void {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new CustomError(
        "Limit must be between 1 and 100",
        StatusCode.BAD_REQUEST,
      );
    }

    if (cursor) {
      try {
        // Validate cursor format before repository execution.
        const decoded = JSON.parse(
          Buffer.from(cursor, "base64url").toString("utf-8"),
        ) as unknown;

        if (
          typeof decoded !== "object" ||
          decoded === null ||
          !("id" in decoded) ||
          typeof decoded.id !== "string" ||
          !Types.ObjectId.isValid(decoded.id) ||
          !("value" in decoded)
        ) {
          throw new Error("Invalid cursor");
        }
      } catch {
        throw new CustomError("Invalid cursor", StatusCode.BAD_REQUEST);
      }
    }
  }

  private validateObjectId(id: string, entity: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${entity} ID`, StatusCode.BAD_REQUEST);
    }
  }
}
