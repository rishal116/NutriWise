import cloudinary from "../configs/couldinary";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
}

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
): Promise<CloudinaryUploadResult> => {
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    {
      folder,
      resource_type: "auto",
    },
  );

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    resourceType:
      result.resource_type === "video"
        ? "video"
        : result.resource_type === "raw"
          ? "raw"
          : "image",
  };
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string,
): Promise<CloudinaryUploadResult[]> => {
  return Promise.all(
    files.map((file) => uploadToCloudinary(file, folder)),
  );
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