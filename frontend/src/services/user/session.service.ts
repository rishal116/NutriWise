import { api } from "@/lib/axios/api";



export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type NutritionistInfo = {
  id: string;
  name: string;
  email: string;
};

export type UserSessionList = {
  id: string;

  title: string;
  description?: string;

  scheduledAt: string;
  durationInMinutes: number;

  type: "free" | "paid";
  price?: number;

   status: "scheduled" | "live";

  joinedUsersCount: number;

  maxParticipants?: number;
};

export type UserSessionDetails = {
  id: string;

  title: string;
  description?: string;

  scheduledAt: string;
  durationInMinutes: number;

  type: "free" | "paid";
  price?: number;

  status: string;

  roomId: string;

  joinedUsersCount: number;

  maxParticipants?: number;

  nutritionist: NutritionistInfo;

  users: SessionUser[];
};

export type PaginatedSessionResponse = {
  success: boolean;
  message: string;

  data: UserSessionList[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

export type SessionDetailsResponse = {
  success: boolean;
  message: string;
  data: UserSessionDetails;
};

export type ActionResponse = {
  success: boolean;
  message: string;
};

/* ===================== SERVICE ===================== */

export const userSessionService = {
  /* PUBLIC SESSIONS */
  getPublicSessions: async ({
    page = 1,
    limit = 10,
    status,
    type,
    search,
    sortBy = "scheduledAt",
    sortOrder = "desc",
  }: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedSessionResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
    });

    if (status) {
      params.append("status", status);
    }

    if (type) {
      params.append("type", type);
    }

    if (search) {
      params.append("search", search);
    }

    const { data } = await api.get(
      `/sessions/public?${params.toString()}`,
    );

    return data;
  },

  /* PUBLIC SESSION DETAILS */
  getPublicSessionDetails: async (
    sessionId: string,
  ): Promise<SessionDetailsResponse> => {
    const { data } = await api.get(
      `/sessions/public/${sessionId}`,
    );

    return data;
  },

  /* MY JOINED SESSIONS */
  getMySessions: async () => {
    const { data } = await api.get("/sessions/my");

    return data;
  },

  /* MY SESSION DETAILS */
  getMySessionDetails: async (
    sessionId: string,
  ): Promise<SessionDetailsResponse> => {
    const { data } = await api.get(
      `/sessions/my/${sessionId}`,
    );

    return data;
  },

  /* JOIN FREE SESSION */
  joinFreeSession: async (
    sessionId: string,
  ): Promise<ActionResponse> => {
    const { data } = await api.post(
      `/sessions/${sessionId}/join-free`,
    );

    return data;
  },

  /* CREATE PAYMENT */
  createPayment: async (sessionId: string) => {
    const { data } = await api.post(
      `/sessions/${sessionId}/create-payment`,
    );

    return data.data;
  },

  /* VERIFY PAYMENT */
  verifyPayment: async (
    sessionId: string,
  ): Promise<ActionResponse> => {
    const { data } = await api.post(
      `/sessions/${sessionId}/verify-payment`,
    );

    return data;
  },

  /* LEAVE SESSION */
  leaveSession: async (
    sessionId: string,
  ): Promise<ActionResponse> => {
    const { data } = await api.post(
      `/sessions/${sessionId}/leave`,
    );

    return data;
  },

  /* LIVE SESSION ACCESS */
  getSessionAccess: async (sessionId: string) => {
    const { data } = await api.get(
      `/sessions/${sessionId}/access`,
    );

    return data.data;
  },
};