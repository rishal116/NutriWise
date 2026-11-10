
import type { Area } from "react-easy-crop";

import type { ActivityFormValue } from "../challenge-day-form.types";

export const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const VIDEO_MAX_SIZE = 50 * 1024 * 1024;
export const MAX_VIDEO_DURATION_SECONDS = 120;

export const IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const VIDEO_ACCEPTED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const IMAGE_ASPECT = 16 / 9;

export function createEmptyActivity(): ActivityFormValue {
  return {
    type: "",
    title: "",
    description: "",
    instructions: "",
    valueType: "",
    targetValue: undefined,
    maxValue: undefined,
    unit: "",
    estimatedDurationMinutes: undefined,
    isRequired: true,
    imageFile: null,
    videoFile: null,
    existingImageUrl: undefined,
    existingVideoUrl: undefined,
    removeImage: false,
    removeVideo: false,
  };
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read video metadata."));
    };

    video.src = url;
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = url;
  });
}

export async function getCroppedImageFile(
  imageSrc: string,
  crop: Area,
  fileName: string,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create image canvas.");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.9);
  });

  if (!blob) {
    throw new Error("Unable to create cropped image.");
  }

  const outputFileName = fileName.replace(/\.[^/.]+$/, ".webp");

  return new File([blob], outputFileName, {
    type: "image/webp",
  });
}
