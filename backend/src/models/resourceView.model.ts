import { model, Schema, Types } from "mongoose";

export interface IResourceView {
  _id: Types.ObjectId;
  resourceId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceViewSchema = new Schema<IResourceView>(
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

resourceViewSchema.index({
  resourceId: 1,
  createdAt: -1,
});

resourceViewSchema.index({
  userId: 1,
  createdAt: -1,
});

export const ResourceViewModel = model<IResourceView>(
  "ResourceView",
  resourceViewSchema,
);
