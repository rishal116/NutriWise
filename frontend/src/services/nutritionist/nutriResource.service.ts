import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_RESOURCE_ROUTES } from "@/routes/nutritionist/resource.routes";
import type { CreateNutriResourceDTO } from "@/dtos/nutritionist/resource/create-resource.dto";
import type { UpdateNutriResourceDTO } from "@/dtos/nutritionist/resource/update-resource.dto";
import type { GetNutriResourcesQueryDTO } from "@/dtos/nutritionist/resource/resource-list-query.dto";
import type { NutriResourceListItemDTO } from "@/dtos/nutritionist/resource/resource-list-response.dto";
import type { NutriResourceDetailsResponseDTO } from "@/dtos/nutritionist/resource/resource-details-response.dto";
import type { ApiResponse } from "@/types/api/apiResponse";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutriResourceService = {
  async getResources(
    query: GetNutriResourcesQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriResourceListItemDTO>> {
    const res = await clientApi.get<
      ApiResponse<InfiniteScrollResponseDTO<NutriResourceListItemDTO>>
    >(NUTRITIONIST_RESOURCE_ROUTES.LIST, {
      params: query,
    });

    return res.data.data;
  },

  async getResourceDetails(
    resourceId: string,
  ): Promise<NutriResourceDetailsResponseDTO> {
    const res = await clientApi.get<
      ApiResponse<NutriResourceDetailsResponseDTO>
    >(NUTRITIONIST_RESOURCE_ROUTES.DETAILS(resourceId));

    return res.data.data;
  },

  async createResource(
    dto: CreateNutriResourceDTO,
    file?: File,
    thumbnail?: File,
  ): Promise<NutriResourceDetailsResponseDTO> {
    const formData = new FormData();

    formData.append("title", dto.title);
    formData.append("description", dto.description);
    formData.append("type", dto.type);
    formData.append("category", dto.category);
    formData.append("isDownloadable", String(dto.isDownloadable));

    if (dto.content) {
      formData.append("content", dto.content);
    }

    if (dto.externalUrl) {
      formData.append("externalUrl", dto.externalUrl);
    }

    if (file) {
      formData.append("file", file);
    }

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const res = await clientApi.post<
      ApiResponse<NutriResourceDetailsResponseDTO>
    >(NUTRITIONIST_RESOURCE_ROUTES.LIST, formData);

    return res.data.data;
  },

  async updateResource(
    resourceId: string,
    dto: UpdateNutriResourceDTO,
  ): Promise<NutriResourceDetailsResponseDTO> {
    const res = await clientApi.patch<
      ApiResponse<NutriResourceDetailsResponseDTO>
    >(NUTRITIONIST_RESOURCE_ROUTES.DETAILS(resourceId), dto);

    return res.data.data;
  },

  async publishResource(
    resourceId: string,
  ): Promise<NutriResourceDetailsResponseDTO> {
    const res = await clientApi.patch<
      ApiResponse<NutriResourceDetailsResponseDTO>
    >(NUTRITIONIST_RESOURCE_ROUTES.PUBLISH(resourceId));

    return res.data.data;
  },

  async archiveResource(
    resourceId: string,
  ): Promise<NutriResourceDetailsResponseDTO> {
    const res = await clientApi.patch<
      ApiResponse<NutriResourceDetailsResponseDTO>
    >(NUTRITIONIST_RESOURCE_ROUTES.ARCHIVE(resourceId));

    return res.data.data;
  },
};
