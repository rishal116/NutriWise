import { Schema, model, Types } from "mongoose";

export const PROGRAM_ACTIVITY_CATEGORIES = [
  "meal",
  "exercise",
  "habit",
  "water",
  "supplement",
  "meditation",
  "sleep",
  "reading",
  "appointment",
  "measurement",
  "task",
  "custom",
] as const;
export type ProgramActivityCategory =
  (typeof PROGRAM_ACTIVITY_CATEGORIES)[number];

export const ACTIVITY_VALUE_TYPES = [
  "boolean",
  "number",
  "duration",
  "photo",
  "text",
] as const;
export type ActivityValueType = (typeof ACTIVITY_VALUE_TYPES)[number];

export interface IUserProgramActivity {
  _id: Types.ObjectId;
  category: ProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;
  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;
  isRequired: boolean;
  configuration?: Record<string, unknown>;
  order: number;
}

export interface IUserProgramDay {
  _id: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  activities: IUserProgramActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IUserProgramActivity>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },

    category: {
      type: String,
      enum: PROGRAM_ACTIVITY_CATEGORIES,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    instructions: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    valueType: {
      type: String,
      enum: ACTIVITY_VALUE_TYPES,
      required: true,
    },

    targetValue: {
      type: Number,
      min: 0,
    },

    unit: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    estimatedDurationMinutes: {
      type: Number,
      min: 0,
    },

    scheduledTime: {
      type: String,
      trim: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    isRequired: {
      type: Boolean,
      default: true,
    },

    configuration: {
      type: Schema.Types.Mixed,
      default: {},
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const UserProgramDaySchema = new Schema<IUserProgramDay>(
  {
    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
      index: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    activities: {
      type: [ActivitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

UserProgramDaySchema.index(
  {
    userProgramId: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  },
);

export const UserProgramDayModel = model<IUserProgramDay>(
  "UserProgramDay",
  UserProgramDaySchema,
);
