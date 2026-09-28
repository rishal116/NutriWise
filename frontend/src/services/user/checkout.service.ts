import { clientApi } from "@/lib/axios/clientApi";
import { CHECKOUT_ROUTES } from "@/routes/user";
import {
  CheckoutStatusResponseDTO,
  CreateCheckoutSessionRequestDTO,
  CreateCheckoutSessionResponseDTO,
} from "@/types/checkout.types";

export const checkoutService = {
  async createSession(
    payload: CreateCheckoutSessionRequestDTO,
  ): Promise<CreateCheckoutSessionResponseDTO> {
    const { data } = await clientApi.post(
      CHECKOUT_ROUTES.CREATE_SESSION,
      payload,
    );

    return data;
  },

  async getStatus(sessionId: string): Promise<CheckoutStatusResponseDTO> {
    const { data } = await clientApi.get(
      CHECKOUT_ROUTES.GET_STATUS(sessionId),
    );

    return data;
  },
};