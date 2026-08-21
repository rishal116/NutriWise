import { Document, model, Schema, Types } from "mongoose";

export const RESOURCE_COLLECTION_VISIBILITIES = ["public", "private"] as const;

export type ResourceCollectionVisibility =
  (typeof RESOURCE_COLLECTION_VISIBILITIES)[number];

export interface IResourceCollection extends Document {
  name: string;
  description?: string;

  coverImageUrl?: string;

  createdBy: Types.ObjectId;

  resourceIds: Types.ObjectId[];

  visibility: ResourceCollectionVisibility;

  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const resourceCollectionSchema = new Schema<IResourceCollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    coverImageUrl: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resourceIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Resource",
        },
      ],
      default: [],
    },

    visibility: {
      type: String,
      enum: RESOURCE_COLLECTION_VISIBILITIES,
      default: "public",
      required: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

resourceCollectionSchema.index({
  createdBy: 1,
  createdAt: -1,
});

resourceCollectionSchema.index({
  visibility: 1,
  isFeatured: 1,
  createdAt: -1,
});

export const ResourceCollectionModel = model<IResourceCollection>(
  "ResourceCollection",
  resourceCollectionSchema,
);
