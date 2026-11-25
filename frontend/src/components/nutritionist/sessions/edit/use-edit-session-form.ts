
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import type { SessionPricingType } from "@/constants/common/session.constants";
import { SESSION_LIMITS } from "@/constants/common/session-limits.constants";
import {
  SESSION_IMAGE_TYPES,
  toLocalDateTimeInputValue,
} from "@/components/nutritionist/sessions/shared/session-form.constants";

import type { UpdateNutriSessionDTO } from "@/dtos/nutritionist/session/update-session.dto";
import { nutriSessionService } from "@/services/nutritionist/nutri-session.service";

import {
  getUpdateSessionFieldErrors,
  type UpdateSessionFieldErrors,
  type UpdateSessionFieldName,
} from "@/validations/nutritionist/session/update-session.schema";

import { sessionDetailsCache } from "@/utils/nutritionist/session-details-cache";

import type { EditSessionFormState } from "./edit-session.types";

type EditableSessionField =
  | "title"
  | "description"
  | "type"
  | "scheduledAt"
  | "durationInMinutes"
  | "maxParticipants";

export function useEditSessionForm(sessionId: string) {
  const router = useRouter();

  const originalScheduledAtRef = useRef("");
  const previewRef = useRef<string | null>(null);

  const [form, setForm] = useState<EditSessionFormState | null>(null);

  const [originalThumbnailUrl, setOriginalThumbnailUrl] = useState<
    string | undefined
  >();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [errors, setErrors] = useState<UpdateSessionFieldErrors>({});
  const [touched, setTouched] = useState<Set<UpdateSessionFieldName>>(
    () => new Set(),
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [minDateTime, setMinDateTime] = useState(() =>
    toLocalDateTimeInputValue(new Date()),
  );

  // Replace the existing preview and release its object URL.
  const replacePreview = useCallback((nextPreview: string | null) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    previewRef.current = nextPreview;
    setLocalPreview(nextPreview);
  }, []);

  // Load session details.
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setLoadError("Session not found.");
      return;
    }

    let cancelled = false;

    const loadSession = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        setForm(null);

        const response =
          await nutriSessionService.getSessionDetails(sessionId);

        if (cancelled) return;

        const session = response.data;

        if (!session) {
          throw new Error("Session details are missing.");
        }

        const scheduledDate = new Date(session.scheduledAt);

        if (!Number.isFinite(scheduledDate.getTime())) {
          throw new Error("Invalid session schedule.");
        }

        const scheduledAt =
          toLocalDateTimeInputValue(scheduledDate);

        originalScheduledAtRef.current = scheduledAt;

        setForm({
          title: session.title,
          description: session.description,
          type: session.type,
          pricing: {
            type: session.pricingType,
            amount: session.pricing?.amount ?? 0,
            currency: "inr",
          },
          scheduledAt,
          durationInMinutes: session.duration,
          maxParticipants: session.maxParticipants,
        });

        setOriginalThumbnailUrl(session.thumbnailUrl);

        setThumbnailFile(null);
        replacePreview(null);
        setThumbnailError(null);

        setErrors({});
        setTouched(new Set());
        setSubmitted(false);
        setSubmitError(null);
      } catch {
        if (!cancelled) {
          setLoadError("Unable to load this session.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId, replacePreview]);

  // Refresh the minimum selectable date every minute.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMinDateTime(toLocalDateTimeInputValue(new Date()));
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  // Release the preview URL when the hook unmounts.
  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  const validateForm = useCallback(
    (values: EditSessionFormState) =>
      getUpdateSessionFieldErrors(
        values,
        originalScheduledAtRef.current,
      ),
    [],
  );

  const updateForm = useCallback(
    (next: EditSessionFormState, field: UpdateSessionFieldName) => {
      setForm(next);

      setTouched((previous) => new Set(previous).add(field));

      setErrors(validateForm(next));
      setSubmitError(null);
    },
    [validateForm],
  );

  // Update non-nested form fields.
  const setField = useCallback(
    <K extends EditableSessionField>(
      field: K,
      value: EditSessionFormState[K],
    ) => {
      if (!form) return;

      updateForm(
        {
          ...form,
          [field]: value,
        },
        field,
      );
    },
    [form, updateForm],
  );

  // Update pricing type.
  const handlePricingType = useCallback(
    (type: SessionPricingType) => {
      if (!form) return;

      updateForm(
        {
          ...form,
          pricing: {
            ...form.pricing,
            type,
            amount: type === "free" ? 0 : form.pricing.amount,
            currency: "inr",
          },
        },
        "pricingType",
      );
    },
    [form, updateForm],
  );

  // Update pricing amount.
  const handlePriceChange = useCallback(
    (rawValue: string) => {
      if (!form) return;

      updateForm(
        {
          ...form,
          pricing: {
            ...form.pricing,
            amount: rawValue === "" ? Number.NaN : Number(rawValue),
            currency: "inr",
          },
        },
        "pricingAmount",
      );
    },
    [form, updateForm],
  );

  // Validate and store a replacement thumbnail.
  const handleThumbnailPick = useCallback(
    (file: File | null) => {
      if (!file) return;

      setSubmitError(null);

      const isAllowedType = SESSION_IMAGE_TYPES.some(
        (type) => type === file.type,
      );

      if (!isAllowedType) {
        setThumbnailError("Choose a JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > SESSION_LIMITS.thumbnailMaxBytes) {
        setThumbnailError("The thumbnail must be 5 MB or smaller.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setThumbnailFile(file);
      replacePreview(previewUrl);
      setThumbnailError(null);
    },
    [replacePreview],
  );

  // Restore the original server thumbnail.
  const clearNewThumbnail = useCallback(() => {
    setThumbnailFile(null);
    replacePreview(null);
    setThumbnailError(null);
    setSubmitError(null);
  }, [replacePreview]);

  const showError = useCallback(
    (field: UpdateSessionFieldName) =>
      submitted || touched.has(field) ? errors[field] : undefined,
    [errors, submitted, touched],
  );

  // Submit updated session details.
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form || submitting) return;

    setSubmitted(true);

    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0 || thumbnailError) {
      return;
    }

    const scheduledDate = new Date(form.scheduledAt);

    if (!Number.isFinite(scheduledDate.getTime())) {
      setErrors((previous) => ({
        ...previous,
        scheduledAt: "Choose a valid date and time.",
      }));

      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const dto: UpdateNutriSessionDTO = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        pricingType: form.pricing.type,
        pricing: {
          amount:
            form.pricing.type === "free" ? 0 : form.pricing.amount,
          currency: "inr",
        },
        scheduledAt: scheduledDate.toISOString(),
        duration: form.durationInMinutes,
        maxParticipants: form.maxParticipants,
      };

      await nutriSessionService.updateSession(
        sessionId,
        dto,
        thumbnailFile ?? undefined,
      );

      sessionDetailsCache.invalidate(sessionId);

      router.push(`/nutritionist/sessions/${sessionId}`);
    } catch {
      setSubmitError("Couldn't save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const cancel = useCallback(() => {
    router.push(`/nutritionist/sessions/${sessionId}`);
  }, [router, sessionId]);

  return {
    form,
    originalThumbnailUrl,
    localPreview,
    thumbnailError,
    loading,
    loadError,
    submitting,
    submitError,
    minDateTime,
    isOriginalSchedule:
      form?.scheduledAt === originalScheduledAtRef.current,
    showError,
    setField,
    handlePricingType,
    handlePriceChange,
    handleThumbnailPick,
    clearNewThumbnail,
    handleSubmit,
    goBack,
    cancel,
  };
}
