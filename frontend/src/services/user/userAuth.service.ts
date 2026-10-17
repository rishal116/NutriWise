import { clientApi } from "@/lib/axios/clientApi";
import { AUTH_ROUTES } from "@/routes/user";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { AuthResponse } from "@/dtos/auth/auth-response.dto";
import type { GetMeResponse } from "@/dtos/auth/get-me-response.dto";
import type {
  VerifyOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  GoogleAuthRequest,
  SignupRequest,
} from "@/dtos/auth/auth-request.dto";

let getMeRequest: Promise<GetMeResponse> | null = null;

export const userAuthService = {
  async register(payload: SignupRequest): Promise<ApiResponseDTO> {
    const { data } = await clientApi.post<ApiResponseDTO>(
      AUTH_ROUTES.SIGNUP,
      payload,
    );

    return data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    const { data } = await clientApi.post<AuthResponse>(
      AUTH_ROUTES.VERIFY_OTP,
      payload,
    );

    return data;
  },

  async resendOtp(payload: ResendOtpRequest): Promise<ApiResponseDTO> {
    const { data } = await clientApi.post<ApiResponseDTO>(
      AUTH_ROUTES.RESEND_OTP,
      payload,
    );

    return data;
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await clientApi.post<AuthResponse>(
      AUTH_ROUTES.LOGIN,
      payload,
    );

    return data;
  },

  async googleAuth(payload: GoogleAuthRequest): Promise<AuthResponse> {
    const { data } = await clientApi.post<AuthResponse>(
      AUTH_ROUTES.GOOGLE,
      payload,
    );

    return data;
  },

  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<ApiResponseDTO> {
    const { data } = await clientApi.post<ApiResponseDTO>(
      AUTH_ROUTES.FORGOT_PASSWORD,
      payload,
    );

    return data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponseDTO> {
    const { data } = await clientApi.post<ApiResponseDTO>(
      AUTH_ROUTES.RESET_PASSWORD,
      payload,
    );

    return data;
  },

  getMe(): Promise<GetMeResponse> {
    if (!getMeRequest) {
      getMeRequest = clientApi
        .get<GetMeResponse>(AUTH_ROUTES.ME)
        .then(({ data }) => data)
        .finally(() => {
          getMeRequest = null;
        });
    }

    return getMeRequest;
  },

  async logout(): Promise<void> {
    await clientApi.post<ApiResponseDTO>(AUTH_ROUTES.LOGOUT, {});
  },

  async refreshToken(): Promise<AuthResponse> {
    const { data } = await clientApi.post<AuthResponse>(
      AUTH_ROUTES.REFRESH_TOKEN,
      {},
    );

    return data;
  },

  async switchRole(role: "user" | "nutritionist"): Promise<AuthResponse> {
    const { data } = await clientApi.patch<AuthResponse>(
      AUTH_ROUTES.SWITCH_ROLE,
      { role },
    );

    return data;
  },
};
