import { injectable } from "inversify";
import type { ICloudinaryService } from "../../interfaces/common/ICloudinaryService";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  type CloudinaryUploadResult,
} from "../../../utils/cloudinaryUploads.util";

@injectable()
export class CloudinaryService implements ICloudinaryService {
  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    return uploadToCloudinary(file, folder);
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<CloudinaryUploadResult[]> {
    return uploadMultipleToCloudinary(files, folder);
  }

  async delete(
    publicId: string,
    resourceType: CloudinaryUploadResult["resourceType"] = "image",
  ): Promise<void> {
    await deleteFromCloudinary(publicId, resourceType);
  }
}
