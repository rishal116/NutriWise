"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { X, Loader2, Upload } from "lucide-react";

interface ProfileImageUploaderProps {
  onClose: () => void;
  onUploadSuccess: (newImageUrl: string) => void;
  uploadImage: (file: File) => Promise<{ profileImage: string }>;
}

export default function ProfileImageUploader({
  onClose,
  onUploadSuccess,
  uploadImage,
}: ProfileImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    setError(null);
    try {
      const image = new window.Image();
      image.src = imageSrc;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
      );

      if (blob) {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        const response = await uploadImage(file);
        onUploadSuccess(response.profileImage);
        onClose();
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
          <h3 className="font-bold text-emerald-900">Update Profile Picture</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <p className="mb-4 text-sm font-semibold text-red-500">{error}</p>
          )}

          {!imageSrc ? (
            <div className="border-2 border-dashed border-emerald-200 rounded-xl p-12 text-center">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Upload size={30} />
                </div>
                <span className="text-slate-700 font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-slate-400 text-sm mt-1">
                  PNG, JPG up to 5MB
                </span>
              </label>
            </div>
          ) : (
            <>
              <div className="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setImageSrc(null)}
                    disabled={isUploading}
                    className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Replace
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-[2] py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70"
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Save Profile Picture"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}