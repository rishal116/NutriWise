import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { IPaymentRepository } from "../../interfaces/common/IPaymentRepository";
import { PaymentModel, IPayment } from "../../../models/payment.model";

@injectable()
export class PaymentRepository
  extends BaseRepository<IPayment>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel);
  }

  async existsBySessionId(sessionId: string): Promise<boolean> {
    const exists = await this._model.exists({ stripeSessionId: sessionId });
    return !!exists;
  }

  async findByUserId(userId: string): Promise<IPayment[]> {
    return this._model.find({ userId }).sort({ createdAt: -1 });
  }

  async findByNutritionistId(nutritionistId: string): Promise<IPayment[]> {
    return this._model.find({ nutritionistId }).sort({ createdAt: -1 });
  }
}
