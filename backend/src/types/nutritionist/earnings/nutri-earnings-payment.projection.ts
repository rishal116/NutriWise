import { Types } from "mongoose";
import type { IPayment } from "../../../models/payment.model";

export type INutriEarningsPaymentProjection = Pick<
  IPayment,
  "status" | "amount" | "currency" | "provider" | "createdAt"
> & {
  paymentId: Types.ObjectId;
};

export interface INutriEarningsPaymentProjectionWithCursor extends INutriEarningsPaymentProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}
