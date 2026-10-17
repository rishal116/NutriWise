import type { CreateNutriSessionDTO } from "@/dtos/nutritionist/session/create-session.dto";
import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";
import type { GetNutriSessionsQueryDTO } from "@/dtos/nutritionist/session/session-list-query.dto";
import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";
import type { UpdateNutriSessionDTO } from "@/dtos/nutritionist/session/update-session.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_SESSION_ROUTES } from "@/routes/nutritionist/session.routes";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { NutriSessionParticipantsQueryDTO } from "@/dtos/nutritionist/session/nutri-session-participants-query.dto";
import type { NutriSessionParticipantResponseDTO } from "@/dtos/nutritionist/session/nutri-session-participant-response.dto";

function appendSessionFormData(
  formData: FormData,
  dto: CreateNutriSessionDTO | UpdateNutriSessionDTO,
  thumbnail?: File | null,
): void {
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

    if (dto.pricing.amount !== undefined) {
      formData.append("pricing[amount]", String(dto.pricing.amount));
    }

    if (dto.pricing.currency !== undefined) {
      formData.append("pricing[currency]", dto.pricing.currency);
    }
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
    formData.append("thumbnail", thumbnail);
  }
}

export const nutriSessionService = {
  async createSession(
    dto: CreateNutriSessionDTO,
    thumbnail?: File | null,
  ): Promise<void> {
    const formData = new FormData();
    appendSessionFormData(formData, dto, thumbnail);

    await clientApi.post<ApiResponseDTO<null>>(
      NUTRITIONIST_SESSION_ROUTES.CREATE,
      formData,
    );
  },

  async getSessions(
    query: GetNutriSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>>
    >(NUTRITIONIST_SESSION_ROUTES.LIST, {
      params: query,
    });

    if (!response.data.data) {
      throw new Error("Session list data is missing from the API response.");
    }

    return response.data.data;
  },

  async getSessionDetails(
    sessionId: string,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const response = await clientApi.get<
      ApiResponseDTO<NutriSessionDetailsResponseDTO>
    >(NUTRITIONIST_SESSION_ROUTES.DETAILS(sessionId));

    if (!response.data.data) {
      throw new Error("Session details are missing from the API response.");
    }

    return response.data.data;
  },

  async updateSession(
    sessionId: string,
    dto: UpdateNutriSessionDTO,
    thumbnail?: File | null,
  ): Promise<void> {
    const formData = new FormData();
    appendSessionFormData(formData, dto, thumbnail);

    await clientApi.patch<ApiResponseDTO<null>>(
      NUTRITIONIST_SESSION_ROUTES.UPDATE(sessionId),
      formData,
    );
  },

  async publishSession(sessionId: string): Promise<void> {
    await clientApi.patch<ApiResponseDTO<null>>(
      NUTRITIONIST_SESSION_ROUTES.PUBLISH(sessionId),
    );
  },

  async deleteSession(sessionId: string): Promise<void> {
    await clientApi.delete<ApiResponseDTO<null>>(
      NUTRITIONIST_SESSION_ROUTES.DELETE(sessionId),
    );
  },

  async getSessionParticipants(
    sessionId: string,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionParticipantResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<NutriSessionParticipantResponseDTO>
      >
    >(NUTRITIONIST_SESSION_ROUTES.PARTICIPANTS(sessionId), {
      params: query,
    });

    if (!response.data.data) {
      throw new Error(
        "Session participants are missing from the API response.",
      );
    }

    return response.data.data;
  },
};
