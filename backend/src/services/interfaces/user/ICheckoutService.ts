import { CreateCheckoutSessionDTO } from "../../../dtos/user/checkout/create-checkout-session.dto";
import { CheckoutStatusResponseDTO } from "../../../dtos/user/checkout/checkout-status-response.dto";

export interface ICheckoutService {
  createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string>;
  getCheckoutStatus(
    sessionId: string,
    userId: string,
  ): Promise<CheckoutStatusResponseDTO>;
}

