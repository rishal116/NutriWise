"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { X, Award, Briefcase, Globe, FileText } from "lucide-react";

import { userAuthService } from "@/services/user/userAuth.service";
import { nutritionistApplicationService } from "@/services/nutritionist/nutriApplication.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

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

interface Experience {
  role: string;
  organization: string;
  years: string;
}

interface Language {
  name: string;
}

type ErrorState = Record<string, string>;

const DEFAULT_EXPERIENCE: Experience = {
  role: "",
  organization: "",
  years: "",
};

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function NutritionistDetailsPage() {
  const router = useRouter();

  const initialized = useAppSelector((state) => state.auth.initialized);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [qualifications, setQualifications] = useState<string[]>([""]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([
    { ...DEFAULT_EXPERIENCE },
  ]);
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
  const [initializing, setInitializing] = useState(true);
  const [message, setMessage] = useState("");

  const initialize = useCallback(async () => {
    if (!initialized) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/nutritionist/details");
      return;
    }

    try {
      const response = await userAuthService.getMe();
      const user = response.data;

      if (!user) {
        throw new Error("Unable to retrieve your account details.");
      }

      const status = user.nutritionistStatus;

      if (status === "approved") {
        router.replace("/nutritionist/dashboard");
        return;
      }

      if (status === "pending") {
        router.replace("/nutritionist/pending");
        return;
      }

      if (status === "rejected") {
        const details =
          await nutritionistApplicationService.getApplicationDetails();

        setQualifications(
          details.qualifications.length
            ? details.qualifications.map(
                (qualification) => qualification.degree,
              )
            : [""],
        );

        setSpecializations(details.specializations);

        setExperiences(
          details.experiences.length
            ? details.experiences.map((experience) => ({
                role: experience.role,
                organization: experience.organization,
                years: String(experience.durationYears),
              }))
            : [{ ...DEFAULT_EXPERIENCE }],
        );

        setLanguages(details.languages.map((language) => ({ name: language })));

        setBio(details.bio ?? "");
        setCvUrl(details.resumeUrl || null);

        setCertUrls(
          details.certifications
            .map((certification) => certification.certificateUrl)
            .filter((url): url is string => Boolean(url)),
        );
      }
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setInitializing(false);
    }
  }, [initialized, isAuthenticated, router]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const validateField = (
    name: string,
    value: string[] | Experience[] | Language[] | string,
  ): string => {
    switch (name) {
      case "qualifications": {
        const items = value as string[];

        if (!items.length || items.some((item) => !item.trim())) {
          return "All qualifications are required.";
        }
        break;
      }

      case "specializations": {
        if (!(value as string[]).length) {
          return "Select at least one specialization.";
        }
        break;
      }

      case "experiences": {
        const items = value as Experience[];

        for (const experience of items) {
          if (
            !experience.role.trim() ||
            !experience.organization.trim() ||
            !experience.years.trim()
          ) {
            return "Complete all experience fields.";
          }

          const years = Number(experience.years);

          if (!Number.isFinite(years) || years < 0) {
            return "Years of experience must be a valid non-negative number.";
          }
        }
        break;
      }

      case "languages": {
        if (!(value as Language[]).length) {
          return "Add at least one language.";
        }
        break;
      }

      case "bio": {
        const text = value as string;

        if (!text.trim()) return "Bio is required.";
        if (text.trim().length < 10) {
          return "Bio must be at least 10 characters.";
        }
        break;
      }

      default:
        return "";
    }

    return "";
  };

  const validateFile = (file: File): string => {
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return "Allowed formats: PDF, DOC, DOCX, PNG, JPG.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must not exceed 5 MB.";
    }

    return "";
  };

  const validateAll = (): boolean => {
    const nextErrors: ErrorState = {};

    const fields: {
      name: string;
      value: string[] | Experience[] | Language[] | string;
    }[] = [
      { name: "qualifications", value: qualifications },
      { name: "specializations", value: specializations },
      { name: "experiences", value: experiences },
      { name: "languages", value: languages },
      { name: "bio", value: bio },
    ];

    fields.forEach(({ name, value }) => {
      const error = validateField(name, value);
      if (error) nextErrors[name] = error;
    });

    if (!cvFile && !cvUrl) {
      nextErrors.cv = "CV / Resume is required.";
    }

    if (cvFile) {
      const error = validateFile(cvFile);
      if (error) nextErrors.cv = error;
    }

    certFiles.forEach((file, index) => {
      const error = validateFile(file);
      if (error) nextErrors[`cert_${index}`] = error;
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((previous) => [...previous, ""]);
  };

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setter((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addExperience = () => {
    setExperiences((previous) => [...previous, { ...DEFAULT_EXPERIENCE }]);
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    setExperiences((previous) =>
      previous.map((experience, itemIndex) =>
        itemIndex === index ? { ...experience, [field]: value } : experience,
      ),
    );
  };

  const handleLanguageAdd = () => {
    const name = languageInput.trim();

    if (
      !name ||
      languages.some(
        (language) => language.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      return;
    }

    const updated = [...languages, { name }];

    setLanguages(updated);
    setLanguageInput("");
    setErrors((previous) => ({
      ...previous,
      languages: validateField("languages", updated),
    }));
  };

  const removeLanguage = (index: number) => {
    const updated = languages.filter((_, itemIndex) => itemIndex !== index);

    setLanguages(updated);
    setErrors((previous) => ({
      ...previous,
      languages: validateField("languages", updated),
    }));
  };

  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const error = validateFile(file);

    if (error) {
      setErrors((previous) => ({ ...previous, cv: error }));
      event.target.value = "";
      return;
    }

    setCvFile(file);
    setCvFileName(file.name);
    setErrors((previous) => ({ ...previous, cv: "" }));
  };

  const handleCertFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (!selectedFiles.length) return;

    const validFiles: File[] = [];
    const nextErrors: ErrorState = {};

    selectedFiles.forEach((file) => {
      const error = validateFile(file);

      if (error) {
        nextErrors[`cert_${certFiles.length + validFiles.length}`] =
          `${file.name}: ${error}`;
      } else {
        validFiles.push(file);
      }
    });

    setCertFiles((previous) => [...previous, ...validFiles]);
    setErrors((previous) => {
      const updated = { ...previous };

      Object.keys(updated).forEach((key) => {
        if (key.startsWith("cert_")) delete updated[key];
      });

      return { ...updated, ...nextErrors };
    });

    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");

    if (loading) return;

    if (!accessToken) {
      setMessage("Your session has expired. Please log in again.");
      router.replace("/login?redirect=/nutritionist/details");
      return;
    }

    if (!validateAll()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      qualifications.forEach((qualification) => {
        formData.append("qualification[]", qualification.trim());
      });

      specializations.forEach((specialization) => {
        formData.append("specialization[]", specialization);
      });

      experiences.forEach((experience, index) => {
        formData.append(`experience[${index}][role]`, experience.role.trim());
        formData.append(
          `experience[${index}][organization]`,
          experience.organization.trim(),
        );
        formData.append(`experience[${index}][years]`, experience.years);
      });

      languages.forEach((language) => {
        formData.append("languages[]", language.name);
      });

      formData.append("bio", bio.trim());

      if (cvFile) formData.append("cv", cvFile);

      certFiles.forEach((file) => {
        formData.append("certifications", file);
      });

      await nutritionistApplicationService.submitApplication(formData);

      setMessage("Application submitted successfully.");
      router.replace("/nutritionist/pending");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const openFile = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!initialized || initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-50/60">
        <p className="text-sm font-medium text-emerald-700">
          Loading your application...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl border-t-4 border-emerald-600 bg-white p-8 shadow-xl">
          <div className="space-y-3 text-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Award className="text-emerald-600" size={32} />
            </div>

            <h1 className="text-4xl font-bold text-gray-800">
              Nutritionist Profile
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Complete your professional details to start providing
              consultations and help clients achieve their health goals.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Section
            title="Qualifications"
            error={errors.qualifications}
            icon={Award}
          >
            {qualifications.map((qualification, index) => (
              <DynamicInput
                key={index}
                value={qualification}
                placeholder="e.g., M.Sc. in Nutrition and Dietetics"
                onChange={(value) => {
                  const updated = qualifications.map((item, itemIndex) =>
                    itemIndex === index ? value : item,
                  );

                  setQualifications(updated);
                  setErrors((previous) => ({
                    ...previous,
                    qualifications: validateField("qualifications", updated),
                  }));
                }}
                onRemove={() => removeItem(setQualifications, index)}
                canRemove={qualifications.length > 1}
              />
            ))}

            <AddButton
              label="Add Another Qualification"
              onClick={() => addItem(setQualifications)}
            />
          </Section>

          <Section
            title="Specializations"
            error={errors.specializations}
            icon={Briefcase}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {NUTRITIONIST_SPECIALIZATIONS.map((specialization) => {
                const selected = specializations.includes(specialization);

                return (
                  <button
                    key={specialization}
                    type="button"
                    aria-pressed={selected}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-300 bg-gray-100 text-gray-800 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}
                    onClick={() => {
                      const updated = selected
                        ? specializations.filter(
                            (item) => item !== specialization,
                          )
                        : [...specializations, specialization];

                      setSpecializations(updated);
                      setErrors((previous) => ({
                        ...previous,
                        specializations: validateField(
                          "specializations",
                          updated,
                        ),
                      }));
                    }}
                  >
                    {specialization}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section
            title="Work Experience"
            error={errors.experiences}
            icon={Briefcase}
          >
            {experiences.map((experience, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <InputField
                    placeholder="Role / Position"
                    value={experience.role}
                    onChange={(value) => updateExperience(index, "role", value)}
                  />

                  <InputField
                    placeholder="Organization / Hospital"
                    value={experience.organization}
                    onChange={(value) =>
                      updateExperience(index, "organization", value)
                    }
                  />

                  <InputField
                    type="text"
                    inputMode="numeric"
                    placeholder="Years"
                    value={experience.years}
                    onChange={(value) => {
                      if (/^\d*$/.test(value)) {
                        updateExperience(index, "years", value);
                      }
                    }}
                  />
                </div>

                {experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = experiences.filter(
                        (_, itemIndex) => itemIndex !== index,
                      );

                      setExperiences(updated);
                      setErrors((previous) => ({
                        ...previous,
                        experiences: validateField("experiences", updated),
                      }));
                    }}
                    className="text-sm font-medium text-red-600 transition hover:text-red-700"
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
              onChange={(event) => {
                const value = event.target.value;

                setBio(value);
                setErrors((previous) => ({
                  ...previous,
                  bio: validateField("bio", value),
                }));
              }}
              placeholder="Describe yourself, your philosophy, goals, and what makes you unique as a nutritionist..."
              className="min-h-[140px] w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:ring-2 focus:ring-emerald-500"
            />
          </Section>

          <Section title="Languages" error={errors.languages} icon={Globe}>
            <div className="flex gap-3">
              <SelectField
                value={languageInput}
                onChange={(event) => setLanguageInput(event.target.value)}
                options={LANGUAGE_OPTIONS}
                className="flex-1"
              />

              <button
                type="button"
                onClick={handleLanguageAdd}
                className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Add
              </button>
            </div>

            {languages.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map((language, index) => (
                  <span
                    key={language.name}
                    className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-medium text-emerald-800"
                  >
                    {language.name}

                    <button
                      type="button"
                      aria-label={`Remove ${language.name}`}
                      onClick={() => removeLanguage(index)}
                      className="hover:text-emerald-950"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Section>

          <Section title="Documents" icon={FileText}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <FileInput
                  label="Upload CV / Resume (Required)"
                  fileName={cvFileName}
                  square
                  onChange={handleCvChange}
                />

                {errors.cv && (
                  <p className="mt-1 text-sm font-medium text-red-600">
                    {errors.cv}
                  </p>
                )}

                {(cvFile || cvUrl) && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      CV / Resume
                    </p>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      {cvFile ? (
                        <span className="flex-1 truncate text-sm">
                          {cvFile.name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => cvUrl && openFile(cvUrl)}
                          className="flex-1 text-left text-sm hover:underline"
                        >
                          View uploaded CV
                        </button>
                      )}

                      <button
                        type="button"
                        aria-label="Remove CV"
                        onClick={() => {
                          setCvFile(null);
                          setCvFileName("");
                          setCvUrl(null);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <FileInput
                  label="Upload Certifications (Optional)"
                  multiple
                  square
                  onChange={handleCertFilesChange}
                />

                {Object.entries(errors)
                  .filter(([key]) => key.startsWith("cert_"))
                  .map(([key, error]) => (
                    <p key={key} className="mt-1 text-sm text-red-600">
                      {error}
                    </p>
                  ))}

                {certUrls.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Existing Certifications
                    </p>

                    {certUrls.map((url, index) => (
                      <div
                        key={url}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <button
                          type="button"
                          onClick={() => openFile(url)}
                          className="flex-1 text-left text-sm hover:underline"
                        >
                          View Certification {index + 1}
                        </button>

                        <button
                          type="button"
                          aria-label={`Remove certification ${index + 1}`}
                          onClick={() =>
                            setCertUrls((previous) =>
                              previous.filter((item) => item !== url),
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {certFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      New Certifications
                    </p>

                    {certFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <FileText
                          size={20}
                          className="shrink-0 text-emerald-600"
                        />

                        <span className="flex-1 truncate text-sm text-gray-800">
                          {file.name}
                        </span>

                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => {
                            setCertFiles((previous) =>
                              previous.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            );

                            setErrors((previous) => {
                              const updated: ErrorState = {};

                              Object.entries(previous).forEach(
                                ([key, value]) => {
                                  if (!key.startsWith("cert_")) {
                                    updated[key] = value;
                                  }
                                },
                              );

                              return updated;
                            });
                          }}
                          className="text-gray-400 transition hover:text-red-500"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>

          <div className="pt-4">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Submitting Your Profile..." : "Submit Profile"}
            </PrimaryButton>
          </div>

          {message && (
            <div
              role="status"
              className={`rounded-lg border p-4 text-center font-medium ${
                message.toLowerCase().includes("successfully")
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
