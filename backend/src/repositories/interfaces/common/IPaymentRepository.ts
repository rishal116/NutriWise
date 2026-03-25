import { IPayment } from "../../../models/payment.model";
import { ClientSession } from "mongoose";

export interface IPaymentRepository {
  create(
    data: Partial<IPayment>,
    session?: ClientSession
  ): Promise<IPayment>;

  existsBySessionId(sessionId: string): Promise<boolean>;

  findByUserId(userId: string): Promise<IPayment[]>;

  findByNutritionistId(nutritionistId: string): Promise<IPayment[]>;
}