import { inject, injectable } from "inversify";
import type { RequestHandler } from "express";
import { TYPES } from "../../../types/types";
import type { IUserPaymentService } from "../../../services/interfaces/user/account/IUserPaymentService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class UserPaymentController {
  constructor(
    @inject(TYPES.IUserPaymentService)
    private readonly _userPaymentService: IUserPaymentService,
  ) {}

  getPayments: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const limit = Number(req.query.limit ?? 10);
    const cursor = req.query.cursor ? String(req.query.cursor) : undefined;

    const data = await this._userPaymentService.getPayments(
      userId,
      limit,
      cursor,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Payment history retrieved successfully.",
      data,
    });
  });

  getPaymentById: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const paymentId = req.params.paymentId;

    const data = await this._userPaymentService.getPaymentById(
      userId,
      paymentId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Payment details retrieved successfully.",
      data,
    });
  });

  getWallet: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const data = await this._userPaymentService.getWallet(userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Wallet retrieved successfully.",
      data,
    });
  });

  getWalletTransactions: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const limit = Number(req.query.limit ?? 10);
    const cursor = req.query.cursor ? String(req.query.cursor) : undefined;

    const data = await this._userPaymentService.getWalletTransactions(
      userId,
      limit,
      cursor,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Wallet transactions retrieved successfully.",
      data,
    });
  });
}
