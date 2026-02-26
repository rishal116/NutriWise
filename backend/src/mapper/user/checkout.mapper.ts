import { StripeCheckoutInputDTO } from "../../dtos/common/stripe.dto";
import { IPlan } from "../../models/nutritionistPlan.model";

export class CheckoutStripeMapper {
  static toStripeInput(plan: IPlan, userId: string): StripeCheckoutInputDTO {
    return {
      amount: plan.price,
      title: plan.title,
      description: `${plan.durationInDays} days program`,
      successUrl: `${process.env.FRONTEND_URL}/coaching/${plan.nutritionistId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/coaching/${plan.nutritionistId}/checkout?planId=${plan._id.toString()}`,
      metadata: {
        userId,
        planId: plan._id.toString(),
        nutritionistId: plan.nutritionistId.toString(),
      },
    };
  }
}
