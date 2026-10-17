"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";

import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import type { UpdateNutriSessionDTO } from "@/dtos/nutritionist/session/update-session.dto";
import type {
  SessionPricingType,
  SessionType,
} from "@/types/nutritionist/session/session.types";
import {
  getUpdateSessionFieldErrors,
  type UpdateSessionFieldErrors,
  type UpdateSessionFieldName,
} from "@/validations/nutritionist/session/update-session.schema";
import { sessionDetailsCache } from "@/utils/nutritionist/session-details-cache";

const TYPE_OPTIONS: { value: SessionType; label: string }[] = [
  { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" },
  { value: "group_consultation", label: "Group Consultation" },
  { value: "qna", label: "Q&A" },
  { value: "seminar", label: "Seminar" },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

interface EditFormState {
  title: string;
  description: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount: number;
    currency: "inr";
  };
  scheduledAt: string;
  durationInMinutes: number;
  maxParticipants?: number;
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

const errCls = "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20";

const labelCls = "mb-2 block text-sm font-semibold text-slate-700";

const sectionLabelCls =
  "mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500";

function toLocalDateTimeInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const ids = useId();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const originalScheduledAtRef = useRef("");

  const [form, setForm] = useState<EditFormState | null>(null);
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

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const session = await nutriSessionService.getSessionDetails(sessionId);

        if (cancelled) return;

        const scheduledAt = toLocalDateTimeInputValue(
          new Date(session.scheduledAt),
        );

        originalScheduledAtRef.current = scheduledAt;

        setForm({
          title: session.title,
          description: session.description,
          type: session.type,
          pricing: {
            type: session.pricing.type,
            amount: session.pricing.amount,
            currency: "inr",
          },
          scheduledAt,
          durationInMinutes: session.durationInMinutes,
          maxParticipants: session.maxParticipants,
        });

        setOriginalThumbnailUrl(session.thumbnailUrl);
        setErrors({});
        setTouched(new Set());
        setSubmitted(false);
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

    void load();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMinDateTime(toLocalDateTimeInputValue(new Date()));
    }, 60_000);

    return () => clearInterval(intervalId);
  }, []);

  const validateForm = (next: EditFormState) =>
    getUpdateSessionFieldErrors(next, originalScheduledAtRef.current);

  const updateForm = (next: EditFormState, field: UpdateSessionFieldName) => {
    setForm(next);
    setTouched((previous) => new Set(previous).add(field));
    setErrors(validateForm(next));
    setSubmitError(null);
  };

  const setField = <K extends keyof EditFormState>(
    field: K,
    value: EditFormState[K],
  ) => {
    if (!form) return;

    updateForm(
      {
        ...form,
        [field]: value,
      },
      field as UpdateSessionFieldName,
    );
  };

  const handlePricingType = (type: SessionPricingType) => {
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
      "pricingAmount",
    );
  };

  const handlePriceChange = (rawValue: string) => {
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
  };

  const handleScheduledAtChange = (value: string) => {
    if (!form) return;

    updateForm(
      {
        ...form,
        scheduledAt: value,
      },
      "scheduledAt",
    );
  };

  const showError = (field: UpdateSessionFieldName) =>
    submitted || touched.has(field) ? errors[field] : undefined;

  const handleThumbnailPick = (file: File | null) => {
    if (!file) return;

    setSubmitError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setThumbnailError("Choose a JPG, PNG, or WebP image.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      setThumbnailError("The thumbnail must be 5 MB or smaller.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setThumbnailError(null);
    setThumbnailFile(file);
    setLocalPreview(URL.createObjectURL(file));
  };

  const clearNewThumbnail = () => {
    setThumbnailFile(null);
    setLocalPreview(null);
    setThumbnailError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form || submitting) return;

    setSubmitted(true);

    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0 || thumbnailError) {
      return;
    }

    if (!Number.isFinite(new Date(form.scheduledAt).getTime())) {
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
        pricing: {
          type: form.pricing.type,
          amount: form.pricing.type === "free" ? 0 : form.pricing.amount,
          currency: "inr",
        },
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationInMinutes: form.durationInMinutes,
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

  const errText = (message?: string, id?: string) =>
    message ? (
      <p
        id={id}
        className="mt-1.5 text-xs font-medium text-rose-600"
        role="alert"
      >
        {message}
      </p>
    ) : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-11 w-full animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (loadError || !form) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
          {loadError ?? "Session not found."}
        </div>
      </div>
    );
  }

  const titleError = showError("title");
  const descriptionError = showError("description");
  const scheduledAtError = showError("scheduledAt");
  const durationError = showError("durationInMinutes");
  const participantsError = showError("maxParticipants");
  const priceError = showError("pricingAmount");

  const displaySrc = localPreview ?? originalThumbnailUrl ?? null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Edit Session
          </p>

          <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {form.title || "Untitled session"}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="divide-y divide-slate-100"
      >
        <section className="space-y-5 pb-8">
          <h2 className={sectionLabelCls}>Basic Details</h2>

          <div>
            <label htmlFor={`${ids}-title`} className={labelCls}>
              Session Title
            </label>

            <input
              id={`${ids}-title`}
              value={form.title}
              maxLength={100}
              onChange={(event) => setField("title", event.target.value)}
              aria-invalid={!!titleError}
              aria-describedby={titleError ? `${ids}-title-err` : undefined}
              className={`${inputCls} ${titleError ? errCls : ""}`}
            />

            {errText(titleError, `${ids}-title-err`)}
          </div>

          <div>
            <label htmlFor={`${ids}-desc`} className={labelCls}>
              Description
            </label>

            <textarea
              id={`${ids}-desc`}
              value={form.description}
              rows={5}
              maxLength={2000}
              onChange={(event) => setField("description", event.target.value)}
              aria-invalid={!!descriptionError}
              aria-describedby={
                descriptionError ? `${ids}-desc-err` : undefined
              }
              className={`${inputCls} ${descriptionError ? errCls : ""}`}
            />

            {errText(descriptionError, `${ids}-desc-err`)}
          </div>

          <div>
            <label htmlFor={`${ids}-type`} className={labelCls}>
              Session Type
            </label>

            <select
              id={`${ids}-type`}
              value={form.type}
              onChange={(event) =>
                setField("type", event.target.value as SessionType)
              }
              className={inputCls}
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-5 py-8">
          <h2 className={sectionLabelCls}>Schedule</h2>

          <div>
            <label htmlFor={`${ids}-when`} className={labelCls}>
              Scheduled At
            </label>

            <input
              id={`${ids}-when`}
              type="datetime-local"
              value={form.scheduledAt}
              min={
                form.scheduledAt === originalScheduledAtRef.current
                  ? undefined
                  : minDateTime
              }
              onChange={(event) => handleScheduledAtChange(event.target.value)}
              aria-invalid={!!scheduledAtError}
              aria-describedby={
                scheduledAtError ? `${ids}-when-err` : undefined
              }
              className={`${inputCls} ${scheduledAtError ? errCls : ""}`}
            />

            {errText(scheduledAtError, `${ids}-when-err`)}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${ids}-duration`} className={labelCls}>
                Duration (minutes)
              </label>

              <input
                id={`${ids}-duration`}
                type="number"
                min={15}
                max={180}
                step={1}
                value={
                  Number.isNaN(form.durationInMinutes)
                    ? ""
                    : form.durationInMinutes
                }
                onChange={(event) =>
                  setField(
                    "durationInMinutes",
                    event.target.value === ""
                      ? Number.NaN
                      : Number(event.target.value),
                  )
                }
                aria-invalid={!!durationError}
                aria-describedby={
                  durationError ? `${ids}-duration-err` : undefined
                }
                className={`${inputCls} ${durationError ? errCls : ""}`}
              />

              {errText(durationError, `${ids}-duration-err`)}
            </div>

            <div>
              <label htmlFor={`${ids}-max`} className={labelCls}>
                Maximum Participants
              </label>

              <input
                id={`${ids}-max`}
                type="number"
                min={2}
                max={100}
                step={1}
                value={
                  form.maxParticipants == null ||
                  Number.isNaN(form.maxParticipants)
                    ? ""
                    : form.maxParticipants
                }
                onChange={(event) =>
                  setField(
                    "maxParticipants",
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                  )
                }
                placeholder="Optional"
                aria-invalid={!!participantsError}
                aria-describedby={
                  participantsError ? `${ids}-max-err` : undefined
                }
                className={`${inputCls} ${participantsError ? errCls : ""}`}
              />

              {errText(participantsError, `${ids}-max-err`)}
            </div>
          </div>
        </section>

        <section className="space-y-5 py-8">
          <h2 className={sectionLabelCls}>Pricing</h2>

          <div
            role="radiogroup"
            aria-label="Pricing type"
            className="flex gap-3"
          >
            {(["free", "paid"] as const).map((type) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={form.pricing.type === type}
                onClick={() => handlePricingType(type)}
                className={`rounded-xl border px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  form.pricing.type === type
                    ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {form.pricing.type === "paid" && (
            <div>
              <label htmlFor={`${ids}-amount`} className={labelCls}>
                Price (INR)
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₹
                </span>

                <input
                  id={`${ids}-amount`}
                  type="number"
                  min={50}
                  max={10000}
                  step={1}
                  value={
                    Number.isNaN(form.pricing.amount) ||
                    form.pricing.amount === 0
                      ? ""
                      : form.pricing.amount
                  }
                  onChange={(event) => handlePriceChange(event.target.value)}
                  aria-invalid={!!priceError}
                  aria-describedby={
                    priceError ? `${ids}-amount-err` : undefined
                  }
                  className={`${inputCls} pl-8 ${priceError ? errCls : ""}`}
                />
              </div>

              {errText(priceError, `${ids}-amount-err`)}

              <p className="mt-1.5 text-xs text-slate-400">
                ₹50–₹10,000 per participant. INR only.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-3 pt-8">
          <h2 className={sectionLabelCls}>Thumbnail (optional)</h2>

          {displaySrc ? (
            <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-slate-200">
              <Image
                src={displaySrc}
                alt="Session thumbnail"
                fill
                unoptimized={!!localPreview}
                className="object-cover"
                sizes="320px"
              />

              {localPreview && (
                <button
                  type="button"
                  onClick={clearNewThumbnail}
                  aria-label="Remove new thumbnail"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-xs hover:bg-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-semibold">Upload image</span>
              <span className="text-xs">JPG, PNG or WebP · Maximum 5 MB</span>
            </button>
          )}

          {displaySrc && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Change image
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleThumbnailPick(event.target.files?.[0] ?? null)
            }
          />

          {errText(thumbnailError ?? undefined, `${ids}-thumbnail-err`)}
        </section>

        {submitError && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
          >
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={() => router.push(`/nutritionist/sessions/${sessionId}`)}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-800 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
