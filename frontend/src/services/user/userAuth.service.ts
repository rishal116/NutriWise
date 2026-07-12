import { clientApi } from "@/lib/axios/clientApi";
import { API_ROUTES } from "@/routes/user.routes";

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
    const res = await clientApi.post(API_ROUTES.AUTH.SIGNUP, payload);
    return res.data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    const res = await clientApi.post(API_ROUTES.AUTH.VERIFY_OTP, payload, {
      withCredentials: true,
    });
    return res.data;
  },

  async resendOtp(payload: ResendOtpRequest): Promise<ApiResponse> {
    const res = await clientApi.post(API_ROUTES.AUTH.RESEND_OTP, payload);
    return res.data;
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const res = await clientApi.post(API_ROUTES.AUTH.LOGIN, payload);
    return res.data;
  },

  async googleAuth(payload: GoogleAuthRequest): Promise<AuthResponse> {
    const res = await clientApi.post(API_ROUTES.AUTH.GOOGLE, payload);
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ApiResponse> {
    const res = await clientApi.post(API_ROUTES.AUTH.FORGOT_PASSWORD, payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse> {
    const res = await clientApi.post(API_ROUTES.AUTH.RESET_PASSWORD, payload);
    return res.data;
  },

  async getMe(): Promise<GetMeResponse> {
    const res = await clientApi.get(API_ROUTES.AUTH.ME);
    return res.data;
  },

  async logout(): Promise<void> {
    await clientApi.post(API_ROUTES.AUTH.LOGOUT, {}, { withCredentials: true });
  },

  async refreshToken() {
    const res = await clientApi.post(API_ROUTES.AUTH.REFRESH_TOKEN);
    console.log("/refresh");
    return res.data;
  },

  switchRole: async (role: "user" | "nutritionist") => {
    const response = await clientApi.patch(API_ROUTES.AUTH.SWITCH_ROLE, {
      role,
    });

    return response.data;
  },
};
