import { ISession } from "../../models/session.model";
import { StripeCheckoutSessionInputDTO } from "../../dtos/common/stripe.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";


export class SessionStripeMapper {
  static toStripeInput(
    session: ISession,
    userId: string,
  ): StripeCheckoutSessionInputDTO {

    if (!session.price || session.price < 50) {
      throw new CustomError(
        "Minimum session price must be ₹50 for Stripe payments",
        StatusCode.BAD_REQUEST,
      );
    }

    return {
      amount: session.price,

      title: session.title,
      description: session.description || "Session payment",

      successUrl: `${process.env.FRONTEND_URL}/communities/sessions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/communities/sessions/cancel?sessionId=${session._id.toString()}`,

      metadata: {
        userId,
        sessionId: session._id.toString(),
        type: "session_payment",
      },
    };
  }
}