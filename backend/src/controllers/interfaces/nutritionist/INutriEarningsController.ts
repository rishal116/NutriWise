import { Request, Response, NextFunction } from "express";

export interface INutriEarningsController {
  getSummary: (req: Request, res: Response, next: NextFunction) => void;

  getTransactions: (req: Request, res: Response, next: NextFunction) => void;

  getPayments: (req: Request, res: Response, next: NextFunction) => void;
}
