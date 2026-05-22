export interface CreatePostDTO {
  authorId: string;

  title?: string;
  content: string;

  mediaUrls?: string[];
}