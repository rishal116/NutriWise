import { api } from "@/lib/axios/api";
import { API_ROUTES } from "@/routes/user.routes";
import {
  CreateCheckoutSessionPayload,
  CreateCheckoutSessionResponse,
} from "@/types/checkout.types";

export const checkoutService = {
  createSession: async (
    payload: CreateCheckoutSessionPayload,
  ): Promise<CreateCheckoutSessionResponse> => {
    const res = await api.post(API_ROUTES.CHECKOUT.CREATE_SESSION, payload);
    return res.data;
  },
};
