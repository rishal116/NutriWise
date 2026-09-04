import { model, Schema, Types } from "mongoose";

export interface IResourceBookmark {
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
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
