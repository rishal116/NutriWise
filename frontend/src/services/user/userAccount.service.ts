import { clientApi } from "@/lib/axios/clientApi";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userAccountService = {
  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await clientApi.post("/change-password", payload);
    return response.data;
  },
};
