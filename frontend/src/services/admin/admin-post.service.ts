import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_POST_ROUTES } from "@/routes/admin";
import type { AdminPostQueryDTO } from "@/dtos/admin/post/admin-post-query.dto";
import type { AdminPostListItemDTO } from "@/dtos/admin/post/admin-post-list-item.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminPostService = {
  async getPosts(
    query: AdminPostQueryDTO = {},
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<AdminPostListItemDTO>>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminPostListItemDTO>>
    >(ADMIN_POST_ROUTES.LIST, {
      params: query,
    });

    return response.data;
  },

  async deletePost(postId: string): Promise<void> {
    await clientApi.delete(ADMIN_POST_ROUTES.DELETE(postId));
  },
};
