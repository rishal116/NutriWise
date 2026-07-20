import { ClientSession, Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IPayment } from "../../../models/payment.model";

export interface IPaymentRepository extends IBaseRepository<IPayment> {
  createWithSession(
    data: Partial<IPayment>,
    session: ClientSession,
  ): Promise<IPayment>;

  existsByCheckoutSessionId(checkoutSessionId: string): Promise<boolean>;

  findByUserId(userId: string | Types.ObjectId): Promise<IPayment[]>;

  findBySellerId(sellerId: string | Types.ObjectId): Promise<IPayment[]>;

  findByPaymentIntentId(paymentIntentId: string): Promise<IPayment | null>;
}
