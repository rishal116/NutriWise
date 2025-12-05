"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { nutritionistProfileService } from "@/services/nutritionist/nutritionistProfile.service";

interface FormData {
  _id: string;
  fullName: string;
  gender: string;
  phone: string;
  country: string;
  bio: string;
  languages: string; // comma-separated string for form input
}

export default function GeneralInfoPage() {
  const [previewImage, setPreviewImage] = useState("/profile-placeholder.png");
  const [formData, setFormData] = useState<FormData>({
    _id: "",
    fullName: "",
    gender: "",
    phone: "",
    country: "",
    bio: "",
    languages: "",
  });

  // 👉 Fetch profile from backend
  useEffect(() => {
    (async () => {
      try {
        const response = await nutritionistProfileService.getProfile();
        const data = response.data; // backend response: { data: {...}, success: true }

        setFormData({
          _id: data._id || "",
          fullName: data.fullName || "",
          gender: data.gender || "",
          phone: data.phone || "",
          country: data.country || "",
          bio: data.bio || "",
          languages: Array.isArray(data.languages) ? data.languages.join(", ") : "",
        });

        if (data.cv) setPreviewImage(data.cv); // use cv as profile image if available
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    })();
  }, []);

  // 👉 Form input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👉 Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Display preview immediately
    setPreviewImage(URL.createObjectURL(file));

    try {
      await nutritionistProfileService.uploadProfileImage(file);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  // 👉 Save general info
  const handleSubmit = async () => {
    try {
      // Convert languages string to array before sending to backend
      const payload = {
        ...formData,
        languages: formData.languages.split(",").map((lang) => lang.trim()),
      };

      await nutritionistProfileService.updateProfile(payload);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex gap-10 p-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">General Info</h1>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold">Profile Picture</h2>
            <p className="text-sm text-gray-500 mb-3">
              Upload a professional photo that clearly shows your face.
            </p>
            <label className="inline-block px-4 py-2 text-sm bg-emerald-600 text-white rounded cursor-pointer hover:bg-emerald-700 transition">
              Upload
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <Image
            src={previewImage}
            alt="Profile Preview"
            width={150}
            height={150}
            className="rounded-md object-cover border"
          />
        </div>

        {/* FORM FIELDS */}
        <div className="grid grid-cols-2 gap-6">
          {["fullName", "gender", "phone", "country"].map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold">
                {field === "fullName"
                  ? "Full Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                name={field}
                value={formData[field as keyof FormData]}
                onChange={handleChange}
                className="w-full border p-3 rounded mt-1"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border p-3 rounded mt-1 h-28 resize-none"
            placeholder="Tell something about yourself..."
          />
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold">Languages</label>
          <input
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            className="w-full border p-3 rounded mt-1"
            placeholder="Eg: English, Hindi"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-md font-medium transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
