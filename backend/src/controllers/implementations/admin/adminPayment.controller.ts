import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import type { IAdminPaymentController } from "../../../controllers/interfaces/admin/IAdminPaymentController";
import type { IAdminPaymentService } from "../../../services/interfaces/admin/IAdminPaymentService";

import {
  AdminPaymentQueryDTO,
  AdminWalletQueryDTO,
  AdminWalletTransactionQueryDTO,
  AdminPaymentCountQueryDTO,
} from "../../../dtos/admin/payment/admin-payment.dto";

@injectable()
export class AdminPaymentController implements IAdminPaymentController {
  constructor(
    @inject(TYPES.IAdminPaymentService)
    private readonly _paymentService: IAdminPaymentService,
  ) {}

  listPayments = asyncHandler(async (req: Request, res: Response) => {
    const query = Object.assign(new AdminPaymentQueryDTO(), {
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      status:
        typeof req.query.status === "string" ? req.query.status : undefined,
      resourceType:
        typeof req.query.resourceType === "string"
          ? req.query.resourceType
          : undefined,
      cursor:
        typeof req.query.cursor === "string" ? req.query.cursor : undefined,
      limit: typeof req.query.limit === "string" ? Number(req.query.limit) : 20,
    });

    const result = await this._paymentService.getPayments(query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Payments fetched successfully",
      data: result,
    });
  });

  getPaymentDetails = asyncHandler(async (req: Request, res: Response) => {
    const { paymentId } = req.params;

    const result = await this._paymentService.getPaymentById(paymentId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Payment details fetched successfully",
      data: result,
    });
  });

  getPaymentCount = asyncHandler(async (req: Request, res: Response) => {
    const query = Object.assign(new AdminPaymentCountQueryDTO(), {
      status:
        typeof req.query.status === "string" ? req.query.status : undefined,
      resourceType:
        typeof req.query.resourceType === "string"
          ? req.query.resourceType
          : undefined,
    });

    const result = await this._paymentService.getPaymentCount(query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Payment count fetched successfully",
      data: { count: result },
    });
  });

  listWallets = asyncHandler(async (req: Request, res: Response) => {
    const query = Object.assign(new AdminWalletQueryDTO(), {
      search:
        typeof req.query.search === "string" ? req.query.search : undefined,
      ownerType:
        typeof req.query.ownerType === "string"
          ? req.query.ownerType
          : undefined,
      isActive:
        typeof req.query.isActive === "string"
          ? req.query.isActive === "true"
          : undefined,
      cursor:
        typeof req.query.cursor === "string" ? req.query.cursor : undefined,
      limit: typeof req.query.limit === "string" ? Number(req.query.limit) : 20,
    });

    const result = await this._paymentService.getWallets(query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Wallets fetched successfully",
      data: result,
    });
  });

  getWalletDetails = asyncHandler(async (req: Request, res: Response) => {
    const { walletId } = req.params;

    const result = await this._paymentService.getWalletById(walletId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Wallet details fetched successfully",
      data: result,
    });
  });

  listWalletTransactions = asyncHandler(async (req: Request, res: Response) => {
    const query = Object.assign(new AdminWalletTransactionQueryDTO(), {
      walletId:
        typeof req.query.walletId === "string" ? req.query.walletId : "",
      type: typeof req.query.type === "string" ? req.query.type : undefined,
      reason:
        typeof req.query.reason === "string" ? req.query.reason : undefined,
      status:
        typeof req.query.status === "string" ? req.query.status : undefined,
      cursor:
        typeof req.query.cursor === "string" ? req.query.cursor : undefined,
      limit: typeof req.query.limit === "string" ? Number(req.query.limit) : 20,
    });

    const result = await this._paymentService.getWalletTransactions(query);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Wallet transactions fetched successfully",
      data: result,
    });
  });

  getPaymentStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this._paymentService.getPaymentStatistics();

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Payment statistics fetched successfully",
      data: result,
    });
  });
}
