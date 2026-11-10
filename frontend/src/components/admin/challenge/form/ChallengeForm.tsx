"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { adminChallengeService } from "@/services/admin/admin-challenge.service";

import ImageCropper from "./image-cropper";

import BasicInformationSection from "./sections/basic-information-section";
import ThumbnailSection from "./sections/thumbnail-section";
import ChallengeConfigurationSection from "./sections/challenge-configuration-section";
import ChallengeStructureSection from "./sections/challenge-structure-section";
import ChallengeFormActions from "./sections/challenge-form-actions";

import {
  createEmptyImageState,
  createInitialFormState,
  revokePreviewUrl,
} from "./challenge-form.utils";

import type {
  ChallengeFormProps,
  ChallengeFormState,
  CropTarget,
  ImageState,
} from "./challenge-form.types";

import {
  challengeFormSchema,
  imageFileSchema,
} from "./challenge-form.validator";

type FormField = keyof ChallengeFormState;
type FieldErrors = Partial<Record<FormField, string>>;

const parseList = (value: string): string[] =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export default function ChallengeForm({
  mode,
  challengeId,
  initialValues,
}: ChallengeFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ChallengeFormState>(() => ({
    ...createInitialFormState(),
    ...initialValues,
    category: initialValues?.category ?? "",
    difficulty: initialValues?.difficulty ?? "",
    accessType: initialValues?.accessType ?? "",
    instructions: initialValues?.instructions ?? "",
    goals: initialValues?.goals ?? [],
    benefits: initialValues?.benefits ?? [],
    tags: initialValues?.tags ?? [],
  }));

  const [goalsText, setGoalsText] = useState(
    initialValues?.goals?.join("\n") ?? "",
  );

  const [benefitsText, setBenefitsText] = useState(
    initialValues?.benefits?.join("\n") ?? "",
  );

  const [tagsText, setTagsText] = useState(
    initialValues?.tags?.join("\n") ?? "",
  );

  const [thumbnail, setThumbnail] = useState<ImageState>(() =>
    createEmptyImageState(initialValues?.thumbnailUrl),
  );

  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<FormField, boolean>>
  >({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    return () => {
      revokePreviewUrl(thumbnail.previewUrl);
    };
  }, [thumbnail.previewUrl]);

  const handleGoalsBlur = (value: string) => {
    setTouchedFields((previous) => ({
      ...previous,
      goals: true,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      goals: validateField("goals", parseList(value)),
    }));
  };

  const validateField = (
    field: FormField,
    value: unknown,
  ): string | undefined => {
    let result;

    switch (field) {
      case "title":
        result = challengeFormSchema.shape.title.safeParse(value);
        break;
      case "description":
        result = challengeFormSchema.shape.description.safeParse(value);
        break;
      case "instructions":
        result = challengeFormSchema.shape.instructions.safeParse(value);
        break;
      case "category":
        result = challengeFormSchema.shape.category.safeParse(value);
        break;
      case "difficulty":
        result = challengeFormSchema.shape.difficulty.safeParse(value);
        break;
      case "accessType":
        result = challengeFormSchema.shape.accessType.safeParse(value);
        break;
      case "durationDays":
        result = challengeFormSchema.shape.durationDays.safeParse(value);
        break;
      case "goals":
        result = challengeFormSchema.shape.goals.safeParse(value);
        break;
      case "benefits":
        result = challengeFormSchema.shape.benefits.safeParse(value);
        break;
      case "tags":
        result = challengeFormSchema.shape.tags.safeParse(value);
        break;
    }

    return result.success ? undefined : result.error.issues[0]?.message;
  };

  const updateField = <K extends keyof ChallengeFormState>(
    field: K,
    value: ChallengeFormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (touchedFields[field] || hasSubmitted) {
      setFieldErrors((previous) => ({
        ...previous,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleFieldBlur = (field: FormField, value: unknown) => {
    setTouchedFields((previous) => ({
      ...previous,
      [field]: true,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [field]: validateField(field, value),
    }));
  };

  const handleImageSelection = (file: File) => {
    const result = imageFileSchema.safeParse(file);

    if (!result.success) {
      setImageError(result.error.issues[0]?.message ?? "Invalid image file.");
      return;
    }

    setImageError(null);
    setCropTarget({ file });
  };

  const handleCropComplete = (file: File) => {
    setThumbnail((previous) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      existingUrl: previous.existingUrl,
      removed: false,
    }));

    setCropTarget(null);
  };

  const handleRemoveThumbnail = () => {
    setThumbnail({
      file: null,
      previewUrl: null,
      existingUrl: null,
      removed: true,
    });

    setImageError(null);
  };

  const handleGoalsChange = (value: string) => {
    setGoalsText(value);

    const goals = parseList(value);

    if (touchedFields.goals || hasSubmitted) {
      setFieldErrors((previous) => ({
        ...previous,
        goals: validateField("goals", goals),
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError(null);
    setHasSubmitted(true);

    if (imageError) {
      setError("Please fix the thumbnail validation error before saving.");
      return;
    }

    if (mode === "edit" && !challengeId) {
      setError("Challenge ID is required.");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      instructions: form.instructions.trim(),
      goals: parseList(goalsText),
      benefits: parseList(benefitsText),
      tags: parseList(tagsText),
    };

    const validation = challengeFormSchema.safeParse(payload);

    if (!validation.success) {
      const errors: FieldErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          field in payload &&
          !errors[field as FormField]
        ) {
          errors[field as FormField] = issue.message;
        }
      }

      setFieldErrors(errors);
      setError("Please correct the highlighted fields before saving.");
      return;
    }

    setFieldErrors({});
    const validatedData = validation.data;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", validatedData.title);
      formData.append("description", validatedData.description);

      if (validatedData.instructions) {
        formData.append("instructions", validatedData.instructions);
      }

      formData.append("category", validatedData.category);
      formData.append("difficulty", validatedData.difficulty);
      formData.append("accessType", validatedData.accessType);
      formData.append("durationDays", String(validatedData.durationDays));

      formData.append("goals", JSON.stringify(validatedData.goals));
      formData.append("benefits", JSON.stringify(validatedData.benefits));
      formData.append("tags", JSON.stringify(validatedData.tags));

      if (thumbnail.file) {
        formData.append("thumbnail", thumbnail.file);
      }

      if (mode === "edit") {
        if (!challengeId) {
          throw new Error("Challenge ID is required.");
        }

        if (thumbnail.removed) {
          formData.append("removeThumbnail", "true");
        }

        await adminChallengeService.updateChallenge(challengeId, formData);
      } else {
        await adminChallengeService.createChallenge(formData);
      }

      router.push(
        mode === "create"
          ? "/admin/challenges"
          : `/admin/challenges/${challengeId}`,
      );

      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        mode === "create"
          ? "Failed to create challenge. Please verify your inputs and try again."
          : "Failed to update challenge. Please verify your inputs and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(
      mode === "edit" && challengeId
        ? `/admin/challenges/${challengeId}`
        : "/admin/challenges",
    );
  };

  return (
    <>
      {cropTarget && (
        <ImageCropper
          target={cropTarget}
          onDone={handleCropComplete}
          onCancel={() => setCropTarget(null)}
        />
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl space-y-6"
      >
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {error}
          </div>
        )}

        <BasicInformationSection
          title={form.title}
          description={form.description}
          instructions={form.instructions}
          errors={{
            title: fieldErrors.title,
            description: fieldErrors.description,
            instructions: fieldErrors.instructions,
          }}
          onChange={(field, value) => updateField(field, value)}
          onBlur={handleFieldBlur}
        />

        <ThumbnailSection
          thumbnail={thumbnail}
          imageError={imageError}
          disabled={loading}
          onSelect={handleImageSelection}
          onRemove={handleRemoveThumbnail}
        />

        <ChallengeConfigurationSection
          form={form}
          errors={{
            category: fieldErrors.category,
            difficulty: fieldErrors.difficulty,
            accessType: fieldErrors.accessType,
            durationDays: fieldErrors.durationDays,
          }}
          onChange={updateField}
          onBlur={handleFieldBlur}
        />

        <ChallengeStructureSection
          goals={goalsText}
          benefits={benefitsText}
          tags={tagsText}
          durationDays={form.durationDays}
          goalsError={fieldErrors.goals}
          onGoalsChange={handleGoalsChange}
          onGoalsBlur={handleGoalsBlur}
          onBenefitsChange={setBenefitsText}
          onTagsChange={setTagsText}
        />

        <ChallengeFormActions
          mode={mode}
          loading={loading}
          onCancel={handleCancel}
        />
      </form>
    </>
  );
}
