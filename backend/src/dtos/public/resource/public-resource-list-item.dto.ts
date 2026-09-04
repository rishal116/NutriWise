export class PublicResourceListItemDTO {
  resourceId!: string;
  title!: string;
  description!: string;
  type!: string;
  thumbnailUrl?: string;
  category!: string;
  isDownloadable!: boolean;

  viewCount!: number;
  likeCount!: number;
  bookmarkCount!: number;
  commentCount!: number;

  publishedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
