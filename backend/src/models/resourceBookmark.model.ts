import { Document, model, Schema, Types } from "mongoose";

export interface IResourceBookmark extends Document {
  resourceId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceBookmarkSchema = new Schema<IResourceBookmark>(
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

resourceBookmarkSchema.index(
  {
    resourceId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

resourceBookmarkSchema.index({
  userId: 1,
  createdAt: -1,
});

export const ResourceBookmarkModel = model<IResourceBookmark>(
  "ResourceBookmark",
  resourceBookmarkSchema,
);
