import { CreatePostDTO } from "../../dtos/post/create-post.dto";
import { IPost } from "../../models/post.model";  

export class PostMapper {
  static toDomain(dto: CreatePostDTO): Partial<IPost> {
    return {
      authorId: dto.authorId as any,
      title: dto.title, 
      content: dto.content,
      mediaUrls: dto.mediaUrls ?? [],
    };
  }
}