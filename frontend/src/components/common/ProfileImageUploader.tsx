"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

interface ProfileImageUploaderProps {
  onCropped: (file: File) => void; // callback to send cropped file
}

export default function ProfileImageUploader({ onCropped }: ProfileImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCroppedImage(null); // reset previous crop
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const createImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });

    const getCroppedImg = async (imageSrc: string, crop: any) => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise<string>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
          onCropped(file); // send cropped file to parent
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, "image/jpeg");
      });
    };

    const croppedUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedImage(croppedUrl);
  }, [imageSrc, croppedAreaPixels, onCropped]);

  const handleReEdit = () => setCroppedImage(null);

  return (
    <div className="w-full max-w-md mx-auto">
      {!imageSrc && (
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      )}

      {imageSrc && !croppedImage && (
        <div className="relative w-full h-64 bg-gray-200 mb-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={showCroppedImage}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Crop
          </button>
        </div>
      )}

      {croppedImage && (
        <div className="mt-4 text-center">
          <h2 className="font-semibold mb-2">Preview</h2>
          <img
            src={croppedImage}
            alt="Cropped"
            className="w-32 h-32 rounded-full mx-auto object-cover mb-2"
          />
          <button
            onClick={handleReEdit}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
          >
            Re-edit
          </button>
        </div>
      )}
    </div>
  );
}
