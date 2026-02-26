import { Schema, model, Types } from "mongoose";

export type PhotoType =
  | "front"
  | "side"
  | "back"
  | "face"
  | "upper_body"
  | "lower_body"
  | "full_body"
  | "posture"
  | "injury_area"
  | "other";

export type VisibilityType = "private" | "coach_only" | "public";

export interface IProgressPhoto {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId?: Types.ObjectId;
  imageUrl: string;
  photoType: PhotoType;
  visibility: VisibilityType;
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  waistCm?: number;
  chestCm?: number;
  hipCm?: number;
  note?: string;
  imageMeta?: {
    width?: number;
    height?: number;
    sizeKb?: number;
  };
  takenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressPhotoSchema = new Schema<IProgressPhoto>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      index: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    photoType: {
      type: String,
      enum: [
        "front",
        "side",
        "back",
        "face",
        "upper_body",
        "lower_body",
        "full_body",
        "posture",
        "injury_area",
        "other",
      ],
      default: "other",
      index: true,
    },

    visibility: {
      type: String,
      enum: ["private", "coach_only", "public"],
      default: "private",
      index: true,
    },

    weight: { type: Number, min: 0 },
    bodyFatPercentage: { type: Number, min: 0, max: 100 },
    muscleMass: { type: Number, min: 0 },
    waistCm: { type: Number, min: 0 },
    chestCm: { type: Number, min: 0 },
    hipCm: { type: Number, min: 0 },

    note: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    imageMeta: {
      width: Number,
      height: Number,
      sizeKb: Number,
    },

    takenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

ProgressPhotoSchema.index({ userId: 1, takenAt: -1 });

export const ProgressPhotoModel = model<IProgressPhoto>(
  "ProgressPhoto",
  ProgressPhotoSchema
);