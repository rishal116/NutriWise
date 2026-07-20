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

  async createWithSession(
    data: Partial<IPayment>,
    session: ClientSession,
  ): Promise<IPayment> {
    const [payment] = await this._model.create([data], {
      session,
    });

    return payment;
  }

  async existsByCheckoutSessionId(checkoutSessionId: string): Promise<boolean> {
    return (
      (await this._model.exists({
        checkoutSessionId,
      })) !== null
    );
  }

  async findByUserId(userId: string | Types.ObjectId): Promise<IPayment[]> {
    return this._model
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean<IPayment[]>()
      .exec();
  }

  async findBySellerId(sellerId: string | Types.ObjectId): Promise<IPayment[]> {
    return this._model
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .lean<IPayment[]>()
      .exec();
  }

  async findByPaymentIntentId(
    paymentIntentId: string,
  ): Promise<IPayment | null> {
    return this._model
      .findOne({ paymentIntentId })
      .lean<IPayment | null>()
      .exec();
  }
}
