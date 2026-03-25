import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { IPaymentRepository } from "../../interfaces/common/IPaymentRepository";
import { PaymentModel, IPayment } from "../../../models/payment.model";
import { ClientSession } from "mongoose";

@injectable()
export class PaymentRepository
  extends BaseRepository<IPayment>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel);
  }

  async create(
    data: Partial<IPayment>,
    session?: ClientSession
  ): Promise<IPayment> {
    const doc = await this._model.create([data], { session });
    return doc[0];
  }

  async existsBySessionId(sessionId: string): Promise<boolean> {
    const exists = await this._model.exists({ stripeSessionId: sessionId });
    return !!exists;
  }

  async findByUserId(userId: string): Promise<IPayment[]> {
    return this._model
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByNutritionistId(nutritionistId: string): Promise<IPayment[]> {
    return this._model
      .find({ nutritionistId })
      .sort({ createdAt: -1 })
      .lean();
  }
}