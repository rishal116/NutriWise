import { Types } from "mongoose";
import type { IPayment, PaymentItemType } from "../../../models/payment.model";

export type INutriEarningsPaymentProjection = Pick<
  IPayment,
  "status" | "amount" | "currency" | "provider" | "createdAt"
> & {
  paymentId: Types.ObjectId;
  resourceType?: PaymentItemType;
  itemType?: PaymentItemType;
  resourceId?: Types.ObjectId;
  itemId?: Types.ObjectId;
};

export interface INutriEarningsPaymentProjectionWithCursor extends INutriEarningsPaymentProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}
