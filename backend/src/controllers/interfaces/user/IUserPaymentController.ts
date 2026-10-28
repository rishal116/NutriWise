import type { RequestHandler } from "express";

export interface IUserPaymentController {
  getPayments: RequestHandler;
  getPaymentById: RequestHandler;
  getWallet: RequestHandler;
  getWalletTransactions: RequestHandler;
}