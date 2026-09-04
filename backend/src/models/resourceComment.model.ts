import { model, Schema, Types } from "mongoose";

export interface IResourceComment {
  _id:Types.ObjectId;
  resourceId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resourceCommentSchema = new Schema<IResourceComment>(
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

    content: {
      type: String,
      required: true,
      trim: true,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

resourceCommentSchema.index({
  resourceId: 1,
  createdAt: -1,
});

resourceCommentSchema.index({
  userId: 1,
  createdAt: -1,
});

export const ResourceCommentModel = model<IResourceComment>(
  "ResourceComment",
  resourceCommentSchema,
);
