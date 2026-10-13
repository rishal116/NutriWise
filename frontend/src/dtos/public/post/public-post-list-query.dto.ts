import { PostMediaType } from "@/types/common/post-media.type";

export type PublicPostSortBy = "latest" | "oldest";

export interface PublicPostListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  mediaType?: PostMediaType;
  authorId?: string;
  sortBy?: PublicPostSortBy;
}
