export class PublicResourceListItemDTO {
  resourceId!: string;
  title!: string;
  description!: string;
  type!: string;
  thumbnailUrl?: string;
  category!: string;
  isDownloadable!: boolean;

  viewCount!: number;
  downloadCount!: number;
  likeCount!: number;
  bookmarkCount!: number;
  shareCount!: number;
  commentCount!: number;

  publishedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}