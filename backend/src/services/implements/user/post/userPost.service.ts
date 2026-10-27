import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../../types/types";
import { IUserPostService } from "../../../interfaces/user/post/IUserPostSservice";
import { IUserPostRepository } from "../../../../repositories/interfaces/user/post/IUserPostRepository";
import { CreatePostDTO } from "../../../../dtos/user/post/create-post.dto";
import { UpdatePostDTO } from "../../../../dtos/user/post/update-post.dto";
import { PostListQueryDTO } from "../../../../dtos/user/post/post-list-query.dto";
import { PostCardResponseDTO } from "../../../../dtos/user/post/post-response.dto";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { UserPostMapper } from "../../../../mappers/user/post/user-post.mapper";
import { PostMediaType } from "../../../../types/common/post-media.type";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { CustomError } from "../../../../utils/customError";
import { uploadToCloudinary } from "../../../../utils/cloudinaryUploads.util";

@injectable()
export class UserPostService implements IUserPostService {
  constructor(
    @inject(TYPES.IUserPostRepository)
    private readonly _userPostRepository: IUserPostRepository,
  ) {}

  async createPost(
    userId: string | Types.ObjectId,
    data: CreatePostDTO,
    file?: Express.Multer.File,
  ): Promise<void> {
    await validateDto(CreatePostDTO, data);

    const media = file ? await this.uploadPostMedia(file) : undefined;

    this.validatePostContent(data.content, media);

    await this._userPostRepository.create({
      authorId: this.toObjectId(userId),
      content: data.content,
      media,
    });
  }

  async browseMyPosts(
    userId: string | Types.ObjectId,
    query: PostListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PostCardResponseDTO>> {
    const validatedQuery = await validateDto(PostListQueryDTO, query);

    const result = await this._userPostRepository.browseMyPosts(
      userId,
      validatedQuery,
    );

    const items = result.items.map((post) => UserPostMapper.toResponse(post));

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async findMyPostDetails(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<PostCardResponseDTO> {
    const post = await this._userPostRepository.findMyPostDetails(
      userId,
      postId,
    );

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    return UserPostMapper.toResponse(post);
  }

  async updatePost(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
    data: UpdatePostDTO,
    file?: Express.Multer.File,
  ): Promise<void> {
    await validateDto(UpdatePostDTO, data);

    const existingPost = await this._userPostRepository.findMyPostDetails(
      userId,
      postId,
    );

    if (!existingPost) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const content =
      data.content !== undefined ? data.content : existingPost.content;

    const media = file ? await this.uploadPostMedia(file) : existingPost.media;

    this.validatePostContent(content, media);

    const updatedCount = await this._userPostRepository.updateOne(
      {
        _id: this.toObjectId(postId),
        authorId: this.toObjectId(userId),
      },
      {
        $set: {
          content,
          media,
        },
      },
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Failed to update post",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<void> {
    const deleted = await this._userPostRepository.deleteOne({
      _id: this.toObjectId(postId),
      authorId: this.toObjectId(userId),
    });

    if (!deleted) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }
  }

  private async uploadPostMedia(
    file: Express.Multer.File,
  ): Promise<{ url: string; type: PostMediaType }> {
    const type = this.getPostMediaType(file);

    this.validatePostMedia(file, type);

    const uploadRes = await uploadToCloudinary(file, "nutriwise/posts");

    return {
      url: uploadRes.secureUrl,
      type,
    };
  }

  private getPostMediaType(file: Express.Multer.File): PostMediaType {
    if (file.mimetype.startsWith("image/")) {
      if (file.mimetype === "image/gif") {
        return PostMediaType.GIF;
      }

      return PostMediaType.IMAGE;
    }

    if (file.mimetype.startsWith("video/")) {
      return PostMediaType.VIDEO;
    }

    throw new CustomError(
      "Only image, GIF, and video files are allowed",
      StatusCode.BAD_REQUEST,
    );
  }

  private validatePostMedia(
    file: Express.Multer.File,
    type: PostMediaType,
  ): void {
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const MAX_GIF_SIZE = 10 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

    if (type === PostMediaType.IMAGE && file.size > MAX_IMAGE_SIZE) {
      throw new CustomError(
        "Image size must not exceed 5 MB",
        StatusCode.BAD_REQUEST,
      );
    }

    if (type === PostMediaType.GIF && file.size > MAX_GIF_SIZE) {
      throw new CustomError(
        "GIF size must not exceed 10 MB",
        StatusCode.BAD_REQUEST,
      );
    }

    if (type === PostMediaType.VIDEO && file.size > MAX_VIDEO_SIZE) {
      throw new CustomError(
        "Video size must not exceed 50 MB",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validatePostContent(
    content?: string,
    media?: { url: string; type: PostMediaType },
  ): void {
    const hasContent = Boolean(content?.trim());
    const hasMedia = Boolean(media);

    if (!hasContent && !hasMedia) {
      throw new CustomError(
        "Post must contain either content or media",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid ID", StatusCode.BAD_REQUEST);
    }

    return new Types.ObjectId(id);
  }
}
