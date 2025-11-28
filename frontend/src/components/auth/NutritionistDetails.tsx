"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionist.service";

interface Experience {
  role: string;
  organization: string;
  years: string;
}

// India-only states and cities
const statesAndCities: { [state: string]: string[] } = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Karnataka": ["Bengaluru", "Mysore", "Mangalore"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Delhi": ["New Delhi"],
  "West Bengal": ["Kolkata", "Darjeeling"],
  // Add more states & cities as needed
};

export default function NutritionistDetailsPage() {
  const router = useRouter();

  // Form states
  const [qualifications, setQualifications] = useState([""] as string[]);
  const [specializations, setSpecializations] = useState([""] as string[]);
  const [experiences, setExperiences] = useState<Experience[]>([{ role: "", organization: "", years: "" }]);
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [videoCallRate, setVideoCallRate] = useState("");
  const [consultationDuration, setConsultationDuration] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [state, setState] = useState(Object.keys(statesAndCities)[0]);
  const [city, setCity] = useState(statesAndCities[state][0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helpers
  const handleAddItem = (setFunc: React.Dispatch<React.SetStateAction<string[]>>, item: string) =>
    setFunc(prev => [...prev, item]);
  const handleRemoveItem = (setFunc: React.Dispatch<React.SetStateAction<string[]>>, index: number) =>
    setFunc(prev => prev.filter((_, i) => i !== index));
  const handleAddExperience = (setFunc: React.Dispatch<React.SetStateAction<Experience[]>>, item: Experience) =>
    setFunc(prev => [...prev, item]);
  const handleQualificationChange = (i: number, val: string) => setQualifications(prev => prev.map((q, idx) => idx === i ? val : q));
  const handleSpecializationChange = (i: number, val: string) => setSpecializations(prev => prev.map((s, idx) => idx === i ? val : s));
  const handleExperienceChange = (i: number, field: keyof Experience, val: string) =>
    setExperiences(prev => prev.map((exp, idx) => idx === i ? { ...exp, [field]: val } : exp));
  const handleAddLanguage = () => {
    const lang = languageInput.trim();
    if (!lang || languages.includes(lang)) return;
    setLanguages([...languages, lang]);
    setLanguageInput("");
  };
  const handleRemoveLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));

  // File handlers
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCvFile(e.target.files[0]);
  };
  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setCertFiles([...certFiles, ...Array.from(e.target.files)]);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!bio.trim()) newErrors.bio = "Bio is required";
    if (!languages.length) newErrors.languages = "Add at least one language";
    if (!videoCallRate.trim()) newErrors.videoCallRate = "Video Call Rate is required";
    if (!consultationDuration.trim()) newErrors.consultationDuration = "Consultation Duration is required";
    if (!cvFile) newErrors.cvFile = "Upload CV";
    if (!city.trim()) newErrors.city = "City is required";
    if (qualifications.some(q => !q.trim())) newErrors.qualifications = "Fill all qualifications";
    if (specializations.some(s => !s.trim())) newErrors.specializations = "Fill all specializations";
    experiences.forEach((exp, i) => {
      if (!exp.role || !exp.organization || !exp.years) newErrors.experiences = "Fill all experience fields";
      else if (Number(exp.years) <= 0 || isNaN(Number(exp.years))) newErrors.experiences = `Experience years for entry ${i + 1} must be > 0`;
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("token");
      if (!userId) throw new Error("User not found");

      const formData = new FormData();
      formData.append("userId", userId);
      qualifications.forEach(q => formData.append("qualification[]", q));
      specializations.forEach(s => formData.append("specialization[]", s));
      experiences.forEach((exp, i) => {
        formData.append(`experience[${i}][role]`, exp.role);
        formData.append(`experience[${i}][organization]`, exp.organization);
        formData.append(`experience[${i}][years]`, exp.years);
      });
      languages.forEach(lang => formData.append("languages[]", lang));
      formData.append("bio", bio);
      formData.append("videoCallRate", videoCallRate);
      formData.append("consultationDuration", consultationDuration);
      formData.append("state", state);
      formData.append("city", city);
      if (cvFile) formData.append("cv", cvFile);
      certFiles.forEach(f => formData.append("certifications[]", f));

      await nutritionistAuthService.submitDetails(formData);
      setMessage("✅ Details submitted successfully!");
      router.push("/nutritionist/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-8 md:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-green-100">
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">Nutritionist Profile Details</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Qualifications */}
          <DynamicInputSection
            label="Qualifications"
            items={qualifications}
            onAdd={() => handleAddItem(setQualifications, "")}
            onRemove={(i) => handleRemoveItem(setQualifications, i)}
            onChange={handleQualificationChange}
            placeholder="M.Sc in Nutrition"
          />
          {errors.qualifications && <p className="text-red-600">{errors.qualifications}</p>}

          {/* Specializations */}
          <DynamicInputSection
            label="Specializations"
            items={specializations}
            onAdd={() => handleAddItem(setSpecializations, "")}
            onRemove={(i) => handleRemoveItem(setSpecializations, i)}
            onChange={handleSpecializationChange}
            placeholder="Sports Nutrition"
          />
          {errors.specializations && <p className="text-red-600">{errors.specializations}</p>}

          {/* Experiences */}
          <div>
            <label className="block font-semibold mb-2">Experience</label>
            {experiences.map((exp, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 mb-3">
                <input type="text" placeholder="Role" value={exp.role} onChange={(e) => handleExperienceChange(i, "role", e.target.value)} className="border rounded-xl px-3 py-2 border-green-300" />
                <input type="text" placeholder="Organization" value={exp.organization} onChange={(e) => handleExperienceChange(i, "organization", e.target.value)} className="border rounded-xl px-3 py-2 border-green-300" />
                <input type="number" placeholder="Years" value={exp.years} onChange={(e) => handleExperienceChange(i, "years", e.target.value)} className="border rounded-xl px-3 py-2 border-green-300" />
              </div>
            ))}
            <button type="button" onClick={() => handleAddExperience(setExperiences, { role: "", organization: "", years: "" })} className="text-green-700 font-semibold">+ Add another experience</button>
            {errors.experiences && <p className="text-red-600">{errors.experiences}</p>}
          </div>

          {/* Bio */}
          <TextareaField label="Bio" placeholder="Write a short bio..." value={bio} onChange={(e) => setBio(e.target.value)} />
          {errors.bio && <p className="text-red-600">{errors.bio}</p>}

          {/* Languages */}
          <LanguageInputSection
            languages={languages}
            languageInput={languageInput}
            setLanguageInput={setLanguageInput}
            handleAddLanguage={handleAddLanguage}
            handleRemoveLanguage={handleRemoveLanguage}
            errors={errors}
          />

          {/* Location: India-only dropdown */}
          <div>
            <label className="block font-semibold mb-2">State</label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity(statesAndCities[e.target.value][0]);
              }}
              className="w-full border px-4 py-2 rounded-xl mb-4"
            >
              {Object.keys(statesAndCities).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <label className="block font-semibold mb-2">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl"
            >
              {state && statesAndCities[state].map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
            {errors.city && <p className="text-red-600">{errors.city}</p>}
          </div>

          {/* Video Call Rate */}
          <InputField label="Video Call Rate (₹ per session)" type="number" placeholder="1000" value={videoCallRate} onChange={(e) => setVideoCallRate(e.target.value)} />
          {errors.videoCallRate && <p className="text-red-600">{errors.videoCallRate}</p>}

          {/* Consultation Duration */}
          <InputField label="Consultation Duration" placeholder="30 minutes" value={consultationDuration} onChange={(e) => setConsultationDuration(e.target.value)} />
          {errors.consultationDuration && <p className="text-red-600">{errors.consultationDuration}</p>}

          {/* CV Upload */}
          <FileInput label="Upload CV" onChange={handleCvChange} accept=".pdf,.doc,.docx" error={errors.cvFile} />

          {/* Certifications */}
          <FileInput label="Upload Certifications" onChange={handleCertChange} accept=".pdf,.doc,.docx,.jpg,.png" multiple />

          {/* Submit */}
          <button type="submit" disabled={loading} className={`w-full bg-green-600 text-white py-3 rounded-xl font-semibold mt-6 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && <p className={`text-center mt-4 ${message.includes("✅") ? "text-green-700" : "text-red-600"}`}>{message}</p>}

        </form>
      </div>
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */
const InputField = ({ label, ...props }: any) => (
  <div><label className="block font-semibold mb-2">{label}</label><input {...props} className="w-full border px-4 py-2 rounded-xl" /></div>
);
const TextareaField = ({ label, ...props }: any) => (
  <div><label className="block font-semibold mb-2">{label}</label><textarea {...props} className="w-full border px-4 py-2 rounded-xl h-28" /></div>
);
const DynamicInputSection = ({ label, items, onAdd, onRemove, onChange, placeholder }: any) => (
  <div>
    <label className="block font-semibold mb-2">{label}</label>
    {items.map((item: string, i: number) => (
      <div key={i} className="flex gap-2 mb-2">
        <input type="text" placeholder={placeholder} value={item} onChange={(e) => onChange(i, e.target.value)} className="flex-1 border px-4 py-2 rounded-xl" />
        {items.length > 1 && <button type="button" onClick={() => onRemove(i)} className="bg-red-500 text-white px-3 rounded-xl">✕</button>}
      </div>
    ))}
    <button type="button" onClick={onAdd} className="text-green-700 font-semibold">+ Add another {label.toLowerCase()}</button>
  </div>
);
const LanguageInputSection = ({ languages, languageInput, setLanguageInput, handleAddLanguage, handleRemoveLanguage, errors }: any) => (
  <div>
    <label className="block font-semibold mb-2">Languages</label>
    <div className="flex gap-2 mb-2">
      <input value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())} placeholder="Enter language and press Add" className="flex-1 border px-4 py-2 rounded-xl" />
      <button type="button" onClick={handleAddLanguage} className="bg-green-600 text-white px-4 rounded-xl">Add</button>
    </div>
    <div className="flex flex-wrap gap-2">{languages.map((lang: string, i: number) => (
      <span key={i} className="bg-green-200 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">{lang}<button type="button" onClick={() => handleRemoveLanguage(i)} className="font-bold text-red-600">✕</button></span>
    ))}</div>
    {errors.languages && <p className="text-red-600">{errors.languages}</p>}
  </div>
);
const FileInput = ({ label, onChange, accept, multiple, error }: any) => (
  <div>
    <label className="block font-semibold mb-2">{label}</label>
    <input type="file" onChange={onChange} accept={accept} multiple={multiple} className="w-full border px-4 py-2 rounded-xl" />
    {error && <p className="text-red-600">{error}</p>}
  </div>
);
