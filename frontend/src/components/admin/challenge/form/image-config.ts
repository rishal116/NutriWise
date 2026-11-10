import type { ImageConfig } from "./challenge-form.types";

export const IMAGE_CONFIG: ImageConfig = {
  label: "Thumbnail",
  description: "Square image for challenge listing cards.",
  aspectRatio: 1,
  aspectLabel: "1:1 square",
  outputWidth: 600,
  outputHeight: 600,
  accept: "image/jpeg,image/png,image/webp",
  maxFileSizeMB: 5,
};