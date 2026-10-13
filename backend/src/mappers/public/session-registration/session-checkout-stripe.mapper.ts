import { ISession } from "../../../models/session.model";
import { StripeCheckoutInputDTO } from "../../../dtos/common/stripe.dto";

export class SessionCheckoutStripeMapper {
  static toStripeInput(
    session: ISession,
    userId: string,
  ): StripeCheckoutInputDTO {
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured.");
    }

    const baseUrl = new URL(frontendUrl).origin;
    const sessionPath = `/communities/sessions/${session._id}`;

    return {
      currency: session.pricing.currency,
      title: session.title,
      description: session.description,
      amount: session.pricing.amount,

      successUrl: `${baseUrl}${sessionPath}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}${sessionPath}/checkout`,

      metadata: {
        paymentType: "session_registration",
        resourceType: "session",
        userId,
        sessionId: session._id.toString(),
        nutritionistId: session.nutritionistId.toString(),
      },
    };
  }
}
