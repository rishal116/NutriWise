import Stripe from "stripe";
import { injectable, inject } from "inversify";
import { stripe } from "../../../configs/stripe";
import { IStripeWebhookService } from "../../interfaces/common/IStripeWebhookService";
import { TYPES } from "../../../types/types";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";
import { IUserPlanRepository } from "../../../repositories/interfaces/user/IUserPlanRepository";
import { Types } from "mongoose";

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
    constructor(
      @inject(TYPES.IUserPlanRepository) 
      private _userPlanRepo: IUserPlanRepository,
      @inject(TYPES.INutritionistPlanRepository)
      private _planRepo: INutritionistPlanRepository
  ) {}
  
  async process(payload: Buffer, signature: string) {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, planId, nutritionistId } = session.metadata!;
      const exists = await this._userPlanRepo.findBySessionId(session.id);
      if (exists) return;
      const plan = await this._planRepo.findById(planId);
      if (!plan) throw new Error("Plan not found");
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationInDays);
      
      const userObjectId = new Types.ObjectId(userId);
      const planObjectId = new Types.ObjectId(planId);
      const nutritionistObjectId = new Types.ObjectId(nutritionistId);
      
      await this._userPlanRepo.create({
        userId: userObjectId,
        planId: planObjectId,
        nutritionistId: nutritionistObjectId,
        stripeSessionId: session.id,
        amount: plan.price,
        currency: plan.currency,
        status: "ACTIVE",
        startDate,
        endDate,
      });
      console.log("Payment success:", { userId, planId, nutritionistId });
    }
  }
}
