import { StripeCheckoutInputDTO } from "../../../dtos/common/stripe.dto";
import { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export class CheckoutStripeMapper {
  static toStripeInput(
    plan: INutritionistPlan,
    userId: string,
  ): StripeCheckoutInputDTO {
    return {
      amount: plan.price,

      currency: plan.currency.toLowerCase(),

      title: plan.title,

      description: `${plan.durationDays} days nutrition program`,

      successUrl: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      cancelUrl: `${process.env.FRONTEND_URL}/checkout/cancel`,

      metadata: {
        userId,
        planId: plan._id.toString(),
        nutritionistId: plan.nutritionistId.toString(),
      },
    };
  }
}
