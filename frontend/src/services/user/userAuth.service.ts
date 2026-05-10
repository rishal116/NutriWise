import { api } from "@/lib/axios/api";
import { UserSignupType } from "@/validation/userAuth.validation";
import { API_ROUTES } from "@/routes/user.routes";
import { AuthResponse, GoogleAuthPayload } from "@/types/auth.types";



export const userAuthService = {
  register: async (payload: UserSignupType): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.SIGNUP, payload);
    return res.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
    const res = await api.post(
      API_ROUTES.AUTH.VERIFY_OTP,
      { email, otp },
      { withCredentials: true },
    );
    return res.data;
  },

  resendOtp: async (email: string): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.RESEND_OTP, { email });
    return res.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ROUTES.AUTH.LOGOUT, {}, { withCredentials: true });
    window.location.href = "/";
  },

  googleSignup: async (payload: GoogleAuthPayload): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.GOOGLE_SIGNUP, payload);
    return res.data;
  },

  googleSignin: async (payload: GoogleAuthPayload): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.GOOGLE_SIGNIN, payload);
    return res.data;
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    return res.data;
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<AuthResponse> => {
    const res = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
    return res.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const res = await api.get(API_ROUTES.AUTH.ME);
    return res.data;
  },


  switchRole: async (
  activeRole: "client" | "nutritionist" | "admin",
): Promise<AuthResponse> => {
  const res = await api.patch(
    API_ROUTES.AUTH.SWITCH_ROLE,
    { activeRole },
    { withCredentials: true },
  );
  return res.data;
},

};
