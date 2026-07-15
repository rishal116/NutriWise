import { clientApi } from "@/lib/axios/clientApi";
import { AUTH_ROUTES } from "@/routes/user";

import {
  ApiResponse,
  AuthResponse,
  GetMeResponse,
} from "@/types/auth/auth-response.types";

import {
  VerifyOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  GoogleAuthRequest,
  SignupRequest,
} from "@/types/auth/auth-request.types";

export const userAuthService = {
  async register(payload: SignupRequest): Promise<ApiResponse> {
    const res = await clientApi.post(AUTH_ROUTES.SIGNUP, payload);
    return res.data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    const res = await clientApi.post(AUTH_ROUTES.VERIFY_OTP, payload, {
      withCredentials: true,
    });
    return res.data;
  },

  async resendOtp(payload: ResendOtpRequest): Promise<ApiResponse> {
    const res = await clientApi.post(AUTH_ROUTES.RESEND_OTP, payload);
    return res.data;
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await clientApi.post(AUTH_ROUTES.LOGIN, payload);
    return res.data;
  },

  async googleAuth(payload: GoogleAuthRequest): Promise<AuthResponse> {
    const res = await clientApi.post(AUTH_ROUTES.GOOGLE, payload);
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ApiResponse> {
    const res = await clientApi.post(AUTH_ROUTES.FORGOT_PASSWORD, payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse> {
    const res = await clientApi.post(AUTH_ROUTES.RESET_PASSWORD, payload);
    return res.data;
  },

  async getMe(): Promise<GetMeResponse> {
    const res = await clientApi.get(AUTH_ROUTES.ME);
    return res.data;
  },

  async logout(): Promise<void> {
    await clientApi.post(AUTH_ROUTES.LOGOUT, {}, { withCredentials: true });
  },

  async refreshToken() {
    const res = await clientApi.post(AUTH_ROUTES.REFRESH_TOKEN);
    console.log("/refresh");
    return res.data;
  },

  switchRole: async (role: "user" | "nutritionist") => {
    const response = await clientApi.patch(AUTH_ROUTES.SWITCH_ROLE, {
      role,
    });

    return response.data;
  },
};
