
import type { Area } from "react-easy-crop";

export async function getCroppedImage(
  imageSrc: string,
  cropArea: Area,
): Promise<File> {
  const image = new window.Image();

  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image."));
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to process the image.");
  }

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to crop image."));
        }
      },
      "image/jpeg",
      0.9,
    );
  });

  return new File([blob], `session-thumbnail-${Date.now()}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
