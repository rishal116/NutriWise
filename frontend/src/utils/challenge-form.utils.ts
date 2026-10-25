import { z } from "zod";

import type { CreateChallengeDTO } from "@/dtos/admin/challenge/create-challenge.dto";

export type ChallengeFormState = CreateChallengeDTO & {
  thumbnailUrl?: string;
};

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  existingUrl?: string;
  removed: boolean;
}

export interface CropTarget {
  file: File;
}

export const IMAGE_CONFIG = {
  aspectRatio: 2 / 3,
  aspectLabel: "2:3 portrait",
  outputWidth: 600,
  outputHeight: 900,
  accept: "image/jpeg,image/png,image/webp",
  maxFileSizeMB: 5,
} as const;

export const imageFileSchema = z
  .instanceof(File, { message: "Please select a valid image file." })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    { message: "Only JPG, PNG, and WebP images are supported." },
  )
  .refine((file) => file.size <= IMAGE_CONFIG.maxFileSizeMB * 1024 * 1024, {
    message: `Image size must be ${IMAGE_CONFIG.maxFileSizeMB} MB or smaller.`,
  });

export const defaultFormState: ChallengeFormState = {
  title: "",
  description: "",
  instructions: "",
  thumbnailUrl: "",
  category: "nutrition",
  difficulty: "beginner",
  accessType: "free",
  durationDays: 7,
};

export const selectClassName =
  "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M4%206l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.9rem_center] bg-no-repeat px-3.5 pr-9 text-sm capitalize text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export const textareaClassName =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export const emptyImageState = (existingUrl?: string): ImageState => ({
  file: null,
  previewUrl: null,
  existingUrl,
  removed: false,
});

const createImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = src;
  });

export const createCroppedFile = async (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");

  canvas.width = IMAGE_CONFIG.outputWidth;
  canvas.height = IMAGE_CONFIG.outputHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create the image processing canvas.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    IMAGE_CONFIG.outputWidth,
    IMAGE_CONFIG.outputHeight,
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.9);
  });

  if (!blob) {
    throw new Error("Unable to process the selected image.");
  }

  return new File([blob], `challenge-${Date.now()}.jpg`, {
    type: "image/jpeg",
  });
};