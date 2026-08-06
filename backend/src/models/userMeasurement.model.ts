import { Schema, model, Types } from "mongoose";

export enum UserMeasurementType {
  WEIGHT = "weight",
  BODY_FAT = "body_fat",
  MUSCLE_MASS = "muscle_mass",
  CHEST = "chest",
  WAIST = "waist",
  HIP = "hip",
  LEFT_ARM = "left_arm",
  RIGHT_ARM = "right_arm",
  LEFT_THIGH = "left_thigh",
  RIGHT_THIGH = "right_thigh",
  WATER_INTAKE = "water_intake",
  BLOOD_PRESSURE = "blood_pressure",
  BLOOD_SUGAR = "blood_sugar",
  HEART_RATE = "heart_rate",
  CUSTOM = "custom",
}

export enum MeasurementUnit {
  KG = "kg",
  CM = "cm",
  PERCENT = "percent",
  ML = "ml",
  BPM = "bpm",
  MMHG = "mmHg",
  MG_DL = "mg/dL",
  COUNT = "count",
  CUSTOM = "custom",
}

export enum MeasurementSource {
  MANUAL = "manual",
  DEVICE = "device",
  IMPORTED = "imported",
  SYSTEM = "system",
}

export enum MeasurementRecordedBy {
  USER = "user",
  NUTRITIONIST = "nutritionist",
  SYSTEM = "system",
}

export interface IUserMeasurement {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId?: Types.ObjectId;
  type: UserMeasurementType;
  customName?: string;
  value: number;
  unit: MeasurementUnit;
  source: MeasurementSource;
  recordedBy: MeasurementRecordedBy;
  date: Date;
  notes?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserMeasurementSchema = new Schema<IUserMeasurement>(
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
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(UserMeasurementType),
      required: true,
      index: true,
    },

    customName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      enum: Object.values(MeasurementUnit),
      required: true,
    },

    source: {
      type: String,
      enum: Object.values(MeasurementSource),
      default: MeasurementSource.MANUAL,
    },

    recordedBy: {
      type: String,
      enum: Object.values(MeasurementRecordedBy),
      default: MeasurementRecordedBy.USER,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    attachments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

UserMeasurementSchema.index({
  userId: 1,
  type: 1,
  date: -1,
});
UserMeasurementSchema.index({
  userProgramId: 1,
  type: 1,
  date: -1,
});
UserMeasurementSchema.index({
  userId: 1,
  date: -1,
});

export const UserMeasurementModel = model<IUserMeasurement>(
  "UserMeasurement",
  UserMeasurementSchema,
);
