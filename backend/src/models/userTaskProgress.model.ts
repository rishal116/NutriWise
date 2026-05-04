// userTaskProgress.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITaskMediaProof {
  imageUrl?: string;
  videoUrl?: string;
  note?: string;
}

export interface IUserTaskProgress extends Document {
  _id: Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;

  dayNumber: number;

  completed: boolean;
  skipped: boolean;

  actualValue?: number;

  completionPercentage: number;

  completedAt?: Date;
  skippedAt?: Date;

  timeSpent?: number; // minutes

  proof?: ITaskMediaProof;

  mood?: "excellent" | "good" | "average" | "bad";

  caloriesBurned?: number;

  notes?: string;

  streakContribution: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const TaskMediaProofSchema = new Schema<ITaskMediaProof>(
  {
    imageUrl: String,
    videoUrl: String,
    note: String,
  },
  { _id: false }
);

const UserTaskProgressSchema = new Schema<IUserTaskProgress>(
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
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    skipped: {
      type: Boolean,
      default: false,
    },

    actualValue: Number,

    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completedAt: Date,

    skippedAt: Date,

    timeSpent: Number,

    proof: TaskMediaProofSchema,

    mood: {
      type: String,
      enum: ["excellent", "good", "average", "bad"],
    },

    caloriesBurned: Number,

    notes: String,

    streakContribution: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate progress per task
UserTaskProgressSchema.index(
  { userId: 1, challengeId: 1, taskId: 1 },
  { unique: true }
);

// Dashboard daily progress
UserTaskProgressSchema.index({
  userId: 1,
  challengeId: 1,
  dayNumber: 1,
});

// Analytics
UserTaskProgressSchema.index({
  challengeId: 1,
  completionPercentage: -1,
});

// Recent activity
UserTaskProgressSchema.index({
  userId: 1,
  updatedAt: -1,
});

export default mongoose.model<IUserTaskProgress>(
  "UserTaskProgress",
  UserTaskProgressSchema
);