import { Schema, model, Types } from "mongoose";

export interface IUserProgramTaskLog {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  userProgramDayId: Types.ObjectId;

  date: Date;

  meals?: {
    mealId: Types.ObjectId;
    completed: boolean;
    completedAt?: Date;
  }[];

  workouts?: {
    workoutId: Types.ObjectId;
    completed: boolean;
    completedAt?: Date;
  }[];

  habits?: {
    habitId: Types.ObjectId;
    title: string;
    value: number;
    completed: boolean;
  }[];

  weight?: number;

  waterIntake?: number;

  sleepHours?: number;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}

const UserProgramTaskLogSchema = new Schema<IUserProgramTaskLog>(
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

    userProgramDayId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgramDay",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    meals: [
      {
        mealId: {
          type: Schema.Types.ObjectId,
          required: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
        },
      },
    ],

    workouts: [
      {
        workoutId: {
          type: Schema.Types.ObjectId,
          required: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
        },
      },
    ],

    habits: [
      {
        habitId: {
          type: Schema.Types.ObjectId,
          required: true,
        },

        title: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: Number,
          default: 0,
          min: 0,
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    weight: {
      type: Number,
      min: 0,
    },

    waterIntake: {
      type: Number,
      min: 0,
      max: 20,
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

UserProgramTaskLogSchema.index(
  {
    userId: 1,
    userProgramId: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

UserProgramTaskLogSchema.index({
  userProgramId: 1,
  date: -1,
});

UserProgramTaskLogSchema.index({
  userId: 1,
  date: -1,
});

export const UserProgramTaskLogModel = model<IUserProgramTaskLog>(
  "UserProgramTaskLog",
  UserProgramTaskLogSchema,
);
