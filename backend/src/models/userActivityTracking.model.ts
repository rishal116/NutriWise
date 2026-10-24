import { Schema, model, Types } from "mongoose";
import {
  PROGRAM_ACTIVITY_CATEGORIES,
  ProgramActivityCategory,
} from "./userProgramDay.model";

export enum UserActivityTrackingStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

export enum ActivityCompletedBy {
  USER = "user",
  NUTRITIONIST = "nutritionist",
  SYSTEM = "system",
}

export interface IUserActivityTracking {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userProgramDayId: Types.ObjectId;
  userDayTrackingId: Types.ObjectId ;
  activityId: Types.ObjectId;
  title: string;
  category: ProgramActivityCategory;
  valueType: "boolean" | "number" | "duration" | "photo" | "text";
  status: UserActivityTrackingStatus;
  recordedValue?: number;
  recordedText?: string;
  unit?: string;
  evidence: string[];
  skippedReason?: string;
  notes?: string;
  nutritionistFeedback?: string;
  lastUpdatedBy: ActivityCompletedBy;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserActivityTrackingData = Omit<
  IUserActivityTracking,
  "_id" | "createdAt" | "updatedAt"
>;

const UserActivityTrackingSchema = new Schema<IUserActivityTracking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
    },
    userProgramDayId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgramDay",
      required: true,
    },
    userDayTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "UserDayTracking",
      default: null,
    },
    activityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      enum: PROGRAM_ACTIVITY_CATEGORIES,
      required: true,
    },
    valueType: {
      type: String,
      enum: ["boolean", "number", "duration", "photo", "text"],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserActivityTrackingStatus),
      required: true,
      default: UserActivityTrackingStatus.NOT_STARTED,
    },
    recordedValue: {
      type: Number,
      min: 0,
    },
    recordedText: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    unit: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    evidence: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 10,
        message: "Maximum 10 evidence attachments are allowed.",
      },
    },
    skippedReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    nutritionistFeedback: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    lastUpdatedBy: {
      type: String,
      enum: Object.values(ActivityCompletedBy),
      required: true,
      default: ActivityCompletedBy.USER,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserActivityTrackingSchema.index(
  { userProgramDayId: 1, activityId: 1 },
  { unique: true },
);

export const UserActivityTrackingModel = model<IUserActivityTracking>(
  "UserActivityTracking",
  UserActivityTrackingSchema,
);
