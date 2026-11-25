import { injectable } from "inversify";
import { ClientSession, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";
import { IPaymentRepository } from "../../interfaces/common/IPaymentRepository";
import { IPayment, PaymentModel } from "../../../models/payment.model";

@injectable()
export class PaymentRepository
  extends BaseRepository<IPayment>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel);
  }

  async existsByCheckoutSessionId(
    checkoutSessionId: string,
    session?: ClientSession,
  ): Promise<boolean> {
    return this.exists(
      {
        provider: "stripe",
        "providerReferences.checkoutId": checkoutSessionId,
      },
      session,
    );
  }

  async findByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<IPayment | null> {
    return this.findOne({
      provider: "stripe",
      "providerReferences.checkoutId": checkoutSessionId,
    });
  }

  async findByUserId(userId: string | Types.ObjectId): Promise<IPayment[]> {
    return this.find({ buyerId: userId }, undefined, { createdAt: -1 });
  }

  async findBySellerId(sellerId: string | Types.ObjectId): Promise<IPayment[]> {
    return this.find({ sellerId }, undefined, { createdAt: -1 });
  }

  async findByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<IPayment | null> {
    return this.findOne({
      provider: "stripe",
      "providerReferences.transactionId": paymentIntentId,
    });
  }
}
