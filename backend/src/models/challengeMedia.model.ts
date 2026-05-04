// challengeMedia.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChallengeMedia extends Document {
  _id: Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;

  taskId?: mongoose.Types.ObjectId;

  type: "image" | "video";

  url: string;

  caption?: string;

  uploadedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeMediaSchema = new Schema<IChallengeMedia>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    caption: String,

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ChallengeMediaSchema.index({
  userId: 1,
  challengeId: 1,
});

export default mongoose.model<IChallengeMedia>(
  "ChallengeMedia",
  ChallengeMediaSchema
);