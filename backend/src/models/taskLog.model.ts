import { Schema, model, Types } from "mongoose";

export interface ITaskLog {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  programDayId: Types.ObjectId;
  date: Date;
  mealsCompleted?: Types.ObjectId[]; 
  workoutsCompleted?: Types.ObjectId[]
  habitsProgress?: {
    habitId: Types.ObjectId;  
    title: string;
    value: number;
  }[];
  weight?: number;
  waterIntake?: number;
  sleepHours?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskLogSchema = new Schema<ITaskLog>(
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
      required: true,
      index: true,
    },

    programDayId: {
      type: Schema.Types.ObjectId,
      ref: "ProgramDay",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    mealsCompleted: [
      {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
      },
    ],

    workoutsCompleted: [
      {
        type: String,
        trim: true,
      },
    ],

    habitsProgress: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    weight: { type: Number, min: 0 },

    waterIntake: { type: Number, min: 0, max: 20 },

    sleepHours: { type: Number, min: 0, max: 24 },

    notes: String,
  },
  { timestamps: true }
);

TaskLogSchema.index(
  { userId: 1, userProgramId: 1, date: 1 },
  { unique: true }
);

TaskLogSchema.index({ userProgramId: 1, date: -1 });

export const TaskLogModel = model<ITaskLog>(
  "TaskLog",
  TaskLogSchema
);