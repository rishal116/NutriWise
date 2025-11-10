import { api } from "@/lib/api";
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
  refreshToken?: string;
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
      localStorage.setItem("adminAccessToken", accessToken);
    }
    return response.data;
  },

   getAllUsers: async () => {
    const response = await api.get(AdminRoutes.GET_ALL_USERS);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(`${AdminRoutes.BLOCK_USER}/${userId}`);
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await api.patch(`${AdminRoutes.UNBLOCK_USER}/${userId}`);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO): Promise<GenericResponse> => {
    const response = await api.post(AdminRoutes.FORGOT_PASSWORD, data);
    return response.data;
  },
  
};
