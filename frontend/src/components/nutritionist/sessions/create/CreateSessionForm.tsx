"use client";

import { BasicDetailsSection } from "../shared/BasicDetailsSection";
import { ScheduleCapacitySection } from "../shared/ScheduleCapacitySection";
import { PricingSection } from "../shared/PricingSection";
import { ThumbnailSection } from "../shared/ThumbnailSection";

import { CreateSessionHeader } from "./CreateSessionHeader";
import { CreateSessionFooter } from "./CreateSessionFooter";

import { useCreateSessionForm } from "@/hooks/nutritionist/session/use-create-session-form";
import { toLocalDateTimeInputValue } from "../shared/session-form.constants";

export function CreateSessionForm() {
  const {
    form,
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
    cancel,
  } = useCreateSessionForm();

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-10">
      <CreateSessionHeader onBack={cancel} />

      <form onSubmit={submit} noValidate className="space-y-6">
        <BasicDetailsSection
          title={form.title}
          description={form.description}
          type={form.type}
          errors={{
            title: showError("title"),
            description: showError("description"),
            type: showError("type"),
          }}
          onTitleChange={(value) => setBasicField("title", value)}
          onDescriptionChange={(value) => setBasicField("description", value)}
          onTypeChange={(value) => setBasicField("type", value)}
        />

        <ScheduleCapacitySection
          scheduledAt={form.scheduledAt}
          duration={form.duration}
          maxParticipants={form.maxParticipants}
          minDateTime={toLocalDateTimeInputValue(new Date())}
          errors={{
            scheduledAt: showError("scheduledAt"),
            duration: showError("duration"),
            maxParticipants: showError("maxParticipants"),
          }}
          onScheduledAtChange={setScheduledAt}
          onDurationChange={(value) => setNumericField("duration", value)}
          onParticipantsChange={(value) =>
            setNumericField("maxParticipants", value)
          }
        />

        <PricingSection
          pricingType={form.pricingType}
          amount={form.pricing.amount}
          pricingTypeError={showError("pricingType")}
          priceError={showError("pricingAmount")}
          onPricingTypeChange={setPricingType}
          onAmountChange={setPrice}
        />

        <ThumbnailSection
          preview={thumbnailPreview}
          error={thumbnailError}
          onFileChange={setThumbnail}
          onRemove={clearThumbnail}
          allowRemove
        />

        {submitError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {submitError}
          </p>
        )}

        <CreateSessionFooter submitting={submitting} onCancel={cancel} />
      </form>
    </main>
  );
}
