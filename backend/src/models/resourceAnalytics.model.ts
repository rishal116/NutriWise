import { Document, model, Schema, Types } from "mongoose";

export interface IResourceAnalytics extends Document {
  resourceId: Types.ObjectId;
  date: Date;

  viewCount: number;
  uniqueViewCount: number;

  downloadCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;
  commentCount: number;

  averageViewDurationSeconds: number;

  createdAt: Date;
  updatedAt: Date;
}

const resourceAnalyticsSchema = new Schema<IResourceAnalytics>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    uniqueViewCount: {
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

    averageViewDurationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

resourceAnalyticsSchema.index(
  {
    resourceId: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

export const ResourceAnalyticsModel = model<IResourceAnalytics>(
  "ResourceAnalytics",
  resourceAnalyticsSchema,
);
