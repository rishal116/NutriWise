import { api } from "@/lib/axios/api";
import { AdminRoutes } from "@/routes/admin.routes";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

interface AuthResponse {
  message: string;
  accessToken?: string;
  user?: any;
}

interface GenericResponse {
  message: string;
}

export const adminAuthService = {
  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post(AdminRoutes.LOGIN, data); 
    const { accessToken} = response.data;
    if (accessToken) {
      localStorage.setItem("adminToken", accessToken);
    }
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO): Promise<GenericResponse> => {
    const response = await api.post(AdminRoutes.FORGOT_PASSWORD, data);
    return response.data;
  },
  
  
  logout: async (): Promise<GenericResponse> => {
    const response = await api.post(AdminRoutes.LOGOUT);
    localStorage.removeItem("adminToken");
    return response.data
  },
  
  
};
