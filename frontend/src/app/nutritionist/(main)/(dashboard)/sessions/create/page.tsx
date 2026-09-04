"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";

import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import type { CreateNutriSessionDTO } from "@/dtos/nutritionist/session/create-session.dto";
import {
  SESSION_CURRENCIES,
  SESSION_TYPES,
  type SessionCurrency,
  type SessionPricingType,
  type SessionType,
} from "@/types/nutritionist/session/session.types";

const TYPE_LABELS: Record<SessionType, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  group_consultation: "Group Consultation",
  qna: "Q&A",
  seminar: "Seminar",
};

const CURRENCY_SYMBOLS: Record<SessionCurrency, string> = {
  inr: "₹",
  usd: "$",
  eur: "€",
  gbp: "£",
  aed: "د.إ",
};

type FormState = Omit<CreateNutriSessionDTO, "thumbnailUrl">;
type FieldErrors = Partial<Record<keyof FormState | "pricingAmount", string>>;

const initialForm: FormState = {
  title: "",
  description: "",
  type: "webinar",
  pricing: { type: "free", amount: 0, currency: "inr" },
  scheduledAt: "",
  durationInMinutes: 60,
  maxParticipants: 20,
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20";
const errCls = "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20";
const labelCls = "mb-2 block text-sm font-semibold text-slate-700";
const sectionLabelCls =
  "mb-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500";

function toLocalDateTimeInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function CreateSessionPage() {
  const router = useRouter();
  const ids = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [minDateTime, setMinDateTime] = useState(() =>
    toLocalDateTimeInputValue(new Date()),
  );

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  // Keep the floor current as time passes (input granularity is minutes).
  useEffect(() => {
    const id = setInterval(() => {
      setMinDateTime(toLocalDateTimeInputValue(new Date()));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePricingType = (type: SessionPricingType) =>
    setForm((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        type,
        amount: type === "free" ? 0 : prev.pricing.amount,
      },
    }));

  const handleCurrencyChange = (currency: SessionCurrency) =>
    setForm((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, currency },
    }));

  const handleScheduledAtChange = (value: string) => {
    set("scheduledAt", value);
    const isPast = !!value && new Date(value).getTime() <= Date.now();
    setErrors((prev) => ({
      ...prev,
      scheduledAt: isPast ? "Must be a future date and time." : undefined,
    }));
  };

  const handleThumbnailPick = (file: File | null) => {
    if (!file) return;

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.description.trim()) next.description = "Description is required.";
    if (!form.scheduledAt) next.scheduledAt = "Pick a date and time.";
    else if (new Date(form.scheduledAt).getTime() <= Date.now())
      next.scheduledAt = "Must be a future date and time.";
    if (!form.durationInMinutes || form.durationInMinutes <= 0)
      next.durationInMinutes = "Duration must be greater than 0.";
    if (!form.maxParticipants || form.maxParticipants <= 0)
      next.maxParticipants = "Must be greater than 0.";
    if (form.pricing.type === "paid" && form.pricing.amount <= 0)
      next.pricingAmount = "Enter a price greater than 0.";
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const dto: CreateNutriSessionDTO = {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      };

      await nutriSessionService.createSession(dto, thumbnailFile);
      router.push("/nutritionist/sessions");
    } catch {
      setSubmitError("Couldn't create the session. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const errText = (msg?: string, id?: string) =>
    msg ? (
      <p id={id} className="mt-1.5 text-xs font-medium text-rose-600">
        {msg}
      </p>
    ) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Create Session
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Set up a free or paid session for your clients.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="divide-y divide-slate-100"
      >
        {/* Basic details */}
        <section className="space-y-5 pb-8">
          <h2 className={sectionLabelCls}>Basic Details</h2>

          <div>
            <label htmlFor={`${ids}-title`} className={labelCls}>
              Session Title
            </label>
            <input
              id={`${ids}-title`}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Enter session title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? `${ids}-title-err` : undefined}
              className={`${inputCls} ${errors.title ? errCls : ""}`}
            />
            {errText(errors.title, `${ids}-title-err`)}
          </div>

          <div>
            <label htmlFor={`${ids}-desc`} className={labelCls}>
              Description
            </label>
            <textarea
              id={`${ids}-desc`}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your session"
              rows={5}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? `${ids}-desc-err` : undefined
              }
              className={`${inputCls} ${errors.description ? errCls : ""}`}
            />
            {errText(errors.description, `${ids}-desc-err`)}
          </div>

          <div>
            <label htmlFor={`${ids}-type`} className={labelCls}>
              Session Type
            </label>
            <div
              role="radiogroup"
              aria-label="Session type"
              className="flex flex-wrap gap-2"
            >
              {SESSION_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={form.type === t}
                  onClick={() => set("type", t)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                    form.type === t
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule */}
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
              min={minDateTime}
              onChange={(e) => handleScheduledAtChange(e.target.value)}
              aria-invalid={!!errors.scheduledAt}
              aria-describedby={
                errors.scheduledAt ? `${ids}-when-err` : undefined
              }
              className={`${inputCls} ${errors.scheduledAt ? errCls : ""}`}
            />
            {errText(errors.scheduledAt, `${ids}-when-err`)}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${ids}-duration`} className={labelCls}>
                Duration (minutes)
              </label>
              <input
                id={`${ids}-duration`}
                type="number"
                min={1}
                value={form.durationInMinutes}
                onChange={(e) =>
                  set("durationInMinutes", Number(e.target.value))
                }
                aria-invalid={!!errors.durationInMinutes}
                aria-describedby={
                  errors.durationInMinutes ? `${ids}-duration-err` : undefined
                }
                className={`${inputCls} ${errors.durationInMinutes ? errCls : ""}`}
              />
              {errText(errors.durationInMinutes, `${ids}-duration-err`)}
            </div>

            <div>
              <label htmlFor={`${ids}-max`} className={labelCls}>
                Maximum Participants
              </label>
              <input
                id={`${ids}-max`}
                type="number"
                min={1}
                value={form.maxParticipants}
                onChange={(e) => set("maxParticipants", Number(e.target.value))}
                aria-invalid={!!errors.maxParticipants}
                aria-describedby={
                  errors.maxParticipants ? `${ids}-max-err` : undefined
                }
                className={`${inputCls} ${errors.maxParticipants ? errCls : ""}`}
              />
              {errText(errors.maxParticipants, `${ids}-max-err`)}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-5 py-8">
          <h2 className={sectionLabelCls}>Pricing</h2>

          <div
            role="radiogroup"
            aria-label="Pricing type"
            className="flex gap-3"
          >
            {(["free", "paid"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={form.pricing.type === t}
                onClick={() => handlePricingType(t)}
                className={`rounded-xl border px-5 py-2 text-sm font-semibold capitalize transition-colors duration-150 ${
                  form.pricing.type === t
                    ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {form.pricing.type === "paid" && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${ids}-currency`} className={labelCls}>
                  Currency
                </label>
                <select
                  id={`${ids}-currency`}
                  value={form.pricing.currency}
                  onChange={(e) =>
                    handleCurrencyChange(e.target.value as SessionCurrency)
                  }
                  className={inputCls}
                >
                  {SESSION_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()} ({CURRENCY_SYMBOLS[c]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${ids}-amount`} className={labelCls}>
                  Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    {CURRENCY_SYMBOLS[form.pricing.currency]}
                  </span>
                  <input
                    id={`${ids}-amount`}
                    type="number"
                    min={1}
                    value={form.pricing.amount || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          amount: Number(e.target.value),
                        },
                      }))
                    }
                    aria-invalid={!!errors.pricingAmount}
                    aria-describedby={
                      errors.pricingAmount ? `${ids}-amount-err` : undefined
                    }
                    className={`${inputCls} pl-8 ${errors.pricingAmount ? errCls : ""}`}
                  />
                </div>
                {errText(errors.pricingAmount, `${ids}-amount-err`)}
              </div>
            </div>
          )}
        </section>

        {/* Media */}
        <section className="space-y-3 pt-8">
          <h2 className={sectionLabelCls}>Thumbnail</h2>

          {thumbnailPreview ? (
            <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-slate-200">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={clearThumbnail}
                aria-label="Remove thumbnail"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-xs hover:bg-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors duration-150 hover:bg-slate-100"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-semibold">Upload image</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleThumbnailPick(e.target.files?.[0] ?? null)}
          />
        </section>

        {submitError && (
          <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Creating..." : "Create Session"}
          </button>
        </div>
      </form>
    </div>
  );
}
