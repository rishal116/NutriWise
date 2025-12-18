"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { nutritionistProfileService } from "@/services/nutritionist/nutritionistProfile.service";

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

/* ---------------- Constants ---------------- */
const GENDERS = ["Male", "Female", "Other"];

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Netherlands",
  "Canada",
  "Australia",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Telugu",
  "Spanish",
  "French",
  "German",
];

/* ---------------- Page ---------------- */
export default function GeneralInfoPage() {
  const [previewImage, setPreviewImage] = useState("/profile-placeholder.png");
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

  /* ---------------- Fetch Profile ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await nutritionistProfileService.getProfile();
        const data = res.data;

        const profileData = {
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

        if (data.profileImage) setPreviewImage(data.profileImage);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    })();
  }, []);

  /* ---------------- Validation ---------------- */
  const errors = {
    fullName: !formData.fullName.trim(),
    phone: !formData.phone.trim(),
    country: !formData.country.trim(),
    languages: formData.languages.length === 0,
    bio: !formData.bio.trim(),
  };

  /* ---------------- Detect Form Changes ---------------- */
  const isFormChanged = () => {
    if (!initialData) return false;

    return (
      formData.fullName !== initialData.fullName ||
      formData.phone !== initialData.phone ||
      formData.gender !== initialData.gender ||
      formData.country !== initialData.country ||
      formData.bio !== initialData.bio ||
      formData.languages.join(",") !== initialData.languages.join(",")
    );
  };

  /* ---------------- Handlers ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    try {
      await nutritionistProfileService.uploadProfileImage(file);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await nutritionistProfileService.updateProfile(formData);
      alert("Profile updated successfully");
      setInitialData(formData); // reset initialData to prevent multiple save clicks
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          General Information
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          This information is visible to clients before purchasing a plan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CARD */}
        <div className="bg-white rounded-2xl border p-6 space-y-5">
          <div className="flex flex-col items-center text-center">
            <Image
              src={previewImage}
              alt="Profile"
              width={140}
              height={140}
              className="rounded-xl object-cover border"
            />
            <label className="mt-4 text-sm font-medium text-emerald-600 cursor-pointer">
              Change Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Available for Clients
            </span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            {/* Country */}
            <div>
              <label className="text-sm font-semibold">
                Country {errors.country && <span className="text-rose-500">*</span>}
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border p-3 bg-white
                  ${errors.country ? "border-rose-500" : "border-gray-200"}
                `}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-semibold">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border p-3 bg-white border-gray-200"
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="text-sm font-semibold">
              Languages {errors.languages && <span className="text-rose-500">*</span>}
            </label>

            <div className="mt-2 flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const selected = formData.languages.includes(lang);

                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition
                      ${
                        selected
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-50"
                      }
                    `}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            {errors.languages && (
              <p className="text-xs text-rose-500 mt-1">
                Select at least one language
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold">
              About You {errors.bio && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              className={`mt-1 w-full rounded-lg p-3 h-32 resize-none border
                ${errors.bio ? "border-rose-500" : "border-gray-200"}
              `}
              placeholder="Write a short professional bio"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormChanged()}
              className="px-6 py-3 rounded-xl font-semibold text-white transition
                bg-emerald-600 hover:bg-emerald-700
                disabled:bg-gray-300 disabled:cursor-not-allowed
              "
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable Input ---------------- */
function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
        {error && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`mt-1 w-full rounded-lg p-3 border transition
          ${error ? "border-rose-500" : "border-gray-200"}
        `}
      />
      {error && (
        <p className="text-xs text-rose-500 mt-1">
          Please add {label.toLowerCase()}
        </p>
      )}
    </div>
  );
}
