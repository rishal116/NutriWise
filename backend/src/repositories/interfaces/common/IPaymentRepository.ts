import { IPayment } from "../../../models/payment.model";

export interface IPaymentRepository {
    create(data: Partial<IPayment>): Promise<IPayment>;
  existsBySessionId(sessionId: string): Promise<boolean>;
  findByUserId(userId: string): Promise<IPayment[]>;
  findByNutritionistId(nutritionistId: string): Promise<IPayment[]>;
}
