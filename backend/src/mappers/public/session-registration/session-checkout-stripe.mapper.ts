import { ISession } from "../../../models/session.model";
import { StripeCheckoutInputDTO } from "../../../dtos/common/stripe.dto";

export class SessionCheckoutStripeMapper {
  static toStripeInput(
    session: ISession,
    userId: string,
  ): StripeCheckoutInputDTO {
    return {
      currency: session.pricing.currency,
      title: session.title,
      description: session.description,
      amount: session.pricing.amount,

      successUrl: `${process.env.FRONTEND_URL}/communities/sessions/${session._id}/payment-success`,
      cancelUrl: `${process.env.FRONTEND_URL}/communities/sessions/${session._id}`,

      metadata: {
        userId,
        sessionId: session._id.toString(),
        nutritionistId: session.nutritionistId.toString(),
        resourceType: "session",
      },
    };
  }
}