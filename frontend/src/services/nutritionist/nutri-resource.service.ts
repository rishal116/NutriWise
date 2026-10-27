import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_RESOURCE_ROUTES } from "@/routes/nutritionist/resource.routes";

import type { CreateNutriResourceDTO } from "@/dtos/nutritionist/resource/create-resource.dto";
import type { UpdateNutriResourceDTO } from "@/dtos/nutritionist/resource/update-resource.dto";
import type { GetNutriResourcesQueryDTO } from "@/dtos/nutritionist/resource/resource-list-query.dto";
import type { NutriResourceDTO } from "@/dtos/nutritionist/resource/nutri-resource.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutriResourceService = {
  async getResources(
    query: GetNutriResourcesQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriResourceDTO>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutriResourceDTO>>
    >(NUTRITIONIST_RESOURCE_ROUTES.LIST, {
      params: query,
    });

    return res.data.data!;
  },

  async getResourceDetails(resourceId: string): Promise<NutriResourceDTO> {
    const res = await clientApi.get<ApiResponseDTO<NutriResourceDTO>>(
      NUTRITIONIST_RESOURCE_ROUTES.DETAILS(resourceId),
    );

    return res.data.data!;
  },

  async createResource(
    dto: CreateNutriResourceDTO,
    file?: File,
  ): Promise<void> {
    const formData = new FormData();

    formData.append("title", dto.title);
    formData.append("description", dto.description);
    formData.append("type", dto.type);
    formData.append("category", dto.category);

    if (dto.content?.trim()) {
      formData.append("content", dto.content);
    }

    if (file) {
      formData.append("file", file);
    }

    await clientApi.post<ApiResponseDTO>(
      NUTRITIONIST_RESOURCE_ROUTES.LIST,
      formData,
    );
  },

  async updateResource(
    resourceId: string,
    dto: UpdateNutriResourceDTO,
  ): Promise<void> {
    await clientApi.patch<ApiResponseDTO>(
      NUTRITIONIST_RESOURCE_ROUTES.DETAILS(resourceId),
      dto,
    );
  },

  async publishResource(resourceId: string): Promise<void> {
    await clientApi.patch<ApiResponseDTO>(
      NUTRITIONIST_RESOURCE_ROUTES.PUBLISH(resourceId),
    );
  },

  async archiveResource(resourceId: string): Promise<void> {
    await clientApi.patch<ApiResponseDTO>(
      NUTRITIONIST_RESOURCE_ROUTES.ARCHIVE(resourceId),
    );
  },
};
