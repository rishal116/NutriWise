import { Document, model, Schema, Types } from "mongoose";

export interface IResourceLike extends Document {
  resourceId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceLikeSchema = new Schema<IResourceLike>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

resourceLikeSchema.index(
  {
    resourceId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

export const ResourceLikeModel = model<IResourceLike>(
  "ResourceLike",
  resourceLikeSchema,
);
