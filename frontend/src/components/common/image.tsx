"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Loader2, Upload } from "lucide-react";
import { userAccountService } from "@/services/user/userProfile.service";

interface ProfileImageUploaderProps {
  onClose: () => void;
  onUploadSuccess: (newImageUrl: string) => void;
}

export default function ProfileImageUploader({ onClose, onUploadSuccess }: ProfileImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

const handleUpload = async () => {
  if (!imageSrc || !croppedAreaPixels) return;

  setIsUploading(true);
  try {
    // 1. Create Canvas and Crop (Keep your existing canvas logic...)
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

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
        0, 0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
    }

    // 2. Convert to Blob
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
    );

    if (blob) {
      // 3. CREATE A RAW FILE (Do NOT create FormData here)
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      // 4. CALL SERVICE WITH FILE
      // This fixes: Argument of type 'FormData' is not assignable to parameter of type 'File'
      const response = await userAccountService.uploadProfileImage(file);

      // Handle response based on your backend structure
      const newImageUrl = response.data?.profileImage || response.profileImage;
      onUploadSuccess(newImageUrl);
      onClose();
    }
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Failed to upload image.");
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-emerald-50">
          <h3 className="font-bold text-emerald-900">Update Profile Picture</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!imageSrc ? (
            <div className="border-2 border-dashed border-emerald-200 rounded-xl p-12 text-center">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Upload size={30} />
                </div>
                <span className="text-gray-700 font-medium">Click to upload or drag and drop</span>
                <span className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</span>
              </label>
            </div>
          ) : (
            <>
              <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
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
                  <span className="text-sm text-gray-500">Zoom</span>
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
                    className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Replace
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-[2] py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : "Save Profile Picture"}
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