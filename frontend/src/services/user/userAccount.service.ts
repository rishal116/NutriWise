import { api } from "@/lib/axios/api";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userAccountService = {
  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await api.post("/change-password", payload);
    return response.data;
  },
};
