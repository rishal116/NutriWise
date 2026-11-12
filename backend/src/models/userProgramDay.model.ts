import { Schema, Types, model } from "mongoose";

import {
  PROGRAM_ACTIVITY_CATEGORIES,
  type ProgramActivityCategory,
} from "../constants/user/program/program-activity-category.constants";

import {
  ACTIVITY_VALUE_TYPES,
  type ActivityValueType,
} from "../constants/user/program/activity-value-type.constants";

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

const ActivitySchema = new Schema<IUserProgramActivity>({
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
    validate: {
      validator: Number.isInteger,
      message: "Estimated duration must be a whole number of minutes.",
    },
  },

  scheduledTime: {
    type: String,
    trim: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },

  isRequired: {
    type: Boolean,
    required: true,
    default: true,
  },

  order: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: "Activity order must be a whole number.",
    },
  },
});

const UserProgramDaySchema = new Schema<IUserProgramDay>(
  {
    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Day number must be a whole number.",
      },
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
  { userProgramId: 1, dayNumber: 1 },
  { unique: true },
);

export const UserProgramDayModel = model<IUserProgramDay>(
  "UserProgramDay",
  UserProgramDaySchema,
);
