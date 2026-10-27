import { clientApi } from "@/lib/axios/clientApi";
import { RESOURCE_COMMENT_ROUTES } from "@/routes/resource";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ResourceCommentDTO } from "@/dtos/resource/resource-comment.dto";

export const resourceCommentService = {
  async addComment(
    resourceId: string,
    content: string,
  ): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.post<ApiResponseDTO<null>>(
      RESOURCE_COMMENT_ROUTES.COMMENTS(resourceId),
      { content },
    );

    return response.data;
  },

  async getComments(
    resourceId: string,
    limit = 10,
    cursor?: string,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<ResourceCommentDTO>>> {
    const params: Record<string, string | number> = { limit };

    if (cursor) {
      params.cursor = cursor;
    }

    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<ResourceCommentDTO>>
    >(RESOURCE_COMMENT_ROUTES.COMMENTS(resourceId), { params });

    return response.data;
  },

  async deleteComment(commentId: string): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.delete<ApiResponseDTO<null>>(
      RESOURCE_COMMENT_ROUTES.COMMENT(commentId),
    );

    return response.data;
  },
};
