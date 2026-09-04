import { clientApi } from "@/lib/axios/clientApi";

import { USER_POST_ROUTES } from "@/routes/user";

import { CreatePostDTO } from "@/dtos/user/post/create-post.dto";
import { UpdatePostDTO } from "@/dtos/user/post/update-post.dto";
import { PostListQueryDTO } from "@/dtos/user/post/post-list-query.dto";
import {
  PostCardResponseDTO,
  PostDetailsResponseDTO,
} from "@/dtos/user/post/post-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const userPostService = {
  async createPost(
    data: CreatePostDTO,
    file?: File,
  ): Promise<ApiResponseDTO<PostDetailsResponseDTO>> {
    const formData = new FormData();

    if (data.content !== undefined) {
      formData.append("content", data.content);
    }

    if (file) {
      formData.append("media", file);
    }

    const res = await clientApi.post<ApiResponseDTO<PostDetailsResponseDTO>>(
      USER_POST_ROUTES.CREATE,
      formData,
    );

    return res.data;
  },

  async browseMyPosts(
    query?: PostListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<PostCardResponseDTO>>> {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<PostCardResponseDTO>>
    >(USER_POST_ROUTES.LIST, {
      params: query,
    });

    return res.data;
  },

  async getPostDetails(
    postId: string,
  ): Promise<ApiResponseDTO<PostDetailsResponseDTO>> {
    const res = await clientApi.get<ApiResponseDTO<PostDetailsResponseDTO>>(
      USER_POST_ROUTES.DETAILS(postId),
    );

    return res.data;
  },

  async updatePost(
    postId: string,
    data: UpdatePostDTO,
    file?: File,
  ): Promise<ApiResponseDTO<PostDetailsResponseDTO>> {
    const formData = new FormData();

    if (data.content !== undefined) {
      formData.append("content", data.content);
    }

    if (file) {
      formData.append("media", file);
    }

    const res = await clientApi.patch<ApiResponseDTO<PostDetailsResponseDTO>>(
      USER_POST_ROUTES.UPDATE(postId),
      formData,
    );

    return res.data;
  },

  async deletePost(postId: string): Promise<ApiResponseDTO<void>> {
    const res = await clientApi.delete<ApiResponseDTO<void>>(
      USER_POST_ROUTES.DELETE(postId),
    );

    return res.data;
  },
};
