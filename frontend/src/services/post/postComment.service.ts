import { clientApi } from "@/lib/axios/clientApi";
import { POST_COMMENT_ROUTES } from "@/routes/post";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export interface PostCommentDTO {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostCommentListDTO {
  comments: PostCommentDTO[];
  nextCursor: {
    createdAt: string;
    id: string;
  } | null;
  hasMore: boolean;
}

export const postCommentService = {
  async createComment(
    postId: string,
    content: string,
  ): Promise<ApiResponseDTO<PostCommentDTO>> {
    const response = await clientApi.post<ApiResponseDTO<PostCommentDTO>>(
      POST_COMMENT_ROUTES.COMMENTS(postId),
      { content },
    );

    return response.data;
  },

  async getComments(
    postId: string,
    limit = 10,
    cursor?: { createdAt: string; id: string },
  ): Promise<ApiResponseDTO<PostCommentListDTO>> {
    const params: Record<string, string | number> = { limit };

    if (cursor) {
      params.cursorCreatedAt = cursor.createdAt;
      params.cursorId = cursor.id;
    }

    const response = await clientApi.get<ApiResponseDTO<PostCommentListDTO>>(
      POST_COMMENT_ROUTES.COMMENTS(postId),
      { params },
    );

    return response.data;
  },

  async deleteComment(
    commentId: string,
  ): Promise<ApiResponseDTO<null>> {
    const response = await clientApi.delete<ApiResponseDTO<null>>(
      POST_COMMENT_ROUTES.COMMENT(commentId),
    );

    return response.data;
  },
};