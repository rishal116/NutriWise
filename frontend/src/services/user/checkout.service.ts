import { clientApi } from "@/lib/axios/clientApi";
import { CHECKOUT_ROUTES } from "@/routes/user";
import {
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
};