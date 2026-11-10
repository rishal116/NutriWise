import type { IChallengeActivity } from "../../../models/challengeDay.model";

export interface ChallengeDayUploadedFiles {
  activityImages?: Express.Multer.File[];
  activityVideos?: Express.Multer.File[];
}

export interface ActivityMediaIndex {
  index: number;
  hasImage: boolean;
  hasVideo: boolean;
}

export interface ActivityMediaFiles {
  image?: Express.Multer.File;
  video?: Express.Multer.File;
}

export interface UploadedMedia {
  publicId: string;
  resourceType: "image" | "video";
}

export type ExistingActivityMedia = Pick<
  IChallengeActivity,
  "_id" | "imageUrl" | "imagePublicId" | "videoUrl" | "videoPublicId"
>;

export interface UploadedActivityMedia {
  imageUrl?: string;
  imagePublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
}

export interface BuildActivitiesResult {
  activities: IChallengeActivity[];
  newlyUploadedMedia: UploadedMedia[];
}
