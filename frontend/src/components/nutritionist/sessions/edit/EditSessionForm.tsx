"use client";

import { BasicDetailsSection } from "@/components/nutritionist/sessions/shared/BasicDetailsSection";
import { ScheduleCapacitySection } from "@/components/nutritionist/sessions/shared/ScheduleCapacitySection";
import { PricingSection } from "@/components/nutritionist/sessions/shared/PricingSection";
import { ThumbnailSection } from "@/components/nutritionist/sessions/shared/ThumbnailSection";

import { EditSessionFooter } from "./EditSessionFooter";
import { EditSessionHeader } from "./EditSessionHeader";
import { EditSessionLoading } from "./EditSessionLoading";
import { EditSessionError } from "./EditSessionError";

import { useEditSessionForm } from "./use-edit-session-form";

interface EditSessionFormProps {
  sessionId: string;
}

export function EditSessionForm({ sessionId }: EditSessionFormProps) {
  const {
    form,
    originalThumbnailUrl,
    localPreview,
    thumbnailError,
    loading,
    loadError,
    submitting,
    submitError,
    minDateTime,
    isOriginalSchedule,
    showError,
    setField,
    handlePricingType,
    handlePriceChange,
    handleThumbnailPick,
    clearNewThumbnail,
    handleSubmit,
    goBack,
    cancel,
  } = useEditSessionForm(sessionId);

  if (loading) {
    return <EditSessionLoading />;
  }

  if (loadError || !form) {
    return (
      <EditSessionError
        message={loadError ?? "Session not found."}
        onBack={goBack}
      />
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-10">
      <EditSessionHeader title={form.title} onBack={goBack} />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <BasicDetailsSection
          title={form.title}
          description={form.description}
          type={form.type}
          errors={{
            title: showError("title"),
            description: showError("description"),
            type: showError("type"),
          }}
          onTitleChange={(value) => setField("title", value)}
          onDescriptionChange={(value) => setField("description", value)}
          onTypeChange={(value) => setField("type", value)}
        />

        <ScheduleCapacitySection
          scheduledAt={form.scheduledAt}
          duration={form.durationInMinutes}
          maxParticipants={form.maxParticipants}
          minDateTime={isOriginalSchedule ? undefined : minDateTime}
          errors={{
            scheduledAt: showError("scheduledAt"),
            duration: showError("durationInMinutes"),
            maxParticipants: showError("maxParticipants"),
          }}
          onScheduledAtChange={(value) => setField("scheduledAt", value)}
          onDurationChange={(value) =>
            setField(
              "durationInMinutes",
              value === "" ? Number.NaN : Number(value),
            )
          }
          onParticipantsChange={(value) =>
            setField(
              "maxParticipants",
              value === "" ? undefined : Number(value),
            )
          }
        />

        <PricingSection
          pricingType={form.pricing.type}
          amount={form.pricing.amount}
          pricingTypeError={showError("pricingType")}
          priceError={showError("pricingAmount")}
          onPricingTypeChange={handlePricingType}
          onAmountChange={handlePriceChange}
        />

        <ThumbnailSection
          preview={localPreview ?? originalThumbnailUrl ?? null}
          error={thumbnailError}
          onFileChange={handleThumbnailPick}
          onRemove={clearNewThumbnail}
          allowRemove={!!localPreview}
        />

        <EditSessionFooter
          submitting={submitting}
          submitError={submitError}
          onCancel={cancel}
        />
      </form>
    </main>
  );
}
