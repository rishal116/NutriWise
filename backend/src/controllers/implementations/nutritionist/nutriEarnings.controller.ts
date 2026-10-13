import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { INutriEarningsController } from "../../interfaces/nutritionist/INutriEarningsController";
import { INutriEarningsService } from "../../../services/interfaces/nutritionist/INutriEarningsService";
import { GetNutriEarningsQueryDTO } from "../../../dtos/nutritionist/earnings/earnings-list-query.dto";

@injectable()
export class NutriEarningsController implements INutriEarningsController {
  constructor(
    @inject(TYPES.INutriEarningsService)
    private readonly _earningsService: INutriEarningsService,
  ) {}

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const summary = await this._earningsService.getSummary(nutritionistId);

    res.status(StatusCode.OK).json({
      success: true,
      data: summary,
    });
  });

  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const query = this.toQueryDTO(req);

    const transactions = await this._earningsService.getTransactions(
      nutritionistId,
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: transactions,
    });
  });

  getPayments = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const query = this.toQueryDTO(req);

    const payments = await this._earningsService.getPayments(
      nutritionistId,
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: payments,
    });
  });

  private toQueryDTO(req: Request): GetNutriEarningsQueryDTO {
    const query = new GetNutriEarningsQueryDTO();

    if (typeof req.query.limit === "string") {
      query.limit = Number(req.query.limit);
    }

    if (typeof req.query.cursor === "string") {
      query.cursor = req.query.cursor;
    }

    if (typeof req.query.transactionType === "string") {
      query.transactionType = query.transactionType = req.query
        .transactionType as GetNutriEarningsQueryDTO["transactionType"];
    }

    if (typeof req.query.reason === "string") {
      query.reason = req.query.reason as GetNutriEarningsQueryDTO["reason"];
    }

    if (typeof req.query.transactionStatus === "string") {
      query.transactionStatus = req.query
        .transactionStatus as GetNutriEarningsQueryDTO["transactionStatus"];
    }

    if (typeof req.query.resourceType === "string") {
      query.resourceType = req.query
        .resourceType as GetNutriEarningsQueryDTO["resourceType"];
    }

    if (typeof req.query.paymentStatus === "string") {
      query.paymentStatus = req.query
        .paymentStatus as GetNutriEarningsQueryDTO["paymentStatus"];
    }

    return query;
  }
}
