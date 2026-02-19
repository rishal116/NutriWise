"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";
import { X, Award, Briefcase, Globe, FileText, Clock, RefreshCw} from "lucide-react";
import { 
  Section, 
  DynamicInput,
  InputField,
  SelectField,
  FileInput,
  AddButton,
  PrimaryButton,
} 
from "@/components/auth/nutrtionistForm/FormComponents";
import {
  LANGUAGE_OPTIONS,
  NUTRITIONIST_SPECIALIZATIONS,
} from "../../../constants/nutritionistDetails.constants";
import { userAuthService } from "@/services/user/userAuth.service";

interface Experience {
  role: string;
  organization: string;
  years: string;
}
interface Language {
  name: string;
}
type ErrorState = Record<string, string>;

export default function NutritionistDetailsPage() {  
  const [qualifications, setQualifications] = useState<string[]>([""]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([{ role: "", organization: "", years: "" }]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [bio, setBio] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState("");
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
const [certUrls, setCertUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  
useEffect(() => {
  const initialize = async () => {
    try {
      const res = await userAuthService.getMe();
      const status = res?.user?.nutritionistStatus;

      if (status === "approved") {
        router.replace("/nutritionist/dashboard");
        return;
      }

      if (status === "pending") {
        router.replace("/nutritionist/pending");
        return;
      }
      if (status === "rejected") {
        const detailsRes = await nutritionistAuthService.getMyDetails();
        console.log(detailsRes);
        
        const data = detailsRes.data?.data;

        if (!data) return;

        setQualifications(data.qualifications || [""]);
        setSpecializations(data.specializations || []);
        setExperiences(data.experiences || [{ role: "", organization: "", years: "" }]);
        setCvUrl(data.cvUrl || null);
setCertUrls(data.certificationUrls || []);
        setLanguages(
          data.languages?.map((l: string) => ({ name: l })) || []
        );
        setBio(data.bio || "");
      }

    } catch (err) {
      console.error("Failed to initialize page", err);
    }
  };

  initialize();
}, [router]);



  // ------------------------------
  // Validation
  // ------------------------------
  const validateField = (name: string, value: any) => {
    switch (name) {
      case "qualifications":
        if (value.some((q: string) => !q.trim())) return "All qualifications are required";
        break;
      case "specializations":
          if (!value.length) return "Select at least one specialization";
          break;
      case "experiences":
        for (const exp of value) {
          if (!exp.role.trim() || !exp.organization.trim()) return "Complete all experience fields";
          if (isNaN(Number(exp.years))) return "Years must be a number";
        }
        break;
      case "languages":
        if (!value.length) return "Add at least one language";
        break;
      case "bio":
        if (typeof value !== "string" || !value.trim()) return "Bio is required";
        if (value.length < 10) return "Bio must be at least 10 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateAll = () => {
    const fields = ["qualifications", "specializations", "experiences", "languages","bio"];
    const newErrors: ErrorState = {};
    fields.forEach((field) => {
      let value: any;
      switch (field) {
        case "qualifications": value = qualifications; break;
        case "specializations": value = specializations; break;
        case "experiences": value = experiences; break;
        case "languages": value = languages; break;
        case "bio": value = bio; break;
      }
if (!cvFile && !cvUrl) {
  newErrors.cv = "CV / Resume is required";
} else if (cvFile) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ];

  if (!allowedTypes.includes(cvFile.type)) {
    newErrors.cv =
      "Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG";
  }



}

certFiles.forEach((file, index) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
  ];
  if (!allowedTypes.includes(file.type)) {
    newErrors[`cert_${index}`] = `Invalid file type: Allowed: PDF, DOC, DOCX, PNG, JPG `;
  }
});

      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // Dynamic Utilities
  // ------------------------------
  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev, ""]);
  const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) =>
    setter(prev => prev.filter((_, i) => i !== index));

  const addExperience = () => setExperiences(prev => [...prev, { role: "", organization: "", years: "" }]);
  const updateExperience = (i: number, field: keyof Experience, value: string) =>
    setExperiences(prev => prev.map((exp, idx) => idx === i ? { ...exp, [field]: value } : exp));

  const handleLanguageAdd = (lang: string) => {
    if (!lang.trim() || languages.some(l => l.name === lang)) return;
    setLanguages([...languages, { name: lang }]);
    setLanguageInput("");
  };

  const removeLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));

  // ------------------------------
  // Form Submission
  // ------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); 
    setLoading(true);

    if (!validateAll()) { setLoading(false); return; }

    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("❌ User not found");

      const formData = new FormData();
      qualifications.forEach(q => formData.append("qualification[]", q));
      specializations.forEach(s => formData.append("specialization[]", s));
      experiences.forEach((exp, i) => {
        formData.append(`experience[${i}][role]`, exp.role);
        formData.append(`experience[${i}][organization]`, exp.organization);
        formData.append(`experience[${i}][years]`, exp.years);
      });
      const languageNames = languages.map(lang => lang.name);
      languageNames.forEach(lang => formData.append("languages[]", lang));
      formData.append("bio", bio);
      if (cvFile) formData.append("cv", cvFile);
      certFiles.forEach(file => formData.append("certifications", file));

      await nutritionistAuthService.submitDetails(formData);
      setMessage("✔ Profile submitted successfully!");
      router.push("/home");
    } catch (error) {
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-emerald-600">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-2">
              <Award className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Nutritionist Profile</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Complete your professional details to start providing consultations and help clients achieve their health goals.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8" onSubmit={handleSubmit}>
          {/* Qualifications */}
          <Section title="Qualifications" error={errors.qualifications} icon={Award}>
            {qualifications.map((q, i) => (
              <DynamicInput
                key={i}
                value={q}
                placeholder="e.g., M.Sc. in Nutrition and Dietetics"
                onChange={(val) => {
                  const updated = [...qualifications]; 
                  updated[i] = val; 
                  setQualifications(updated); 
                  setErrors(prev => ({ ...prev, qualifications: validateField("qualifications", updated) }));
                }}
                onRemove={() => removeItem(setQualifications, i)}
                canRemove={qualifications.length > 1}
              />
            ))}
            <AddButton label="Add Another Qualification" onClick={() => addItem(setQualifications)} />
          </Section>

          {/* Specializations */}
<Section title="Specializations" error={errors.specializations} icon={Briefcase}>
  <div className="flex flex-wrap gap-2 mb-4">
    {NUTRITIONIST_SPECIALIZATIONS.map((spec) => {
      const isSelected = specializations.includes(spec);
      return (
        <button
          key={spec}
          type="button"
          className={`px-4 py-2 rounded-xl border text-sm transition 
            ${isSelected 
              ? "bg-emerald-600 border-emerald-600 text-white" 
              : "bg-gray-100 border-gray-300 text-gray-800 hover:bg-emerald-50 hover:border-emerald-400"}`}
onClick={() => {
  setSpecializations(prev => {
    const updated = prev.includes(spec)
      ? prev.filter(s => s !== spec)
      : [...prev, spec];

    setErrors(err => ({
      ...err,
      specializations: validateField("specializations", updated)
    }));

    return updated;
  });
}}

        >
          {spec}
        </button>
      );
    })}
    {specializations.length === 0 && (
  <p className="text-sm text-gray-500 mt-2">
    You can select multiple specializations
  </p>
)}
  </div>

  
</Section>

          {/* Experiences */}
          <Section title="Work Experience" error={errors.experiences} icon={Briefcase}>
            {experiences.map((exp, idx) => (
              <div key={idx} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField placeholder="Role/Position" value={exp.role} onChange={(v) => updateExperience(idx, "role", v)} />
                  <InputField placeholder="Organization/Hospital" value={exp.organization} onChange={(v) => updateExperience(idx, "organization", v)} />
                  <InputField 
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="Years"
  value={exp.years}
  onChange={(v) => {
    if (/^\d*$/.test(v)) {
      const updated = [...experiences];
      updated[idx].years = v;
      setExperiences(updated);
    }
  }}
/>
                </div>
                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                    className="text-red-600 text-sm font-medium hover:text-red-700 transition"
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
            <AddButton label="Add Work Experience" onClick={addExperience} />
          </Section>
          <Section title="Bio / About You" error={errors.bio} icon={FileText}>
  <textarea
    value={bio}
    onChange={(e) => {
      setBio(e.target.value);
      setErrors(prev => ({ ...prev, bio: validateField("bio", e.target.value) }));
    }}
    placeholder="Describe yourself — your philosophy, goals, and what makes you unique as a nutritionist..."
    className="w-full min-h-[140px] border border-gray-300 rounded-xl p-4 text-gray-800 focus:ring-2 focus:ring-emerald-500"
  ></textarea>
</Section>

          {/* Languages */}
          <Section title="Languages" error={errors.languages} icon={Globe}>
            <div className="flex gap-3">
              <SelectField
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                options={LANGUAGE_OPTIONS}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => handleLanguageAdd(languageInput)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                Add
              </button>
            </div>
            {languages.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {languages.map((lang, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-2 font-medium"
                  >
                    {lang.name}
                    <X
                      size={16}
                      className="cursor-pointer hover:text-emerald-900 transition"
                      onClick={() => removeLanguage(i)}
                    />
                  </span>
                ))}
              </div>
            )}
          </Section>

{/* Documents */}
<Section title="Documents" icon={FileText}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* CV Upload */}
    <div>
      <FileInput
        label="Upload CV/Resume (Required)"
        fileName={cvFileName}
        square
        onChange={(e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            setCvFile(file);
            setCvFileName(file.name);
          }
        }}
      />
      {errors.cv && (
  <p className="text-red-600 text-sm mt-1 font-medium">{errors.cv}</p>
)}

      {cvFile || cvUrl ? (
  <div className="mt-4 space-y-3">
    <p className="text-sm font-semibold text-gray-700">
      Uploaded CV / Resume:
    </p>

    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      
      {/* If new file selected */}
      {cvFile ? (
        <>
          <span
            onClick={() => window.open(URL.createObjectURL(cvFile), "_blank")}
            className="flex-1 cursor-pointer hover:underline"
          >
            {cvFile.name}
          </span>
          <X onClick={() => setCvFile(null)} />
        </>
      ) : (
        <>
          <span
            onClick={() => window.open(cvUrl!, "_blank")}
            className="flex-1 cursor-pointer hover:underline"
          >
            View Uploaded CV
          </span>
          <X onClick={() => setCvUrl(null)} />
        </>
      )}
    </div>
  </div>
) : null}

    </div>

    {/* Certifications Upload */}
    <div>
      <FileInput
        label="Upload Certifications (Optional)"
        multiple
        square
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          const files = Array.from(e.target.files) as File[];
          setCertFiles(prev => [...prev, ...files]);
        }}
      />
      {certUrls.length > 0 && (
  <div className="mt-4 space-y-3">
    <p className="text-sm font-semibold text-gray-700">
      Uploaded Certifications:
    </p>

    {certUrls.map((url, index) => (
      <div
        key={index}
        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
      >
        <span
          onClick={() => window.open(url, "_blank")}
          className="flex-1 cursor-pointer hover:underline"
        >
          View Certification {index + 1}
        </span>

        <X
          size={18}
          className="cursor-pointer text-gray-400 hover:text-red-500"
          onClick={() =>
            setCertUrls(prev => prev.filter((_, i) => i !== index))
          }
        />
      </div>
    ))}
  </div>
)}


      {certFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Uploaded Certifications:</p>

          {certFiles.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const fileURL = URL.createObjectURL(file);

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div onClick={() => window.open(fileURL, "_blank")} className="cursor-pointer">
                  {isImage ? (
                    <img src={fileURL} className="w-12 h-12 object-cover rounded-md border" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-md text-gray-600 text-lg">
                      📄
                    </div>
                  )}
                </div>

                <span
                  onClick={() => window.open(fileURL, "_blank")}
                  className="flex-1 text-gray-800 text-sm font-medium truncate cursor-pointer hover:underline hover:text-emerald-600 transition"
                >
                  {file.name}
                </span>

                <X
                  size={18}
                  className="cursor-pointer text-gray-400 hover:text-red-500 transition"
                  onClick={() =>
                    setCertFiles(prev => prev.filter((_, i) => i !== index))
                  }
                />
                {errors[`cert_${index}`] && (
  <p className="text-red-600 text-xs mt-1 font-medium">{errors[`cert_${index}`]}</p>
)}
                
              </div>
              

            );
            
            
          })}
          
        </div>
      )}
    </div>
  </div>
</Section>



          {/* Submit */}
          <div className="pt-4">
            <PrimaryButton type="button" disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Submitting Your Profile...
                </span>
              ) : (
                "Submit Profile & Start Consultations"
              )}
            </PrimaryButton>
          </div>

          {message && (
            <div
              className={`text-center font-medium p-4 rounded-lg ${
                message.startsWith("✔")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}