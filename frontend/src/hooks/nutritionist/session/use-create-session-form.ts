"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { SessionPricingType } from "@/constants/common/session.constants";
import { SESSION_LIMITS } from "@/constants/common/session-limits.constants";
import type { CreateNutriSessionDTO } from "@/dtos/nutritionist/session/create-session.dto";
import { nutriSessionService } from "@/services/nutritionist/nutri-session.service";
import { getErrorMessage } from "@/utils/getErrorMessage";

import {
  getCreateSessionFieldErrors,
  createSessionSchema,
  type CreateSessionFieldErrors,
  type CreateSessionFieldName,
} from "@/validations/nutritionist/session/create-session.schema";

import { SESSION_IMAGE_TYPES } from "@/components/nutritionist/sessions/shared/session-form.constants";

import {
  INITIAL_SESSION_FORM,
  type SessionFormState,
} from "@/components/nutritionist/sessions/create/create-session.constants";

export function useCreateSessionForm() {
  const router = useRouter();

  const previewRef = useRef<string | null>(null);

  const [form, setForm] = useState<SessionFormState>({
    ...INITIAL_SESSION_FORM,
    pricing: { ...INITIAL_SESSION_FORM.pricing },
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<CreateSessionFieldErrors>({});
  const [touched, setTouched] = useState<Set<CreateSessionFieldName>>(
    () => new Set(),
  );

  const [submitted, setSubmitted] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  const replaceThumbnailPreview = (preview: string | null) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    previewRef.current = preview;
    setThumbnailPreview(preview);
  };

  const updateForm = (
    next: SessionFormState,
    field: CreateSessionFieldName,
  ) => {
    setForm(next);

    setTouched((previous) => new Set(previous).add(field));

    setErrors(getCreateSessionFieldErrors(next));
    setSubmitError(null);
  };

  const setBasicField = <K extends "title" | "description" | "type">(
    field: K,
    value: SessionFormState[K],
  ) => {
    updateForm(
      {
        ...form,
        [field]: value,
      },
      field,
    );
  };

  const setScheduledAt = (value: string) => {
    updateForm(
      {
        ...form,
        scheduledAt: value,
      },
      "scheduledAt",
    );
  };

  const setNumericField = (
    field: "duration" | "maxParticipants",
    rawValue: string,
  ) => {
    const value = rawValue === "" ? Number.NaN : Number(rawValue);

    const next: SessionFormState = {
      ...form,
      [field]: value,
    };

    updateForm(next, field);
  };

  const setPricingType = (pricingType: SessionPricingType) => {
    const next: SessionFormState = {
      ...form,
      pricingType,
      pricing: {
        ...form.pricing,
        amount: pricingType === "free" ? 0 : form.pricing.amount,
      },
    };

    updateForm(next, "pricingType");
  };

  const setPrice = (rawValue: string) => {
    const amount = rawValue === "" ? Number.NaN : Number(rawValue);

    updateForm(
      {
        ...form,
        pricing: {
          ...form.pricing,
          amount,
        },
      },
      "pricingAmount",
    );
  };

  const setThumbnail = (file: File | null) => {
    if (!file) return;

    const isAllowedType = SESSION_IMAGE_TYPES.some(
      (type) => type === file.type,
    );

    if (!isAllowedType) {
      setThumbnailError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > SESSION_LIMITS.thumbnailMaxBytes) {
      setThumbnailError("Image size cannot exceed 5 MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setThumbnailFile(file);
    replaceThumbnailPreview(preview);

    setThumbnailError(null);
    setSubmitError(null);
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    replaceThumbnailPreview(null);

    setThumbnailError(null);
    setSubmitError(null);
  };

  const showError = (field: CreateSessionFieldName) =>
    submitted || touched.has(field) ? errors[field] : undefined;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitted(true);
    setSubmitError(null);

    const result = createSessionSchema.safeParse(form);
    const fieldErrors = getCreateSessionFieldErrors(form);

    setErrors(fieldErrors);

    if (!result.success || thumbnailError) {
      return;
    }

    setSubmitting(true);

    try {
      const { pricingType, pricing, ...sessionDetails } = result.data;

      const dto: CreateNutriSessionDTO = {
        ...sessionDetails,
        pricingType,
        ...(pricingType === "paid" ? { pricing } : {}),
        scheduledAt: new Date(result.data.scheduledAt).toISOString(),
      };

      await nutriSessionService.createSession(dto, thumbnailFile);

      router.push("/nutritionist/sessions");
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    showError,
    thumbnailPreview,
    thumbnailError,
    submitting,
    submitError,
    setBasicField,
    setScheduledAt,
    setNumericField,
    setPricingType,
    setPrice,
    setThumbnail,
    clearThumbnail,
    submit,
    cancel: () => router.back(),
  };
}
