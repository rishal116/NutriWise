import cloudinary from "../configs/couldinary";
import { Readable } from "stream";

//Upload a single file (buffer) to Cloudinary using memory storage
export const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream
    ({
      folder,
      resource_type: "auto",
    },
    (error, result) => {
      if (error || !result) return reject(error || new Error("Upload failed"));
      resolve(result.secure_url);
    }
    );
    
    const readable = new Readable();
    readable.push(file.buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

//Upload multiple files (buffers) to Cloudinary
export const uploadMultipleToCloudinary = async (files: Express.Multer.File[], folder: string) => {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadToCloudinary(file, folder);
    urls.push(url);
  }
  return urls;
};

//Delete a file from Cloudinary using its publicId
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    throw err;
  }
};
