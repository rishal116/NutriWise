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
