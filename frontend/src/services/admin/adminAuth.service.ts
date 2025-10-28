import { api } from "@/lib/api";
import { AdminRoutes } from "@/routes/admin.routes";

// ---- DTO Interfaces ----
export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

// ---- API Response Interfaces ----
interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
}

interface GenericResponse {
  message: string;
}

export const adminAuthService = {
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post(AdminRoutes.LOGIN, data); 
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO): Promise<GenericResponse> => {
    const response = await api.post(AdminRoutes.FORGOT_PASSWORD, data);
    return response.data;
  },
};
