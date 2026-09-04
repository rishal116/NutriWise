import { model, Schema, Types } from "mongoose";

export interface IResourceView {
  resourceId: Types.ObjectId;
  userId?: Types.ObjectId;
  sessionId?: string;
  durationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const resourceViewSchema = new Schema<IResourceView>(
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
      index: true,
    },

    sessionId: {
      type: String,
      trim: true,
      index: true,
    },

    durationSeconds: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

resourceViewSchema.index({
  resourceId: 1,
  viewDate: -1,
});

resourceViewSchema.index({
  userId: 1,
  viewDate: -1,
});

resourceViewSchema.index({
  sessionId: 1,
  viewDate: -1,
});

export const ResourceViewModel = model<IResourceView>(
  "ResourceView",
  resourceViewSchema,
);
