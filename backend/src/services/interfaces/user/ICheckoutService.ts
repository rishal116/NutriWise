import { CreateCheckoutSessionDTO } from "../../../dtos/user/checkout/create-checkout-session.dto";

export interface ICheckoutService {
  createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string>;
}
