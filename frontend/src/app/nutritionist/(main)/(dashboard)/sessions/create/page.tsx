"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import type { CreateNutriSessionDTO } from "@/dtos/nutritionist/session/create-session.dto";
import type {
  SessionPricingType,
  SessionType,
} from "@/types/nutritionist/session/session.types";
import {
  CREATE_SESSION_LIMITS,
  createSessionSchema,
  getCreateSessionFieldErrors,
  type CreateSessionFieldErrors,
  type CreateSessionFieldName,
} from "@/validations/nutritionist/session/create-session.schema";

type FormState = Omit<CreateNutriSessionDTO, "thumbnailUrl">;

const TYPE_LABELS: Record<SessionType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  group_consultation: "Group Consultation",
  qna: "Q&A",
  seminar: "Seminar",
};

const initialForm: FormState = {
  title: "",
  description: "",
  type: "webinar",
  pricing: {
    type: "free",
    amount: 0,
    currency: "inr",
  },
  scheduledAt: "",
  durationInMinutes: 60,
  maxParticipants: 20,
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";

const errorCls = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20";
const labelCls = "mb-2 block text-sm font-semibold text-slate-700";
const sectionLabelCls =
  "text-xs font-bold uppercase tracking-wider text-slate-500";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

function toLocalDateTimeInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function CreateSessionPage() {
  const router = useRouter();
  const ids = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<CreateSessionFieldErrors>({});
  const [touched, setTouched] = useState<Set<CreateSessionFieldName>>(
    new Set(),
  );
  const [submitted, setSubmitted] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const updateForm = (next: FormState, field: CreateSessionFieldName) => {
    setForm(next);
    setTouched((previous) => new Set(previous).add(field));
    setErrors(getCreateSessionFieldErrors(next));
    setSubmitError(null);
  };

  const showError = (field: CreateSessionFieldName) =>
    submitted || touched.has(field) ? errors[field] : undefined;

  const setBasicField = <K extends "title" | "description" | "type">(
    field: K,
    value: FormState[K],
  ) => {
    updateForm({ ...form, [field]: value }, field);
  };

  const setNumericField = (
    field: "durationInMinutes" | "maxParticipants",
    rawValue: string,
  ) => {
    const value = rawValue === "" ? Number.NaN : Number(rawValue);

    updateForm({ ...form, [field]: value }, field);
  };

  const handlePricingType = (type: SessionPricingType) => {
    const next: FormState = {
      ...form,
      pricing: {
        type,
        amount: type === "free" ? 0 : form.pricing.amount,
        currency: "inr",
      },
    };

    setForm(next);
    setTouched((previous) => new Set(previous).add("pricingAmount"));
    setErrors(getCreateSessionFieldErrors(next));
    setSubmitError(null);
  };

  const handlePriceChange = (rawValue: string) => {
    const amount = rawValue === "" ? Number.NaN : Number(rawValue);

    updateForm(
      {
        ...form,
        pricing: {
          ...form.pricing,
          amount,
          currency: "inr",
        },
      },
      "pricingAmount",
    );
  };

  const handleThumbnailPick = (file: File | null) => {
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setThumbnailError("Choose a JPG, PNG, or WebP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > CREATE_SESSION_LIMITS.thumbnailMaxBytes) {
      setThumbnailError("Image size cannot exceed 5 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setThumbnailError(null);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setThumbnailError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      const dto: CreateNutriSessionDTO = {
        ...result.data,
        scheduledAt: new Date(result.data.scheduledAt).toISOString(),
      };

      await nutriSessionService.createSession(dto, thumbnailFile);
      router.push("/nutritionist/sessions");
    } catch {
      setSubmitError("Couldn't create the session. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (message?: string, id?: string) =>
    message ? (
      <p
        id={id}
        className="mt-1.5 text-xs font-medium text-rose-600"
        role="alert"
      >
        {message}
      </p>
    ) : null;

  const titleError = showError("title");
  const descriptionError = showError("description");
  const scheduledAtError = showError("scheduledAt");
  const durationError = showError("durationInMinutes");
  const participantsError = showError("maxParticipants");
  const priceError = showError("pricingAmount");

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-10">
      <header className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Create Session
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a free or paid session for your clients.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className={sectionLabelCls}>Basic details</h2>

          <div>
            <label htmlFor={`${ids}-title`} className={labelCls}>
              Session title
            </label>
            <input
              id={`${ids}-title`}
              value={form.title}
              maxLength={CREATE_SESSION_LIMITS.titleMax}
              onChange={(event) => setBasicField("title", event.target.value)}
              placeholder="e.g. Healthy Eating for Beginners"
              aria-invalid={!!titleError}
              aria-describedby={`${ids}-title-hint ${ids}-title-error`}
              className={`${inputCls} ${titleError ? errorCls : ""}`}
            />

            <div className="mt-1.5 flex justify-between gap-3">
              <p id={`${ids}-title-hint`} className="text-xs text-slate-400">
                {CREATE_SESSION_LIMITS.titleMin}–
                {CREATE_SESSION_LIMITS.titleMax} characters
              </p>
              <span className="text-xs text-slate-400">
                {form.title.length}/{CREATE_SESSION_LIMITS.titleMax}
              </span>
            </div>
            {renderError(titleError, `${ids}-title-error`)}
          </div>

          <div>
            <label htmlFor={`${ids}-description`} className={labelCls}>
              Description
            </label>
            <textarea
              id={`${ids}-description`}
              rows={5}
              value={form.description}
              maxLength={CREATE_SESSION_LIMITS.descriptionMax}
              onChange={(event) =>
                setBasicField("description", event.target.value)
              }
              placeholder="What will participants learn from this session?"
              aria-invalid={!!descriptionError}
              aria-describedby={`${ids}-description-hint ${ids}-description-error`}
              className={`${inputCls} resize-y ${descriptionError ? errorCls : ""}`}
            />

            <div className="mt-1.5 flex justify-between gap-3">
              <p
                id={`${ids}-description-hint`}
                className="text-xs text-slate-400"
              >
                {CREATE_SESSION_LIMITS.descriptionMin}–
                {CREATE_SESSION_LIMITS.descriptionMax} characters
              </p>
              <span className="text-xs text-slate-400">
                {form.description.length}/{CREATE_SESSION_LIMITS.descriptionMax}
              </span>
            </div>
            {renderError(descriptionError, `${ids}-description-error`)}
          </div>

          <div>
            <p className={labelCls}>Session type</p>
            <div
              role="radiogroup"
              aria-label="Session type"
              className="flex flex-wrap gap-2"
            >
              {(Object.keys(TYPE_LABELS) as SessionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={form.type === type}
                  onClick={() => setBasicField("type", type)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    form.type === type
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className={sectionLabelCls}>Schedule and capacity</h2>

          <div>
            <label htmlFor={`${ids}-scheduled`} className={labelCls}>
              Date and time
            </label>
            <input
              id={`${ids}-scheduled`}
              type="datetime-local"
              min={toLocalDateTimeInputValue(new Date())}
              value={form.scheduledAt}
              onChange={(event) =>
                updateForm(
                  { ...form, scheduledAt: event.target.value },
                  "scheduledAt",
                )
              }
              aria-invalid={!!scheduledAtError}
              aria-describedby={`${ids}-scheduled-hint ${ids}-scheduled-error`}
              className={`${inputCls} ${scheduledAtError ? errorCls : ""}`}
            />
            <p
              id={`${ids}-scheduled-hint`}
              className="mt-1.5 text-xs text-slate-400"
            >
              Choose a date and time in the future.
            </p>
            {renderError(scheduledAtError, `${ids}-scheduled-error`)}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${ids}-duration`} className={labelCls}>
                Duration (minutes)
              </label>
              <input
                id={`${ids}-duration`}
                type="number"
                min={CREATE_SESSION_LIMITS.durationMin}
                max={CREATE_SESSION_LIMITS.durationMax}
                step={1}
                value={
                  Number.isNaN(form.durationInMinutes)
                    ? ""
                    : form.durationInMinutes
                }
                onChange={(event) =>
                  setNumericField("durationInMinutes", event.target.value)
                }
                aria-invalid={!!durationError}
                aria-describedby={`${ids}-duration-hint ${ids}-duration-error`}
                className={`${inputCls} ${durationError ? errorCls : ""}`}
              />
              <p
                id={`${ids}-duration-hint`}
                className="mt-1.5 text-xs text-slate-400"
              >
                {CREATE_SESSION_LIMITS.durationMin}–
                {CREATE_SESSION_LIMITS.durationMax} minutes
              </p>
              {renderError(durationError, `${ids}-duration-error`)}
            </div>

            <div>
              <label htmlFor={`${ids}-participants`} className={labelCls}>
                Maximum participants
              </label>
              <input
                id={`${ids}-participants`}
                type="number"
                min={CREATE_SESSION_LIMITS.participantsMin}
                max={CREATE_SESSION_LIMITS.participantsMax}
                step={1}
                value={
                  Number.isNaN(form.maxParticipants) ? "" : form.maxParticipants
                }
                onChange={(event) =>
                  setNumericField("maxParticipants", event.target.value)
                }
                aria-invalid={!!participantsError}
                aria-describedby={`${ids}-participants-hint ${ids}-participants-error`}
                className={`${inputCls} ${participantsError ? errorCls : ""}`}
              />
              <p
                id={`${ids}-participants-hint`}
                className="mt-1.5 text-xs text-slate-400"
              >
                {CREATE_SESSION_LIMITS.participantsMin}–
                {CREATE_SESSION_LIMITS.participantsMax} participants
              </p>
              {renderError(participantsError, `${ids}-participants-error`)}
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className={sectionLabelCls}>Pricing</h2>

          <div className="grid grid-cols-2 gap-3">
            {(["free", "paid"] as const).map((type) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={form.pricing.type === type}
                onClick={() => handlePricingType(type)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                  form.pricing.type === type
                    ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type === "free" ? "Free session" : "Paid session"}
              </button>
            ))}
          </div>

          {form.pricing.type === "free" ? (
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                Free session · ₹0
              </p>
              <p className="mt-1 text-xs text-emerald-800">
                No payment is required from participants.
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor={`${ids}-price`} className={labelCls}>
                Price (INR)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                  ₹
                </span>
                <input
                  id={`${ids}-price`}
                  type="number"
                  min={CREATE_SESSION_LIMITS.priceMin}
                  max={CREATE_SESSION_LIMITS.priceMax}
                  step={1}
                  value={
                    Number.isNaN(form.pricing.amount) ||
                    form.pricing.amount === 0
                      ? ""
                      : form.pricing.amount
                  }
                  onChange={(event) => handlePriceChange(event.target.value)}
                  aria-invalid={!!priceError}
                  aria-describedby={`${ids}-price-hint ${ids}-price-error`}
                  className={`${inputCls} pl-8 ${priceError ? errorCls : ""}`}
                  placeholder="500"
                />
              </div>
              <p
                id={`${ids}-price-hint`}
                className="mt-1.5 text-xs text-slate-400"
              >
                ₹{CREATE_SESSION_LIMITS.priceMin}–₹
                {CREATE_SESSION_LIMITS.priceMax.toLocaleString("en-IN")} per
                participant. INR only.
              </p>
              {renderError(priceError, `${ids}-price-error`)}
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className={sectionLabelCls}>Thumbnail (optional)</h2>

          {thumbnailPreview ? (
            <div className="relative h-44 w-full max-w-sm overflow-hidden rounded-xl border border-slate-200">
              <Image
                src={thumbnailPreview}
                alt="Session thumbnail preview"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
              <button
                type="button"
                onClick={clearThumbnail}
                aria-label="Remove thumbnail"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-32 w-full max-w-sm flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:bg-slate-100"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-sm font-semibold">Choose an image</span>
              <span className="text-xs">JPG, PNG or WebP · Maximum 5 MB</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) =>
              handleThumbnailPick(event.target.files?.[0] ?? null)
            }
          />

          {renderError(thumbnailError ?? undefined)}
        </section>

        {submitError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {submitError}
          </p>
        )}

        <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Creating session..." : "Create session"}
          </button>
        </footer>
      </form>
    </main>
  );
}
