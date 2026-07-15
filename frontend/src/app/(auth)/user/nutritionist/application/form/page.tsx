"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Upload,
  FileCheck,
  Loader2,
  X,
  GraduationCap,
  Briefcase,
  Sparkles,
  Globe2,
  FileText,
  Award,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { nutritionistApplicationService } from "@/services/nutritionist/nutriApplication.service";

import {
  SPECIALIZATIONS,
  LANGUAGES,
  SpecializationType,
  LanguageType,
} from "@/types/nutritionist.types";
import {
  nutritionistApplicationSchema,
  type NutritionistApplicationFormValues,
} from "@/validations/nutritionist-application.validation";
import { getErrorMessage } from "@/utils/getErrorMessage";

const specializationLabels: Record<SpecializationType, string> = {
  weight_loss: "Weight Loss",
  weight_gain: "Weight Gain",
  sports_nutrition: "Sports Nutrition",
  clinical_nutrition: "Clinical Nutrition",
  diabetes_management: "Diabetes Management",
  pcos_nutrition: "PCOS Nutrition",
  renal_nutrition: "Renal Nutrition",
  cardiac_nutrition: "Cardiac Nutrition",
  gut_health: "Gut Health",
  child_nutrition: "Child Nutrition",
  pregnancy_nutrition: "Pregnancy Nutrition",
  elderly_nutrition: "Elderly Nutrition",
  vegan_nutrition: "Vegan Nutrition",
  ketogenic_diet: "Ketogenic Diet",
  general_wellness: "General Wellness",
};

const languageLabels: Record<LanguageType, string> = {
  english: "English",
  hindi: "Hindi",
  malayalam: "Malayalam",
  tamil: "Tamil",
  kannada: "Kannada",
  telugu: "Telugu",
  marathi: "Marathi",
  gujarati: "Gujarati",
  bengali: "Bengali",
  urdu: "Urdu",
};

const SECTIONS = [
  { id: "qualifications", label: "Qualifications" },
  { id: "experience", label: "Experience" },
  { id: "specializations", label: "Specializations" },
  { id: "languages", label: "Languages" },
  { id: "bio", label: "Bio" },
  { id: "resume", label: "Resume" },
  { id: "certifications", label: "Certifications" },
];

const currentYear = new Date().getFullYear();

// Blocks 'e', 'E', '+', '-' at the keystroke level on <input type="number">.
// Note: this is UX polish only — it does not stop paste, autofill, or
// programmatic form submission. The Zod schema is the real gate.
function blockInvalidNumberKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
}

function blockInvalidPaste(e: React.ClipboardEvent<HTMLInputElement>) {
  const pastedText = e.clipboardData.getData("text");

  if (!/^\d+$/.test(pastedText)) {
    e.preventDefault();
  }
}

