import type { RequestHandler } from "express";

export interface IAdminPaymentController {
  listPayments: RequestHandler;
  getPaymentDetails: RequestHandler;
  getPaymentCount: RequestHandler;
  listWallets: RequestHandler;
  getWalletDetails: RequestHandler;
  listWalletTransactions: RequestHandler;
  getPaymentStatistics: RequestHandler;
}