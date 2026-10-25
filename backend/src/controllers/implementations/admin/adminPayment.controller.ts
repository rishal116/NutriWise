import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import type { IAdminPaymentController } 
import type { IAdminPaymentService } from "../../../services/interfaces/admin/IAdminPaymentService";

import type { AdminPaymentListQueryDTO }
import { toAdminPaymentListQuery } from "../../../utils/adminPaymentController.util";

@injectable()
export class AdminPaymentController implements IAdminPaymentController {
  constructor(
    @inject(TYPES.IAdminPaymentService)
    private readonly _paymentService: IAdminPaymentService,
  ) {}

  listPayments = asyncHandler(async (req: Request, res: Response) => {
    const query: AdminPaymentListQueryDTO = toAdminPaymentListQuery(
      req.query,
    );

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
}