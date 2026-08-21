import { model, Schema, Types } from "mongoose";

export const RESOURCE_TYPES = [
  "article",
  "pdf",
  "video",
  "external_link",
  "infographic",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_CATEGORIES = [
  "nutrition",
  "fitness",
  "wellness",
  "recipes",
] as const;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_STATUSES = ["draft", "published", "archived"] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export interface IResource {
  _id: Types.ObjectId;

  title: string;
  description: string;

  type: ResourceType;

  content?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;

  category: ResourceCategory;

  status: ResourceStatus;

  createdBy: Types.ObjectId;

  publishedAt?: Date;

  isDownloadable: boolean;

  viewCount: number;
  downloadCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;
  commentCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: RESOURCE_TYPES,
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
    },

    fileUrl: {
      type: String,
      trim: true,
    },

    externalUrl: {
      type: String,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: RESOURCE_CATEGORIES,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: RESOURCE_STATUSES,
      default: "draft",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Nutritionist",
      required: true,
      index: true,
    },

    publishedAt: {
      type: Date,
    },

    isDownloadable: {
      type: Boolean,
      default: false,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

resourceSchema.index({
  title: "text",
  description: "text",
});

resourceSchema.index({
  status: 1,
  category: 1,
  createdAt: -1,
});

resourceSchema.index({
  status: 1,
  type: 1,
  createdAt: -1,
});

export const ResourceModel = model<IResource>("Resource", resourceSchema);
