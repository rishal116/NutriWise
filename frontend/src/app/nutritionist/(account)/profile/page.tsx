"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { nutritionistProfileService } from "@/services/nutritionist/nutritionistProfile.service";
import { COUNTRIES, LANGUAGE_OPTIONS, GENDERS } from "@/constants/nutritionistDetails.constants";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";


/* ---------------- Types ---------------- */
interface FormData {
  _id: string;
  fullName: string;
  gender: string;
  phone: string;
  country: string;
  bio: string;
  languages: string[];
}

interface CropArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

/* ---------------- Helper ---------------- */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image(); // <-- use window.Image to access browser Image
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
  
export default function GeneralInfoPage() {
  const [previewImage, setPreviewImage] = useState("/images/images.jpg");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    _id: "",
    fullName: "",
    gender: "",
    phone: "",
    country: "",
    bio: "",
    languages: [],
  });
  const [initialData, setInitialData] = useState<FormData | null>(null);

  /* ---------------- Load Profile ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await nutritionistProfileService.getProfile();
        const data = res.data;
        const profileData: FormData = {
          _id: data._id || "",
          fullName: data.fullName || "",
          gender: data.gender || "",
          phone: data.phone || "",
          country: data.country || "",
          bio: data.bio || "",
          languages: Array.isArray(data.languages) ? data.languages : [],
        };
        setFormData(profileData);
        setInitialData(profileData);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    })();
  }, []);

  useEffect(() => {
  (async () => {
    try {
      const res = await nutritionistProfileService.getProfileImage();
      console.log(res);
      
      setPreviewImage(res.data.profileImage);
    } catch (err) {
      console.log(err);
      
      setPreviewImage("/profile-placeholder.png");
    }
  })();
}, []);

  /* ---------------- Form Validation ---------------- */
const phoneNumberObj = parsePhoneNumberFromString(formData.phone, "IN");
const errors = {
  fullName: !formData.fullName.trim(),
  phone: !formData.phone.trim() || !(phoneNumberObj?.isValid() ?? false),
  country: !formData.country.trim(),
  languages: formData.languages.length === 0,
  bio: !formData.bio.trim(),
};

  const isFormChanged = () => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  /* ---------------- Crop Handlers ---------------- */
  const onCropComplete = useCallback((_: any, croppedArea: CropArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setCropModalOpen(true);
  };

  const getCroppedImage = async (): Promise<Blob | null> => {
    if (!selectedFile || !croppedAreaPixels) return null;

    const image = await createImage(URL.createObjectURL(selectedFile));
    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  };

  const handleUploadCroppedImage = async () => {
    try {
      const blob = await getCroppedImage();
      if (!blob) return;

      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      await nutritionistProfileService.uploadProfileImage(file);

      setCropModalOpen(false);
      setPreviewImage(URL.createObjectURL(file));
      alert("Profile image uploaded successfully");
    } catch (err) {
      console.log("error: ",err)
      
      alert("Upload failed");
    }
  };

  /* ---------------- Submit Form ---------------- */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await nutritionistProfileService.updateProfile(formData);
      setInitialData(formData);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("5",err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          General Information
        </h1>
        <p className="mt-2 text-slate-500">
          Set up your public profile to build trust with potential clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Image */}
        <div className="lg:col-span-4 mb-6 flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-slate-50">
            <Image src={previewImage} alt="Profile" fill unoptimized
            className="object-cover"/>
          </div>
          <label className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-xl">
            Upload Image
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </label>
        </div>

        {/* Crop Modal */}
        {cropModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="relative w-[90%] max-w-xl h-[400px] bg-white rounded-2xl p-4">
              <Cropper
                image={previewImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <div className="absolute bottom-4 left-4 flex gap-4">
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadCroppedImage}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="h-6 w-1 bg-emerald-500 rounded-full" />
              Basic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="e.g. Dr. Jane Smith"
              />
<PhoneField
  value={formData.phone}
  onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
  error={errors.phone}
  errorMessage="Please enter a valid phone number"
/>
              <Select
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                options={COUNTRIES}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={GENDERS}
              />
            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700">Languages Spoken</label>
              {errors.languages && (
                <span className="text-xs font-medium text-rose-500">Selection required</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => {
                const isSelected = formData.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 ring-2 ring-emerald-600"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-300 hover:bg-white"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700">Professional Bio</label>
              <span
                className={`text-xs ${
                  formData.bio.length > 450 ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {formData.bio.length}/500
              </span>
            </div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              placeholder="Tell your clients about your expertise and approach..."
              className={`w-full min-h-[140px] rounded-2xl p-4 text-slate-700 border transition-all focus:ring-4 focus:ring-emerald-50 outline-none ${
                errors.bio ? "border-rose-200 bg-rose-50/30" : "border-slate-200 focus:border-emerald-500"
              }`}
            />
          </section>

          <div className="pt-4 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400 italic">
              * Required fields to publish your profile.
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormChanged()}
              className="px-8 py-3.5 rounded-2xl font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      <input
        {...props}
        className={`w-full rounded-2xl p-3.5 border text-slate-700 transition-all focus:ring-4 focus:ring-emerald-50 outline-none ${
          error ? "border-rose-200 bg-rose-50/50" : "border-slate-200 focus:border-emerald-500"
        }`}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: boolean;
}

function Select({ label, options, error, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
      <select
        {...props}
        className={`w-full rounded-2xl p-3.5 border bg-white text-slate-700 transition-all focus:ring-4 focus:ring-emerald-50 outline-none appearance-none ${
          error ? "border-rose-200 bg-rose-50/50" : "border-slate-200 focus:border-emerald-500"
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}


function PhoneField({
  value,
  onChange,
  error,
  errorMessage,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-slate-700 ml-1">
        Phone Number
      </label>

      <PhoneInput
        international
        defaultCountry="IN"
        value={value}
        onChange={(val) => onChange(val || "")}
        className={`w-full rounded-2xl border p-3 transition-all ${
          error ? "border-rose-200 bg-rose-50/50" : "border-slate-200"
        }`}
      />

      {error && errorMessage && (
        <p className="text-xs text-rose-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}