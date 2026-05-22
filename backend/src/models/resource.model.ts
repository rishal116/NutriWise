import { Schema, model, Types } from "mongoose";

export enum ResourceType {
  LINK = "link",
  PDF = "pdf",
  VIDEO = "video",
  IMAGE = "image",
}

export interface IResource {
  groupId: Types.ObjectId;
  uploadedBy: Types.ObjectId;

  title: string;
  description?: string;

  type: ResourceType;

  url: string;

  tags: string[];

  views: number;
  downloads: number;

  isPublic: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    type: {
      type: String,
      enum: Object.values(ResourceType),
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    downloads: {
      type: Number,
      default: 0,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ groupId: 1, createdAt: -1 });

export const ResourceModel = model<IResource>(
  "Resource",
  resourceSchema
);