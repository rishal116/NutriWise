import { clientApi } from "@/lib/axios/clientApi";
import { POST_COMMENT_ROUTES } from "@/routes/post";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { PostCommentResponseDto } from "@/dtos/post/post-comment-response.dto";

export const postCommentService = {
  async createComment(
    postId: string,
    content: string,
  ): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.post<ApiResponseDTO<null>>(
      POST_COMMENT_ROUTES.COMMENTS(postId),
      { content },
    );

    return response.data;
  },

  async getComments(
    postId: string,
    limit = 10,
    cursor?: string,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<PostCommentResponseDto>>
  > {
    const params: Record<string, string | number> = { limit };

    if (cursor) {
      params.cursor = cursor;
    }

    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PostCommentResponseDto>>
    >(POST_COMMENT_ROUTES.COMMENTS(postId), { params });

    return response.data;
  },

  async deleteComment(commentId: string): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.delete<ApiResponseDTO<null>>(
      POST_COMMENT_ROUTES.COMMENT(commentId),
    );

    return response.data;
  },
};
