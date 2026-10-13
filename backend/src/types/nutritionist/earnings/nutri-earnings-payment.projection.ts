import { Types } from "mongoose";
import { IPayment } from "../../../models/payment.model";

export type INutriEarningsPaymentProjection = Pick<
  IPayment,
  | "resourceType"
  | "resourceId"
  | "status"
  | "amount"
  | "currency"
  | "provider"
  | "createdAt"
> & {
  paymentId: Types.ObjectId;
};

export interface INutriEarningsPaymentProjectionWithCursor extends INutriEarningsPaymentProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}
