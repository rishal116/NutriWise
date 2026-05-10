import { adminApi } from "@/lib/axios/adminApi";
import { AdminRoutes } from "@/routes/admin.routes";

import { AuthSuccessResponse } from "@/types/auth.types";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

interface GenericResponse {
  message: string;
}
export const adminAuthService = {
  login: async (data: LoginDTO): Promise<AuthSuccessResponse> => {
    const response = await adminApi.post<AuthSuccessResponse>(
      AdminRoutes.LOGIN,
      data,
    );
    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem("adminToken", accessToken);
    }
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO): Promise<GenericResponse> => {
    const response = await adminApi.post(AdminRoutes.FORGOT_PASSWORD, data);
    return response.data;
  },

  logout: async (): Promise<GenericResponse> => {
    const response = await adminApi.post(AdminRoutes.LOGOUT);
    localStorage.removeItem("adminToken");
    return response.data;
  },
};
