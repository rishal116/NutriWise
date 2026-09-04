import { clientApi } from "@/lib/axios/clientApi";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import { SESSION_REGISTRATION_ROUTES } from "@/routes/public/session-registration.routes";

import { SessionRegistrationResponseDTO } from "@/dtos/public/session-registration/session-registration-response.dto";

import { SessionRegistrationActionResponseDTO } from "@/dtos/public/session-registration/session-registration-action-response.dto";

export const sessionRegistrationService = {
  registerForSession: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionRegistrationActionResponseDTO>> => {
    const { data } = await clientApi.post<
      ApiResponseDTO<SessionRegistrationActionResponseDTO>
    >(SESSION_REGISTRATION_ROUTES.REGISTER(sessionId));

    return data;
  },

  getMySessionRegistration: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionRegistrationResponseDTO>> => {
    const { data } = await clientApi.get<
      ApiResponseDTO<SessionRegistrationResponseDTO>
    >(SESSION_REGISTRATION_ROUTES.MY_REGISTRATION(sessionId));

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
