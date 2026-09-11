import { IPost } from "../../../models/post.model";

import {
  PostCardResponseDTO,
  PostDetailsResponseDTO,
} from "../../../dtos/user/post/post-response.dto";

import { IUserPostCard } from "../../../types/user/post/user-post-card.type";
import { IUserPostDetails } from "../../../types/user/post/user-post-details.type";

export class UserPostMapper {
  static toDetailsResponseFromModel(post: IPost): PostDetailsResponseDTO {
    return {
      _id: post._id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      media: post.media
        ? {
            url: post.media.url,
            type: post.media.type,
          }
        : undefined,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      bookmarkCount: post.bookmarkCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toDetailsResponse(post: IUserPostDetails): PostDetailsResponseDTO {
    return {
      _id: post._id,
      authorId: post.authorId,
      content: post.content,
      media: post.media
        ? {
            url: post.media.url,
            type: post.media.type,
          }
        : undefined,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      bookmarkCount: post.bookmarkCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toCardResponse(post: IUserPostCard): PostCardResponseDTO {
    return {
      _id: post._id,
      content: post.content,
      media: post.media
        ? {
            url: post.media.url,
            type: post.media.type,
          }
        : undefined,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      bookmarkCount: post.bookmarkCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