function blockInvalidDecimalPaste(e: React.ClipboardEvent<HTMLInputElement>) {
  const pastedText = e.clipboardData.getData("text").trim();

  // Allows: 2, 2.5, 10.75
  if (!/^\d+(\.\d+)?$/.test(pastedText)) {
    e.preventDefault();
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionHeader({
  icon: Icon,
  index,
  title,
  subtitle,
  action,
}: {
  icon: React.ElementType;
  index: number;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {String(index).padStart(2, "0")}
            </span>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

// ================================
// Component
// ================================

export default function NutritionistApplicationFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(
    null,
  );

  const form = useForm({
    resolver: zodResolver(nutritionistApplicationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      // NOTE: these are empty on purpose. Never seed a "real looking"
      // default (e.g. year: currentYear) — placeholders communicate the
      // expected format, actual values must come from the user or backend.
      qualifications: [{ degree: "", institution: "", year: "" }],
      experiences: [{ role: "", organization: "", durationYears: "" }],
      specializations: [],
      languages: [],
      bio: "",

      resumeUrl: "",
      resume: undefined,

      certifications: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = form;

  const qualificationFields = useFieldArray({
    control,
    name: "qualifications",
  });
  const experienceFields = useFieldArray({ control, name: "experiences" });
  const certificationFields = useFieldArray({
    control,
    name: "certifications",
  });

  const selectedSpecializations = watch("specializations");
  const selectedLanguages = watch("languages");
  const bioValue = watch("bio") ?? "";
  const resumeFile = watch("resume")?.[0];

  // Prefill from a previous (rejected) application, if one exists.
  // This is the ONLY place real values should be injected into the form —
  // straight from the backend response, never hardcoded on the client.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const details =
          await nutritionistApplicationService.getApplicationDetails();

        if (cancelled) return;

        setIsEditMode(true);
        setExistingResumeUrl(details.resumeUrl ?? null);

        reset({
          qualifications: details.qualifications.length
            ? details.qualifications.map((q) => ({
                degree: q.degree,
                institution: q.institution,
                year: q.year,
              }))
            : [{ degree: "", institution: "", year: "" }],

          experiences: details.experiences.length
            ? details.experiences
            : [{ role: "", organization: "", durationYears: "" }],

          specializations: details.specializations,

          languages: details.languages,

          bio: details.bio ?? "",

          resumeUrl: details.resumeUrl,

          certifications: details.certifications.map((c) => ({
            name: c.name,
            issuedBy: c.issuedBy,
            fileUrl: c.certificateUrl,
            file: undefined as unknown as FileList,
          })),
        });
      } catch {
        // No existing application to prefill from — start fresh, no error shown.
      } finally {
        if (!cancelled) setIsLoadingApplication(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reset]);

  const toggleSpecialization = (value: SpecializationType) => {
    const current = selectedSpecializations ?? [];
    setValue(
      "specializations",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  };

  const toggleLanguage = (value: LanguageType) => {
    const current = selectedLanguages ?? [];
    setValue(
      "languages",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  };

  const onSubmit = async (values: NutritionistApplicationFormValues) => {
    clearErrors();

    let valid = true;

    // Resume validation
    if (!existingResumeUrl && !values.resume?.[0]) {
      valid = false;
      setError("resume", { type: "manual", message: "Resume is required" });
    }

    if (values.resume?.[0] && values.resume[0].size > 5 * 1024 * 1024) {
      valid = false;
      setError("resume", {
        type: "manual",
        message: "Resume must be less than 5 MB",
      });
    }

    if (values.certifications.length === 0) {
      valid = false;
      toast.error("Please add at least one certification.");
    }

    // Certificate validation
    values.certifications.forEach((cert, index) => {
      const existingUrl = cert.fileUrl;
      const newFile = cert.file?.[0];

      if (!existingUrl && !newFile) {
        valid = false;
        setError(`certifications.${index}.file`, {
          type: "manual",
          message: "Certificate file is required",
        });
      }

      if (newFile && newFile.size > 5 * 1024 * 1024) {
        valid = false;
        setError(`certifications.${index}.file`, {
          type: "manual",
          message: "Certificate must be less than 5 MB",
        });
      }
    });

    if (!valid) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("qualifications", JSON.stringify(values.qualifications));
      formData.append("experiences", JSON.stringify(values.experiences));
      formData.append(
        "specializations",
        JSON.stringify(values.specializations),
      );
      formData.append("languages", JSON.stringify(values.languages));
      formData.append("bio", values.bio ?? "");

      if (values.resume?.[0]) {
        formData.append("resume", values.resume[0]);
      }

      const certificationMeta = values.certifications.map((cert) => ({
        name: cert.name,
        issuedBy: cert.issuedBy,
        fileUrl: cert.fileUrl,
      }));
      formData.append("certificationMeta", JSON.stringify(certificationMeta));

      values.certifications.forEach((cert) => {
        if (cert.file?.[0]) {
          formData.append("certifications", cert.file[0]);
        }
      });

      await nutritionistApplicationService.submitApplication(formData);
      toast.success("Application submitted for review");
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600";
  const labelClass = "text-xs font-medium text-slate-600";
  const errorClass = "mt-1 flex items-center gap-1 text-xs text-red-600";
  const cardClass =
    "scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm shadow-emerald-900/[0.03]";

  if (isLoadingApplication) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50/40">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 pb-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-12">
        {/* Header */}
        <div className="mb-6">
          {isEditMode && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <RotateCcw className="h-3.5 w-3.5" />
              Resubmission
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isEditMode
              ? "Update Your Application"
              : "Nutritionist Application"}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {isEditMode
              ? "Your previous application wasn't approved. Review your details, update anything that needs fixing, and resubmit."
              : "Tell us about your professional background."}{" "}
            Fields marked <span className="text-red-500">*</span> are required
            for review.
          </p>
        </div>

        {/* Section nav — scrollable on mobile */}
        <div className="mb-8 -mx-4 sm:mx-0 sticky top-16 z-30 bg-emerald-50/95 backdrop-blur-sm py-2 px-4 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:static">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Qualifications */}
          <section id="qualifications" className={cardClass}>
            <SectionHeader
              icon={GraduationCap}
              index={1}
              title="Qualifications"
              subtitle="Your degrees and formal education"
              action={
                <button
                  type="button"
                  onClick={() =>
                    qualificationFields.append({
                      degree: "",
                      institution: "",
                      year: "",
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              }
            />

            <div className="mt-5 space-y-4">
              {qualificationFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative grid gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3"
                >
                  <div>
                    <label className={labelClass}>Degree *</label>
                    <input
                      {...register(`qualifications.${index}.degree`)}
                      className={inputClass}
                      placeholder="B.Sc Nutrition"
                    />
                    {errors.qualifications?.[index]?.degree && (
                      <p className={errorClass}>
                        {errors.qualifications[index]?.degree?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Institution *</label>
                    <input
                      {...register(`qualifications.${index}.institution`)}
                      className={inputClass}
                      placeholder="University name"
                    />
                    {errors.qualifications?.[index]?.institution && (
                      <p className={errorClass}>
                        {errors.qualifications[index]?.institution?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Year *</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      onKeyDown={blockInvalidNumberKeys}
                      onPaste={blockInvalidPaste}
                      {...register(`qualifications.${index}.year`)}
                      className={inputClass}
                      placeholder={String(currentYear)}
                    />
                    {errors.qualifications?.[index]?.year && (
                      <p className={errorClass}>
                        {errors.qualifications[index]?.year?.message}
                      </p>
                    )}
                  </div>

                  {qualificationFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => qualificationFields.remove(index)}
                      aria-label="Remove qualification"
                      className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1 text-slate-400 shadow-sm hover:border-red-200 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {errors.qualifications?.root && (
                <p className={errorClass}>
                  {errors.qualifications.root.message}
                </p>
              )}
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className={cardClass}>
            <SectionHeader
              icon={Briefcase}
              index={2}
              title="Work Experience"
              subtitle="Roles you've held in nutrition or healthcare"
              action={
                <button
                  type="button"
                  onClick={() =>
                    experienceFields.append({
                      role: "",
                      organization: "",
                      durationYears: "",
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              }
            />

            <div className="mt-5 space-y-4">
              {experienceFields.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative grid gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3"
                >
                  <div>
                    <label className={labelClass}>Role *</label>
                    <input
                      {...register(`experiences.${index}.role`)}
                      className={inputClass}
                      placeholder="Dietitian"
                    />
                    {errors.experiences?.[index]?.role && (
                      <p className={errorClass}>
                        {errors.experiences[index]?.role?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Organization *</label>
                    <input
                      {...register(`experiences.${index}.organization`)}
                      className={inputClass}
                      placeholder="Hospital / Clinic name"
                    />
                    {errors.experiences?.[index]?.organization && (
                      <p className={errorClass}>
                        {errors.experiences[index]?.organization?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Duration (years) *</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      onKeyDown={blockInvalidNumberKeys}
                      onPaste={blockInvalidDecimalPaste}
                      {...register(`experiences.${index}.durationYears`)}
                      className={inputClass}
                      placeholder="e.g. 2.5"
                    />
                    {errors.experiences?.[index]?.durationYears && (
                      <p className={errorClass}>
                        {errors.experiences[index]?.durationYears?.message}
                      </p>
                    )}
                  </div>

                  {experienceFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => experienceFields.remove(index)}
                      aria-label="Remove experience"
                      className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1 text-slate-400 shadow-sm hover:border-red-200 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Specializations */}
          <section id="specializations" className={cardClass}>
            <SectionHeader
              icon={Sparkles}
              index={3}
              title="Specializations"
              subtitle={`Select all that apply${
                selectedSpecializations?.length
                  ? ` — ${selectedSpecializations.length} selected`
                  : ""
              }`}
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => {
                const active = selectedSpecializations?.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {specializationLabels[spec]}
                  </button>
                );
              })}
            </div>
            {errors.specializations && (
              <p className={errorClass}>{errors.specializations.message}</p>
            )}
          </section>

          {/* Languages */}
          <section id="languages" className={cardClass}>
            <SectionHeader
              icon={Globe2}
              index={4}
              title="Languages"
              subtitle={`Select all that apply${
                selectedLanguages?.length
                  ? ` — ${selectedLanguages.length} selected`
                  : ""
              }`}
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const active = selectedLanguages?.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {languageLabels[lang]}
                  </button>
                );
              })}
            </div>
            {errors.languages && (
              <p className={errorClass}>{errors.languages.message}</p>
            )}
          </section>

          {/* Bio */}
          <section id="bio" className={cardClass}>
            <SectionHeader
              icon={FileText}
              index={5}
              title="Bio"
              subtitle="A short introduction clients will see on your profile"
              action={
                <span
                  className={`text-xs font-medium ${
                    bioValue.length > 450 ? "text-amber-600" : "text-slate-400"
                  }`}
                >
                  {bioValue.length}/500
                </span>
              }
            />
            <textarea
              {...register("bio")}
              rows={4}
              maxLength={500}
              className={`${inputClass} resize-none`}
              placeholder="Tell clients about your approach and experience..."
            />
            {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
          </section>

          {/* Resume */}
          <section id="resume" className={cardClass}>
            <SectionHeader
              icon={Upload}
              index={6}
              title="Resume"
              subtitle={
                isEditMode && existingResumeUrl
                  ? "Already on file — upload a new one only to replace it"
                  : "PDF or Word, max 5MB *"
              }
            />

            {existingResumeUrl && !resumeFile && (
              <Link
                href={existingResumeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline"
              >
                <FileCheck className="h-4 w-4" /> View current resume
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}

            <label
              className={`mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm transition-colors ${
                resumeFile
                  ? "border-emerald-300 bg-emerald-50/60 text-emerald-700"
                  : "border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              {resumeFile ? (
                <>
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{resumeFile.name}</span>
                  <span className="text-emerald-500">
                    · {formatFileSize(resumeFile.size)}
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {existingResumeUrl
                    ? "Click to replace resume"
                    : "Click to upload resume"}
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                {...register("resume")}
              />
            </label>
            {errors.resume && (
              <p className={errorClass}>{errors.resume.message as string}</p>
            )}
          </section>

          {/* Certifications */}
          <section id="certifications" className={cardClass}>
            <SectionHeader
              icon={Award}
              index={7}
              title="Certifications"
              subtitle="Add any professional certifications — each one needs a file"
              action={
                <button
                  type="button"
                  onClick={() =>
                    certificationFields.append({
                      name: "",
                      issuedBy: "",
                      fileUrl: "",
                      file: undefined as unknown as FileList,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              }
            />

            <div className="mt-5 space-y-4">
              {certificationFields.fields.map((field, index) => {
                const cert = watch(`certifications.${index}`);
                const certFile = cert?.file?.[0];
                const existingUrl = cert?.fileUrl;
                return (
                  <div
                    key={field.id}
                    className="relative grid gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-3"
                  >
                    <div>
                      <label className={labelClass}>Certification Name *</label>
                      <input
                        {...register(`certifications.${index}.name`)}
                        className={inputClass}
                        placeholder="Certified Diabetes Educator"
                      />
                      {errors.certifications?.[index]?.name && (
                        <p className={errorClass}>
                          {errors.certifications[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Issued By *</label>
                      <input
                        {...register(`certifications.${index}.issuedBy`)}
                        className={inputClass}
                        placeholder="Issuing body"
                      />
                      {errors.certifications?.[index]?.issuedBy && (
                        <p className={errorClass}>
                          {errors.certifications[index]?.issuedBy?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Certificate File *</label>
                      {existingUrl && !certFile && (
                        <Link
                          href={existingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
                        >
                          View current file <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                      <label
                        className={`mt-1 flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                          certFile
                            ? "border-emerald-300 bg-emerald-50/60 text-emerald-700"
                            : "border-slate-200 text-slate-500 hover:border-emerald-400"
                        }`}
                      >
                        <FileCheck
                          className={`h-4 w-4 shrink-0 ${certFile ? "text-emerald-600" : ""}`}
                        />
                        <span className="truncate">
                          {certFile?.name ??
                            (existingUrl ? "Replace file" : "Choose file")}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          {...register(`certifications.${index}.file`)}
                        />
                      </label>
                      {errors.certifications?.[index]?.file && (
                        <p className={errorClass}>
                          {
                            errors.certifications[index]?.file
                              ?.message as string
                          }
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => certificationFields.remove(index)}
                      aria-label="Remove certification"
                      className="absolute -right-2 -top-2 rounded-full border border-slate-200 bg-white p-1 text-slate-400 shadow-sm hover:border-red-200 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
              {certificationFields.fields.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                  No certifications added yet.
                </div>
              )}
              {errors.certifications?.message && (
                <p className={errorClass}>{errors.certifications.message}</p>
              )}
            </div>
          </section>
        </form>
      </div>

      {/* Sticky submit bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-6 py-3">
          <p className="hidden sm:block text-xs text-slate-500">
            Your application will be reviewed within 2–3 business days.
          </p>
          <button
            type="submit"
            form={undefined}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting
              ? "Submitting..."
              : isEditMode
                ? "Resubmit Application"
                : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
