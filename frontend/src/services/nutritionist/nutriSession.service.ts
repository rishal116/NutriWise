import { clientApi } from "@/lib/axios/clientApi";

import { NUTRITIONIST_SESSION_ROUTES } from "@/routes/nutritionist/session.routes";

import type { CreateNutriSessionDTO } from "@/dtos/nutritionist/session/create-session.dto";

import type { UpdateNutriSessionDTO } from "@/dtos/nutritionist/session/update-session.dto";

import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";

import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

import type { GetNutriSessionsQueryDTO } from "@/dtos/nutritionist/session/session-list-query.dto";

import type { ApiResponse } from "@/types/api/apiResponse";

import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutriSessionService = {
  async createSession(
    dto: CreateNutriSessionDTO,
    thumbnailFile?: File | null,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const formData = new FormData();

    formData.append("title", dto.title);
    formData.append("description", dto.description);
    formData.append("type", dto.type);

    formData.append("pricing[type]", dto.pricing.type);
    formData.append("pricing[amount]", String(dto.pricing.amount));
    formData.append("pricing[currency]", dto.pricing.currency);

    formData.append("scheduledAt", dto.scheduledAt);
    formData.append("durationInMinutes", String(dto.durationInMinutes));

    if (dto.maxParticipants !== undefined) {
      formData.append("maxParticipants", String(dto.maxParticipants));
    }

    if (thumbnailFile) {
      formData.append("thumbnailUrl", thumbnailFile);
    }

    const res = await clientApi.post<
      ApiResponse<NutriSessionDetailsResponseDTO>
    >(NUTRITIONIST_SESSION_ROUTES.CREATE, formData);

    return res.data.data;
  },

  async getSessions(
    query: GetNutriSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>> {
    const res = await clientApi.get<
      ApiResponse<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>>
    >(NUTRITIONIST_SESSION_ROUTES.LIST, {
      params: query,
    });

    return res.data.data;
  },

  async getSessionDetails(
    sessionId: string,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const res = await clientApi.get<
      ApiResponse<NutriSessionDetailsResponseDTO>
    >(NUTRITIONIST_SESSION_ROUTES.DETAILS(sessionId));

    return res.data.data;
  },

  async updateSession(
    sessionId: string,
    dto: UpdateNutriSessionDTO,
    thumbnail?: File,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const formData = new FormData();

    if (dto.title !== undefined) {
      formData.append("title", dto.title);
    }

    if (dto.description !== undefined) {
      formData.append("description", dto.description);
    }

    if (dto.type !== undefined) {
      formData.append("type", dto.type);
    }

    if (dto.pricing !== undefined) {
      formData.append("pricing[type]", dto.pricing.type);
      formData.append("pricing[amount]", String(dto.pricing.amount));
      formData.append("pricing[currency]", dto.pricing.currency);
    }

    if (dto.scheduledAt !== undefined) {
      formData.append("scheduledAt", dto.scheduledAt);
    }

    if (dto.durationInMinutes !== undefined) {
      formData.append("durationInMinutes", String(dto.durationInMinutes));
    }

    if (dto.maxParticipants !== undefined) {
      formData.append("maxParticipants", String(dto.maxParticipants));
    }

    if (thumbnail) {
      formData.append("thumbnailUrl", thumbnail);
    }

    const res = await clientApi.patch<
      ApiResponse<NutriSessionDetailsResponseDTO>
    >(NUTRITIONIST_SESSION_ROUTES.UPDATE(sessionId), formData);

    return res.data.data;
  },

  async publishSession(
    sessionId: string,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const res = await clientApi.patch<
      ApiResponse<NutriSessionDetailsResponseDTO>
    >(NUTRITIONIST_SESSION_ROUTES.PUBLISH(sessionId));

    return res.data.data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await clientApi.delete(NUTRITIONIST_SESSION_ROUTES.DELETE(sessionId));
  },
};
