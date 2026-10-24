import { Schema, model, Types } from "mongoose";

export const PROGRAM_STATUS = [
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUS)[number];

export interface IUserProgram {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  userPlanId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  status: ProgramStatus;
  lifecycle: {
    pausedAt: Date | null;
    resumedAt: Date | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
  };
  cancellationReason: string | null;
  cancelledBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgramSchema = new Schema<IUserProgram>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userPlanId: {
      type: Schema.Types.ObjectId,
      ref: "UserPlan",
      required: true,
      unique: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "NutritionistPlan",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator(this: IUserProgram, value: Date) {
          return value >= this.startDate;
        },
        message: "End date must be on or after the start date.",
      },
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Duration must be a whole number of days.",
      },
    },

    status: {
      type: String,
      enum: PROGRAM_STATUS,
      required: true,
      default: "upcoming",
    },

    lifecycle: {
      pausedAt: {
        type: Date,
        default: null,
      },
      resumedAt: {
        type: Date,
        default: null,
      },
      completedAt: {
        type: Date,
        default: null,
      },
      cancelledAt: {
        type: Date,
        default: null,
      },
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserProgramSchema.index({
  userId: 1,
  status: 1,
  createdAt: -1,
});

UserProgramSchema.index({
  nutritionistId: 1,
  status: 1,
  createdAt: -1,
});

export const UserProgramModel = model<IUserProgram>(
  "UserProgram",
  UserProgramSchema,
);
