"use client";
import React, { useState } from "react";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionist.service";
import { useRouter } from "next/navigation";

interface Experience {
  role: string;
  organization: string;
  years: string;
}

interface DynamicInputSectionProps {
  label: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  placeholder?: string;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder?: string;
}

export default function NutritionistDetailsPage() {
  const router = useRouter()
  const [qualifications, setQualifications] = useState<string[]>([""]);
  const [specializations, setSpecializations] = useState<string[]>([""]);
  const [experiences, setExperiences] = useState<Experience[]>([{ role: "", organization: "", years: "" }]);
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [videoCallRate, setVideoCallRate] = useState("");
  const [consultationDuration, setConsultationDuration] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // -------------------- Utility functions --------------------
  const handleAddItem = <T,>(setFunc: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
    setFunc((prev) => [...prev, item]);
  };

  const handleRemoveItem = <T,>(setFunc: React.Dispatch<React.SetStateAction<T[]>>, index: number) =>
    setFunc((prev) => prev.filter((_, i) => i !== index));

  // -------------------- Field change handlers --------------------
  const handleQualificationChange = (index: number, value: string) =>
    setQualifications((prev) => prev.map((q, i) => (i === index ? value : q)));

  const handleSpecializationChange = (index: number, value: string) =>
    setSpecializations((prev) => prev.map((s, i) => (i === index ? value : s)));

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  // -------------------- Language handlers --------------------
  const handleAddLanguage = () => {
    const lang = languageInput.trim();
    if (!lang) return;
    if (languages.includes(lang)) return; // prevent duplicates
    setLanguages([...languages, lang]);
    setLanguageInput("");
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // -------------------- File upload --------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // -------------------- Form submission --------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  setErrors({});

  const newErrors: { [key: string]: string } = {};

  // --------- Text & general validations ---------
  if (!bio.trim()) newErrors.bio = "Bio is required";
  if (!languages.length) newErrors.languages = "Please add at least one language";
  if (!videoCallRate.trim()) newErrors.videoCallRate = "Video Call Rate is required";
  if (!consultationDuration.trim()) newErrors.consultationDuration = "Consultation Duration is required";
  if (!cvFile) newErrors.cvFile = "Please upload your CV";

  if (qualifications.some((q) => !q.trim())) newErrors.qualifications = "Fill all qualifications";
  if (specializations.some((s) => !s.trim())) newErrors.specializations = "Fill all specializations";

  // --------- Numeric validations ---------
  if (Number(videoCallRate) <= 0 || isNaN(Number(videoCallRate))) {
    newErrors.videoCallRate = "Video Call Rate must be a number greater than 0";
  }

  experiences.forEach((exp, i) => {
    if (!exp.role || !exp.organization || !exp.years) {
      newErrors.experiences = "Fill all experience fields";
    } else if (Number(exp.years) <= 0 || isNaN(Number(exp.years))) {
      newErrors.experiences = `Experience years for entry ${i + 1} must be greater than 0`;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false);
    return;
  }

  // --------- Submit ---------
  try {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("User not found");

    const formData = new FormData();
    qualifications.forEach((q) => formData.append("qualification[]", q));
    specializations.forEach((s) => formData.append("specialization[]", s));
    experiences.forEach((exp, i) => {
      formData.append(`experience[${i}][role]`, exp.role);
      formData.append(`experience[${i}][organization]`, exp.organization);
      formData.append(`experience[${i}][years]`, exp.years);
    });
    languages.forEach((lang) => formData.append("languages[]", lang));
    formData.append("bio", bio);
    formData.append("videoCallRate", videoCallRate);
    formData.append("consultationDuration", consultationDuration);
    formData.append("userId", userId);
    if (cvFile) formData.append("cv", cvFile);

    const res = await nutritionistAuthService.submitDetails(formData);
    setMessage("✅ Details submitted successfully!")
    router.push("/nutritionist/dashboard")
  } catch (error) {
    console.error(error);
    setMessage("❌ Failed to submit details");
  } finally {
    setLoading(false);
  }
};

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-8 md:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-green-100">
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">
          Nutritionist Profile Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Qualifications */}
          <DynamicInputSection
            label="Qualifications"
            items={qualifications}
            onAdd={() => handleAddItem<string>(setQualifications, "")}
            onRemove={(i) => handleRemoveItem(setQualifications, i)}
            onChange={handleQualificationChange}
            placeholder="e.g. M.Sc in Clinical Nutrition"
          />
          {errors.qualifications && <p className="text-red-600 text-sm">{errors.qualifications}</p>}

          {/* Specializations */}
          <DynamicInputSection
            label="Specializations"
            items={specializations}
            onAdd={() => handleAddItem<string>(setSpecializations, "")}
            onRemove={(i) => handleRemoveItem(setSpecializations, i)}
            onChange={handleSpecializationChange}
            placeholder="e.g. Sports Nutrition, Weight Management"
          />
          {errors.specializations && <p className="text-red-600 text-sm">{errors.specializations}</p>}

          {/* Experience */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Experience</label>
            {experiences.map((exp, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => handleExperienceChange(i, "role", e.target.value)}
                  className="border rounded-xl px-3 py-2 border-green-300"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={exp.organization}
                  onChange={(e) => handleExperienceChange(i, "organization", e.target.value)}
                  className="border rounded-xl px-3 py-2 border-green-300"
                />
                <input
                  type="number"
                  placeholder="Years"
                  value={exp.years}
                  onChange={(e) => handleExperienceChange(i, "years", e.target.value)}
                  className="border rounded-xl px-3 py-2 border-green-300"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem(setExperiences, { role: "", organization: "", years: "" })}
              className="text-green-700 font-semibold"
            >
              + Add another experience
            </button>
            {errors.experiences && <p className="text-red-600 text-sm mt-1">{errors.experiences}</p>}
          </div>

          {/* Bio */}
          <TextareaField
            label="Bio"
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          {errors.bio && <p className="text-red-600 text-sm">{errors.bio}</p>}

          {/* Languages */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Languages</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter language and press Add"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                className="flex-1 border border-green-300 rounded-xl px-4 py-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <button type="button" onClick={handleAddLanguage} className="bg-green-600 text-white px-4 rounded-xl">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, i) => (
                <span key={i} className="bg-green-200 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
                  {lang}
                  <button type="button" onClick={() => handleRemoveLanguage(i)} className="font-bold text-red-600">
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {errors.languages && <p className="text-red-600 text-sm">{errors.languages}</p>}
          </div>

          {/* Video Call Rate */}
          <InputField
            label="Video Call Rate (₹ per session)"
            type="number"
            placeholder="e.g. 1000"
            value={videoCallRate}
            onChange={(e) => setVideoCallRate(e.target.value)}
          />
          {errors.videoCallRate && <p className="text-red-600 text-sm">{errors.videoCallRate}</p>}

          {/* Consultation Duration */}
          <InputField
            label="Consultation Duration"
            placeholder="e.g. 30 minutes"
            value={consultationDuration}
            onChange={(e) => setConsultationDuration(e.target.value)}
          />
          {errors.consultationDuration && <p className="text-red-600 text-sm">{errors.consultationDuration}</p>}

          {/* CV Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload CV</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border border-green-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-300"
            />
            {errors.cvFile && <p className="text-red-600 text-sm">{errors.cvFile}</p>}
            <p className="text-sm text-gray-500 mt-2">Upload your resume (PDF or DOC).</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-xl font-semibold mt-6 transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && (
            <p className={`text-center mt-4 font-medium ${message.includes("✅") ? "text-green-700" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */
const InputField: React.FC<InputFieldProps> = ({ label, placeholder, ...props }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input {...props} placeholder={placeholder} className="w-full border border-green-300 rounded-xl px-4 py-3" />
  </div>
);

const TextareaField: React.FC<TextareaFieldProps> = ({ label, placeholder, ...props }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <textarea {...props} placeholder={placeholder} className="w-full border border-green-300 rounded-xl px-4 py-3 h-28" />
  </div>
);

const DynamicInputSection: React.FC<DynamicInputSectionProps> = ({ label, items, onAdd, onRemove, onChange, placeholder }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    {items.map((item, i) => (
      <div key={i} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder={placeholder}
          value={item}
          onChange={(e) => onChange(i, e.target.value)}
          className="flex-1 border border-green-300 rounded-xl px-4 py-3"
        />
        {items.length > 1 && (
          <button type="button" onClick={() => onRemove(i)} className="bg-red-500 text-white rounded-xl px-3">
            ✕
          </button>
        )}
      </div>
    ))}
    <button type="button" onClick={onAdd} className="text-green-700 font-semibold">
      + Add another {label.toLowerCase()}
    </button>
  </div>
);
