import { Readable } from "stream";

import cloudinary from "../configs/couldinary";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
}

export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType:
            result.resource_type === "video"
              ? "video"
              : result.resource_type === "raw"
                ? "raw"
                : "image",
        });
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string,
): Promise<CloudinaryUploadResult[]> => {
  return Promise.all(files.map((file) => uploadToCloudinary(file, folder)));
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<void> => {
  if (!publicId.trim()) {
    throw new Error("Cloudinary public ID is required");
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
