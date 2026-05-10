"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import {
  X,
  Award,
  Briefcase,
  Globe,
  FileText,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { RootState } from "@/redux/store";

import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";
import { userAuthService } from "@/services/user/userAuth.service";

import {
  Section,
  DynamicInput,
  InputField,
  SelectField,
  FileInput,
  AddButton,
  PrimaryButton,
} from "@/components/auth/nutrtionistForm/FormComponents";

import {
  LANGUAGE_OPTIONS,
  NUTRITIONIST_SPECIALIZATIONS,
} from "../../../constants/nutritionist/nutritionistDetails.constants";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface Experience {
  role: string;
  organization: string;
  years: string;
}

interface Language {
  name: string;
}

type ErrorState = Record<string, string>;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function NutritionistDetailsPage() {
  const router = useRouter();

  const token = useSelector(
    (state: RootState) => state.auth.token
  );

  // ───────────────────────────────────────────────────────────
  // States
  // ───────────────────────────────────────────────────────────

  const [qualifications, setQualifications] =
    useState<string[]>([""]);

  const [specializations, setSpecializations] =
    useState<string[]>([]);

  const [experiences, setExperiences] =
    useState<Experience[]>([
      {
        role: "",
        organization: "",
        years: "",
      },
    ]);

  const [languages, setLanguages] = useState<Language[]>(
    []
  );

  const [languageInput, setLanguageInput] =
    useState("");

  const [bio, setBio] = useState("");

  const [cvFile, setCvFile] = useState<File | null>(
    null
  );

  const [cvFileName, setCvFileName] =
    useState("");

  const [certFiles, setCertFiles] = useState<File[]>(
    []
  );

  const [cvUrl, setCvUrl] = useState<string | null>(
    null
  );

  const [certUrls, setCertUrls] = useState<string[]>(
    []
  );

  const [errors, setErrors] = useState<ErrorState>(
    {}
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // ───────────────────────────────────────────────────────────
  // Initialize
  // ───────────────────────────────────────────────────────────

  useEffect(() => {
    const initialize = async () => {
      try {
        const res = await userAuthService.getMe();

        if (!res.success) return;

        const status =
          res.user?.nutritionistStatus;

        // Approved
        if (status === "approved") {
          router.replace(
            "/nutritionist/dashboard"
          );
          return;
        }

        // Pending
        if (status === "pending") {
          router.replace(
            "/nutritionist/pending"
          );
          return;
        }

        // Rejected → load previous data
        if (status === "rejected") {
          const detailsRes =
            await nutritionistAuthService.getMyDetails();

          const data = detailsRes.data?.data;

          if (!data) return;

          setQualifications(
            data.qualifications || [""]
          );

          setSpecializations(
            data.specializations || []
          );

          setExperiences(
            data.experiences || [
              {
                role: "",
                organization: "",
                years: "",
              },
            ]
          );

          setCvUrl(data.cvUrl || null);

          setCertUrls(
            data.certificationUrls || []
          );

          setLanguages(
            data.languages?.map(
              (l: string) => ({
                name: l,
              })
            ) || []
          );

          setBio(data.bio || "");
        }
      } catch (error) {
        console.error(
          "Failed to initialize page:",
          error
        );
      }
    };

    initialize();
  }, [router]);

  // ───────────────────────────────────────────────────────────
  // Validation
  // ───────────────────────────────────────────────────────────

  const validateField = (
    name: string,
    value: any
  ) => {
    switch (name) {
      case "qualifications":
        if (
          value.some(
            (q: string) => !q.trim()
          )
        ) {
          return "All qualifications are required";
        }
        break;

      case "specializations":
        if (!value.length) {
          return "Select at least one specialization";
        }
        break;

      case "experiences":
        for (const exp of value) {
          if (
            !exp.role.trim() ||
            !exp.organization.trim()
          ) {
            return "Complete all experience fields";
          }

          if (
            isNaN(Number(exp.years))
          ) {
            return "Years must be a number";
          }
        }
        break;

      case "languages":
        if (!value.length) {
          return "Add at least one language";
        }
        break;

      case "bio":
        if (!value.trim()) {
          return "Bio is required";
        }

        if (value.length < 10) {
          return "Bio must be at least 10 characters";
        }

        break;

      default:
        return "";
    }

    return "";
  };

  const validateAll = () => {
    const newErrors: ErrorState = {};

    // Qualifications
    const qualificationError =
      validateField(
        "qualifications",
        qualifications
      );

    if (qualificationError) {
      newErrors.qualifications =
        qualificationError;
    }

    // Specializations
    const specializationError =
      validateField(
        "specializations",
        specializations
      );

    if (specializationError) {
      newErrors.specializations =
        specializationError;
    }

    // Experiences
    const experienceError =
      validateField(
        "experiences",
        experiences
      );

    if (experienceError) {
      newErrors.experiences =
        experienceError;
    }

    // Languages
    const languageError =
      validateField(
        "languages",
        languages
      );

    if (languageError) {
      newErrors.languages =
        languageError;
    }

    // Bio
    const bioError = validateField(
      "bio",
      bio
    );

    if (bioError) {
      newErrors.bio = bioError;
    }

    // CV Validation
    if (!cvFile && !cvUrl) {
      newErrors.cv =
        "CV / Resume is required";
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];

    if (
      cvFile &&
      !allowedTypes.includes(cvFile.type)
    ) {
      newErrors.cv =
        "Allowed: PDF, DOC, DOCX, PNG, JPG";
    }

    // Certificate Validation
    certFiles.forEach((file, index) => {
      if (
        !allowedTypes.includes(file.type)
      ) {
        newErrors[
          `cert_${index}`
        ] = `Invalid file type`;
      }
    });

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ───────────────────────────────────────────────────────────
  // Utilities
  // ───────────────────────────────────────────────────────────

  const addItem = (
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const removeItem = (
    setter: React.Dispatch<
      React.SetStateAction<string[]>
    >,
    index: number
  ) => {
    setter((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        role: "",
        organization: "",
        years: "",
      },
    ]);
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperiences((prev) =>
      prev.map((exp, i) =>
        i === index
          ? {
              ...exp,
              [field]: value,
            }
          : exp
      )
    );
  };

  const handleLanguageAdd = (
    lang: string
  ) => {
    if (
      !lang.trim() ||
      languages.some(
        (l) => l.name === lang
      )
    ) {
      return;
    }

    setLanguages([
      ...languages,
      { name: lang },
    ]);

    setLanguageInput("");
  };

  const removeLanguage = (
    index: number
  ) => {
    setLanguages(
      languages.filter(
        (_, i) => i !== index
      )
    );
  };

  // ───────────────────────────────────────────────────────────
  // Submit
  // ───────────────────────────────────────────────────────────

  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    setMessage("");

    if (!validateAll()) return;

    try {
      setLoading(true);

      if (!token) {
        setMessage("❌ User not found");
        return;
      }

      const formData = new FormData();

      qualifications.forEach((q) =>
        formData.append(
          "qualification[]",
          q
        )
      );

      specializations.forEach((s) =>
        formData.append(
          "specialization[]",
          s
        )
      );

      experiences.forEach((exp, i) => {
        formData.append(
          `experience[${i}][role]`,
          exp.role
        );

        formData.append(
          `experience[${i}][organization]`,
          exp.organization
        );

        formData.append(
          `experience[${i}][years]`,
          exp.years
        );
      });

      languages.forEach((lang) =>
        formData.append(
          "languages[]",
          lang.name
        )
      );

      formData.append("bio", bio);

      if (cvFile) {
        formData.append("cv", cvFile);
      }

      certFiles.forEach((file) =>
        formData.append(
          "certifications",
          file
        )
      );

      await nutritionistAuthService.submitDetails(
        formData,
        token
      );

      setMessage(
        "✔ Profile submitted successfully!"
      );

      router.push("/home");
    } catch (error) {
      console.error(error);

      setMessage(
        "❌ Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // JSX
  // ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100 opacity-50" />

          <div className="relative text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
              <Award size={32} />
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900">
              Become a Nutritionist
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Complete your professional
              profile and start helping
              clients achieve healthier
              lives.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >

          {/* Qualifications */}
          <Section
            title="Qualifications"
            error={errors.qualifications}
            icon={Award}
          >
            {qualifications.map(
              (qualification, index) => (
                <DynamicInput
                  key={index}
                  value={qualification}
                  placeholder="e.g. M.Sc. in Nutrition"
                  onChange={(value) => {
                    const updated = [
                      ...qualifications,
                    ];

                    updated[index] = value;

                    setQualifications(
                      updated
                    );
                  }}
                  onRemove={() =>
                    removeItem(
                      setQualifications,
                      index
                    )
                  }
                  canRemove={
                    qualifications.length > 1
                  }
                />
              )
            )}

            <AddButton
              label="Add Qualification"
              onClick={() =>
                addItem(setQualifications)
              }
            />
          </Section>

          {/* Specializations */}
          <Section
            title="Specializations"
            error={errors.specializations}
            icon={Briefcase}
          >
            <div className="flex flex-wrap gap-3">
              {NUTRITIONIST_SPECIALIZATIONS.map(
                (spec) => {
                  const isSelected =
                    specializations.includes(
                      spec
                    );

                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        setSpecializations(
                          (prev) =>
                            prev.includes(spec)
                              ? prev.filter(
                                  (s) =>
                                    s !==
                                    spec
                                )
                              : [
                                  ...prev,
                                  spec,
                                ]
                        );
                      }}
                      className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      {spec}
                    </button>
                  );
                }
              )}
            </div>
          </Section>

          {/* Experience */}
          <Section
            title="Work Experience"
            error={errors.experiences}
            icon={Briefcase}
          >
            <div className="space-y-4">
              {experiences.map(
                (exp, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      <InputField
                        placeholder="Role"
                        value={exp.role}
                        onChange={(value) =>
                          updateExperience(
                            index,
                            "role",
                            value
                          )
                        }
                      />

                      <InputField
                        placeholder="Organization"
                        value={
                          exp.organization
                        }
                        onChange={(value) =>
                          updateExperience(
                            index,
                            "organization",
                            value
                          )
                        }
                      />

                      <InputField
                        placeholder="Years"
                        value={exp.years}
                        type="text"
                        inputMode="numeric"
                        onChange={(value) => {
                          if (
                            /^\d*$/.test(
                              value
                            )
                          ) {
                            updateExperience(
                              index,
                              "years",
                              value
                            );
                          }
                        }}
                      />
                    </div>

                    {experiences.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setExperiences(
                            experiences.filter(
                              (
                                _,
                                i
                              ) =>
                                i !==
                                index
                            )
                          )
                        }
                        className="mt-3 text-sm font-semibold text-red-500 hover:text-red-600"
                      >
                        Remove Experience
                      </button>
                    )}
                  </div>
                )
              )}
            </div>

            <AddButton
              label="Add Experience"
              onClick={addExperience}
            />
          </Section>

          {/* Bio */}
          <Section
            title="About You"
            error={errors.bio}
            icon={FileText}
          >
            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              placeholder="Tell users about yourself, your experience, and your nutrition philosophy..."
              className="min-h-[160px] w-full rounded-2xl border border-gray-300 p-4 text-gray-800 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </Section>

          {/* Languages */}
          <Section
            title="Languages"
            error={errors.languages}
            icon={Globe}
          >
            <div className="flex gap-3">
              <SelectField
                value={languageInput}
                onChange={(e) =>
                  setLanguageInput(
                    e.target.value
                  )
                }
                options={
                  LANGUAGE_OPTIONS
                }
                className="flex-1"
              />

              <button
                type="button"
                onClick={() =>
                  handleLanguageAdd(
                    languageInput
                  )
                }
                className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
              >
                Add
              </button>
            </div>

            {languages.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {languages.map(
                  (lang, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
                    >
                      {lang.name}

                      <X
                        size={16}
                        className="cursor-pointer"
                        onClick={() =>
                          removeLanguage(
                            index
                          )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </Section>

          {/* Documents */}
          <Section
            title="Documents"
            icon={FileText}
          >
            <div className="grid gap-6 md:grid-cols-2">

              {/* CV */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <FileInput
                  label="Upload CV / Resume"
                  fileName={cvFileName}
                  square
                  onChange={(e: any) => {
                    const file =
                      e.target.files?.[0];

                    if (!file) return;

                    setCvFile(file);

                    setCvFileName(
                      file.name
                    );
                  }}
                />

                {errors.cv && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.cv}
                  </p>
                )}
              </div>

              {/* Certificates */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <FileInput
                  label="Upload Certifications"
                  multiple
                  square
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    if (
                      !e.target.files
                    )
                      return;

                    const files =
                      Array.from(
                        e.target.files
                      );

                    setCertFiles(
                      (prev) => [
                        ...prev,
                        ...files,
                      ]
                    );
                  }}
                />
              </div>
            </div>

            {/* Uploaded Certificates */}
            {certFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                {certFiles.map(
                  (file, index) => {
                    const fileURL =
                      URL.createObjectURL(
                        file
                      );

                    const isImage =
                      file.type.startsWith(
                        "image/"
                      );

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                      >
                        {isImage ? (
                          <img
                            src={fileURL}
                            alt="Preview"
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                            📄
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {file.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setCertFiles(
                              (
                                prev
                              ) =>
                                prev.filter(
                                  (
                                    _,
                                    i
                                  ) =>
                                    i !==
                                    index
                                )
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X
                            size={18}
                          />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </Section>

          {/* Submit */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Submit Profile
                </span>
              )}
            </PrimaryButton>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-2xl border p-4 text-center font-semibold ${
                message.startsWith("✔")
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}