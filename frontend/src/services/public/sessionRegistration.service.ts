import { clientApi } from "@/lib/axios/clientApi";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { SessionRegistrationActionResponseDTO } from "@/dtos/public/session-registration/session-registration-action-response.dto";
import type { SessionRegistrationResponseDTO } from "@/dtos/public/session-registration/session-registration-response.dto";

import { SESSION_REGISTRATION_ROUTES } from "@/routes/public/session-registration.routes";

export const sessionRegistrationService = {
  registerForSession: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionRegistrationActionResponseDTO>> => {
    const { data } = await clientApi.post<
      ApiResponseDTO<SessionRegistrationActionResponseDTO>
    >(SESSION_REGISTRATION_ROUTES.REGISTER(sessionId));

    return data;
  },

  cancelSessionRegistration: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionRegistrationResponseDTO>> => {
    const { data } = await clientApi.patch<
      ApiResponseDTO<SessionRegistrationResponseDTO>
    >(SESSION_REGISTRATION_ROUTES.CANCEL(sessionId));

    return data;
  },
};
