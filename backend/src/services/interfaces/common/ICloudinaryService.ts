import type { CloudinaryUploadResult } from "../../../utils/cloudinaryUploads.util";

export interface ICloudinaryService {
  upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryUploadResult>;

  uploadMultiple(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<CloudinaryUploadResult[]>;

  delete(
    publicId: string,
    resourceType?: CloudinaryUploadResult["resourceType"],
  ): Promise<void>;
}
