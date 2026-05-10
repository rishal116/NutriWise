import { api } from "@/lib/axios/api";
import { API_ROUTES } from "@/routes/user.routes";
import { ClientProfilePayload } from "@/types/clientProfile.types";


export const clientProfileService = {
  createProfile: async (payload: ClientProfilePayload) => {
    const res = await api.post(API_ROUTES.CLIENT_PROFILE.CREATE, payload);
    return res.data;
  },

  updateProfile: async (payload: Partial<ClientProfilePayload>) => {
    const res = await api.put(API_ROUTES.CLIENT_PROFILE.UPDATE, payload);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get(API_ROUTES.CLIENT_PROFILE.GET_ME);
    return res.data;
  },
};