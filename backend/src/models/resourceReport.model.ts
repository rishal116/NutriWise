import { Document, model, Schema, Types } from "mongoose";

export const RESOURCE_REPORT_REASONS = [
  "inaccurate_information",
  "misleading_content",
  "inappropriate_content",
  "spam",
  "copyright_violation",
  "other",
] as const;

export type ResourceReportReason = (typeof RESOURCE_REPORT_REASONS)[number];

export const RESOURCE_REPORT_STATUSES = [
  "pending",
  "reviewed",
  "resolved",
  "dismissed",
] as const;

export type ResourceReportStatus = (typeof RESOURCE_REPORT_STATUSES)[number];

export interface IResourceReport extends Document {
  resourceId: Types.ObjectId;
  reportedBy: Types.ObjectId;

  reason: ResourceReportReason;
  description?: string;

  status: ResourceReportStatus;

  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;

  resolutionNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

const resourceReportSchema = new Schema<IResourceReport>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },

    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: RESOURCE_REPORT_REASONS,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: RESOURCE_REPORT_STATUSES,
      default: "pending",
      required: true,
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },

    reviewedAt: {
      type: Date,
    },

    resolutionNote: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

resourceReportSchema.index({
  resourceId: 1,
  status: 1,
  createdAt: -1,
});

resourceReportSchema.index({
  reportedBy: 1,
  createdAt: -1,
});

export const ResourceReportModel = model<IResourceReport>(
  "ResourceReport",
  resourceReportSchema,
);
