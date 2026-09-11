import { Schema, model, Types } from "mongoose";

export const CHALLENGE_ACTIVITY_TYPES = [
  "exercise",
  "nutrition",
  "hydration",
  "meditation",
  "breathing",
  "sleep",
  "habit",
  "education",
  "stretching",
  "recovery",
  "measurement",
  "custom",
] as const;

export type ChallengeActivityType = (typeof CHALLENGE_ACTIVITY_TYPES)[number];

export const CHALLENGE_ACTIVITY_VALUE_TYPES = [
  "boolean",
  "number",
  "duration",
] as const;

export type ChallengeActivityValueType =
  (typeof CHALLENGE_ACTIVITY_VALUE_TYPES)[number];

export interface IChallengeActivity {
  _id: Types.ObjectId;

  type: ChallengeActivityType;

  title: string;

  description?: string;

  instructions?: string;

  valueType: ChallengeActivityValueType;

  targetValue?: number;

  unit?: string;

  estimatedDurationMinutes?: number;

  imageUrl?: string;

  imagePublicId?: string;

  videoUrl?: string;

  videoPublicId?: string;

  isRequired: boolean;

  order: number;

  configuration?: Record<string, unknown>;
}

export interface IChallengeDay {
  _id: Types.ObjectId;

  challengeId: Types.ObjectId;

  dayNumber: number;

  title?: string;

  description?: string;

  activities: IChallengeActivity[];

  createdAt: Date;

  updatedAt: Date;
}

const ChallengeActivitySchema = new Schema<IChallengeActivity>(
  {
    type: {
      type: String,
      enum: CHALLENGE_ACTIVITY_TYPES,
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
      enum: CHALLENGE_ACTIVITY_VALUE_TYPES,
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

    imageUrl: {
      type: String,
      trim: true,
    },

    imagePublicId: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    videoPublicId: {
      type: String,
      trim: true,
    },

    isRequired: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      min: 0,
      default: 0,
    },

    configuration: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: true,
    versionKey: false,
  },
);

const ChallengeDaySchema = new Schema<IChallengeDay>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    activities: {
      type: [ChallengeActivitySchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ChallengeDaySchema.index(
  {
    challengeId: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  },
);

export const ChallengeDayModel = model<IChallengeDay>(
  "ChallengeDay",
  ChallengeDaySchema,
);
