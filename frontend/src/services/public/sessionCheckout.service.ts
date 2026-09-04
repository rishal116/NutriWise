import { clientApi } from "@/lib/axios/clientApi";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { CHECKOUT_ROUTES } from "@/routes/user";
import { SessionCheckoutResponseDTO } from "@/dtos/public/session-registration/session-checkout-response.dto";

export const sessionCheckoutService = {
  createSessionRegistrationCheckout: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionCheckoutResponseDTO>> => {
    const { data } = await clientApi.post<
      ApiResponseDTO<SessionCheckoutResponseDTO>
    >(CHECKOUT_ROUTES.CREATE_SESSION_REGISTRATION, {
      sessionId,
    });

    return data;
  },
};
