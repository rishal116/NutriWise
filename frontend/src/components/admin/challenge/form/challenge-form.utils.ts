
import type { Area } from "react-easy-crop";

import type {
  ImageState,
  ChallengeFormState,
} from "./challenge-form.types";

import { IMAGE_CONFIG } from "./image-config";

export const createEmptyImageState = (
  existingUrl?: string,
): ImageState => ({
  file: null,
  previewUrl: null,
  existingUrl: existingUrl ?? null,
  removed: false,
});

export const createInitialFormState = (): ChallengeFormState => ({
  title: "",
  description: "",
  instructions: "",
  category: "",
  difficulty: "",
  accessType: "",
  durationDays: 0,
  goals: [],
  benefits: [],
  tags: [],
});

export const revokePreviewUrl = (url: string | null): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

export const createCroppedFile = async (
  imageSrc: string,
  crop: Area,
): Promise<File> => {
  const image = new window.Image();

  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
  });

  const canvas = document.createElement("canvas");

  canvas.width = IMAGE_CONFIG.outputWidth;
  canvas.height = IMAGE_CONFIG.outputHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas context");
  }

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to create image"));
        }
      },
      "image/jpeg",
      0.9,
    );
  });

  return new File([blob], "challenge-thumbnail.jpg", {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};
