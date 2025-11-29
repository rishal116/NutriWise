"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionist.service";
import { Upload, Plus, X } from "lucide-react";

// ------------------------------
// Types
// ------------------------------
interface Experience {
  role: string;
  organization: string;
  years: string;
}

type ErrorState = Record<string, string>;

// ------------------------------
// States & Cities
// ------------------------------
const statesAndCities: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Karnataka: ["Bengaluru", "Mysore", "Mangalore"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
  Delhi: ["New Delhi"],
  WestBengal: ["Kolkata", "Darjeeling"],
};

// ------------------------------
// Main Component
// ------------------------------
export default function NutritionistDetailsPage() {
  const router = useRouter();

  // ------------------------------
  // State Hooks
  // ------------------------------
  const [qualifications, setQualifications] = useState([""]);
  const [specializations, setSpecializations] = useState([""]);
  const [experiences, setExperiences] = useState<Experience[]>([{ role: "", organization: "", years: "" }]);
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [videoCallRate, setVideoCallRate] = useState("");
  const [consultationDuration, setConsultationDuration] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string>("");
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [certPreviews, setCertPreviews] = useState<string[]>([]);
  const [state, setState] = useState(Object.keys(statesAndCities)[0]);
  const [city, setCity] = useState(statesAndCities[state][0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ErrorState>({});

  // ------------------------------
  // Validation Functions
  // ------------------------------
  const validateField = (name: string, value: any) => {
    switch (name) {
      case "bio": if (!value.trim()) return "Bio is required"; break;
      case "languages": if (!value.length) return "Add at least one language"; break;
      case "videoCallRate":
        if (!value.trim()) return "Video call rate is required";
        if (isNaN(Number(value))) return "Video call rate must be a number";
        break;
      case "consultationDuration": if (!value.trim()) return "Consultation duration is required"; break;
      case "cvFile": if (!value) return "Upload CV"; break;
      case "qualifications": if (value.some((q: string) => !q.trim())) return "All qualifications are required"; break;
      case "specializations": if (value.some((s: string) => !s.trim())) return "All specializations are required"; break;
      case "experiences":
        for (const exp of value) {
          if (!exp.role.trim() || !exp.organization.trim() || !exp.years.trim()) return "Complete all experience fields";
          if (isNaN(Number(exp.years))) return "Years must be a number";
        }
        break;
      default: return "";
    }
    return "";
  };

  const validateAll = () => {
    const fields = ["bio","languages","videoCallRate","consultationDuration","cvFile","qualifications","specializations","experiences"];
    const newErrors: ErrorState = {};
    fields.forEach((field) => {
      let value: any;
      switch (field) {
        case "bio": value = bio; break;
        case "languages": value = languages; break;
        case "videoCallRate": value = videoCallRate; break;
        case "consultationDuration": value = consultationDuration; break;
        case "cvFile": value = cvFile; break;
        case "qualifications": value = qualifications; break;
        case "specializations": value = specializations; break;
        case "experiences": value = experiences; break;
      }
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // Dynamic Field Utilities
  // ------------------------------
  const addDynamicItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev,""]);
  const removeDynamicItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) =>
    setter(prev => prev.filter((_, i) => i!==index));
  const addExperience = () => setExperiences(prev => [...prev, { role: "", organization: "", years: "" }]);
  const updateExperience = (i: number, field: keyof Experience, value: string) =>
    setExperiences(prev => prev.map((exp, idx) => idx === i ? { ...exp, [field]: value } : exp));
  const handleLanguageAdd = () => {
    const lang = languageInput.trim();
    if (!lang || languages.includes(lang)) return;
    setLanguages([...languages, lang]);
    setLanguageInput("");
  };

  // ------------------------------
  // Form Submission
  // ------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setLoading(true);

    if (!validateAll()) { setLoading(false); return; }

    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("❌ User not found");

      const formData = new FormData();
      qualifications.forEach(q => formData.append("qualification[]", q));
      specializations.forEach(s => formData.append("specialization[]", s));
      experiences.forEach((exp,i) => {
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
      if(cvFile) formData.append("cv", cvFile);
      certFiles.forEach(file => formData.append("certifications", file));

      await nutritionistAuthService.submitDetails(formData);
      setMessage("✔ Profile submitted successfully!");
      router.push("/home");
    } catch (error) {
      setMessage("❌ Something went wrong");
    } finally { setLoading(false); }
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-green-700">Nutritionist Profile</h1>
          <p className="text-gray-600 text-lg">Complete your details to begin consultations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Qualifications */}
          <Section title="Qualifications" error={errors.qualifications}>
            {qualifications.map((q, i) => (
              <DynamicInput
                key={i}
                value={q}
                placeholder="e.g., M.Sc. in Nutrition"
                onChange={(val) => { const updated = [...qualifications]; updated[i] = val; setQualifications(updated); setErrors(prev => ({...prev, qualifications: validateField("qualifications", updated)})); }}
                onRemove={() => removeDynamicItem(setQualifications, i)}
                canRemove={qualifications.length>1}
              />
            ))}
            <AddButton label="Add Qualification" onClick={() => addDynamicItem(setQualifications)} />
          </Section>

          {/* Specializations */}
          <Section title="Specializations" error={errors.specializations}>
            {specializations.map((s, i) => (
              <DynamicInput
                key={i}
                value={s}
                placeholder="e.g., Sports Nutrition"
                onChange={(val) => { const updated = [...specializations]; updated[i] = val; setSpecializations(updated); setErrors(prev => ({...prev, specializations: validateField("specializations", updated)})); }}
                onRemove={() => removeDynamicItem(setSpecializations, i)}
                canRemove={specializations.length>1}
              />
            ))}
            <AddButton label="Add Specialization" onClick={() => addDynamicItem(setSpecializations)} />
          </Section>

          {/* Experiences */}
          <Section title="Work Experience" error={errors.experiences}>
            {experiences.map((exp, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input placeholder="Role" value={exp.role} onChange={(v)=>updateExperience(idx, "role", v)} />
                <Input placeholder="Organization" value={exp.organization} onChange={(v)=>updateExperience(idx, "organization", v)} />
                <Input type="number" placeholder="Years" value={exp.years} onChange={(v)=>updateExperience(idx, "years", v)} />
              </div>
            ))}
            <AddButton label="Add Experience" onClick={addExperience} />
          </Section>

          {/* Bio */}
          <Section title="Bio" error={errors.bio}>
            <Textarea value={bio} onChange={(val)=>{setBio(val); setErrors(prev=>({...prev, bio: validateField("bio", val)}))}} placeholder="Write a short professional summary..." />
          </Section>

          {/* Languages */}
          <Section title="Languages" error={errors.languages}>
            <div className="flex gap-2">
              <Input value={languageInput} placeholder="Enter language" onChange={setLanguageInput} />
              <PrimaryButton type="button" onClick={handleLanguageAdd} className="px-5">Add</PrimaryButton>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {languages.map((lang, i)=><span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">{lang}<X size={16} className="cursor-pointer" onClick={()=>setLanguages(languages.filter((_,idx)=>idx!==i))} /></span>)}
            </div>
          </Section>

          {/* Location */}
          <Section title="Location">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="State" value={state} onChange={(st)=>{setState(st); setCity(statesAndCities[st][0])}}>
                {Object.keys(statesAndCities).map(st=><option key={st}>{st}</option>)}
              </Select>
              <Select label="City" value={city} onChange={setCity}>
                {statesAndCities[state].map(ct=><option key={ct}>{ct}</option>)}
              </Select>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Consultation Pricing">
            <Input type="number" label="Video Call Rate (₹)" value={videoCallRate} onChange={(val)=>{setVideoCallRate(val); setErrors(prev=>({...prev, videoCallRate: validateField("videoCallRate", val)}))}} />
            {errors.videoCallRate && <Error>{errors.videoCallRate}</Error>}
            <Input label="Consultation Duration" placeholder="e.g., 30 minutes" value={consultationDuration} onChange={(val)=>{setConsultationDuration(val); setErrors(prev=>({...prev, consultationDuration: validateField("consultationDuration", val)}))}} />
            {errors.consultationDuration && <Error>{errors.consultationDuration}</Error>}
          </Section>

          {/* Documents */}
          <Section title="Documents" error={errors.cvFile}>
            <FileInput label="Upload CV" onChange={(e:any)=>{const f=e.target.files?.[0]??null; setCvFile(f); if(f)setCvPreview(URL.createObjectURL(f)); setErrors(prev=>({...prev, cvFile: validateField("cvFile", f)}))}} />
            {cvPreview && <p>Preview: <a href={cvPreview} target="_blank">{cvFile?.name}</a></p>}
            <FileInput label="Upload Certifications" multiple onChange={(e)=>{const files=Array.from(e.target.files as File[]); setCertFiles(prev=>[...prev,...files]); setCertPreviews(prev=>[...prev,...files.map(f=>URL.createObjectURL(f))])}} />
            <div className="flex gap-2 flex-wrap mt-2">
              {certFiles.map((file, idx)=>(
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                  {file.name}
                  <X size={16} className="cursor-pointer" onClick={()=>{setCertFiles(certFiles.filter((_,i)=>i!==idx)); setCertPreviews(certPreviews.filter((_,i)=>i!==idx))}} />
                </span>
              ))}
            </div>
          </Section>

          {/* Submit */}
          <PrimaryButton type="submit" disabled={loading} className="w-full text-lg py-3">{loading?"Submitting...":"Submit Profile"}</PrimaryButton>
          {message && <p className={`text-center font-medium ${message.startsWith("✔")?"text-green-600":"text-red-600"}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

// ------------------------------
// Reusable Components
// ------------------------------
const Section = ({ title, children, error }: any) => <div className="space-y-3"><h2 className="text-2xl font-semibold text-green-700">{title}</h2><div className="space-y-4 border border-gray-200 rounded-2xl p-6 bg-gray-50">{children}</div>{error&&<Error>{error}</Error>}</div>;
const DynamicInput = ({ value, placeholder, onChange, onRemove, canRemove }: any) => <div className="flex gap-3"><Input value={value} placeholder={placeholder} onChange={onChange} className="flex-1"/>{canRemove && <button type="button" onClick={onRemove} className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"><X size={18}/></button>}</div>;
const AddButton = ({ onClick, label }: any) => <button type="button" onClick={onClick} className="flex items-center gap-1 text-green-700 font-semibold hover:underline"><Plus size={18}/>{label}</button>;
const PrimaryButton = ({ children, className="", disabled, ...props }: any) => <button {...props} disabled={disabled} className={`bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 px-6 py-2 ${disabled?"opacity-50 cursor-not-allowed":"hover:bg-green-700 hover:shadow-lg hover:scale-[1.01] active:scale-95"} ${className}`}>{children}</button>;
const Input = ({ label, value, onChange, className="", ...props }: any) => <div className="space-y-1 w-full">{label&&<label className="font-medium">{label}</label>}<input {...props} value={value} onChange={(e)=>onChange(e.target.value)} className={`w-full border px-4 py-2 rounded-xl outline-green-600 ${className}`} /></div>;
const Textarea = ({ value, onChange, className="", ...props }: any) => <textarea {...props} value={value} onChange={(e)=>onChange(e.target.value)} className={`w-full border px-4 py-2 rounded-xl h-32 outline-green-600 resize-none ${className}`} />;
const Select = ({ label, value, onChange, children }: any) => <div className="space-y-1">{label&&<label className="font-medium">{label}</label>}<select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full border px-4 py-2 rounded-xl outline-green-600">{children}</select></div>;
const FileInput = ({ label, error, ...props }: any) => <div className="space-y-1"><label className="font-medium">{label}</label><input type="file" {...props} className="w-full border px-4 py-2 rounded-xl bg-white" />{error && <Error>{error}</Error>}</div>;
const Error = ({ children }: any) => <p className="text-red-600 font-medium">{children}</p>;
