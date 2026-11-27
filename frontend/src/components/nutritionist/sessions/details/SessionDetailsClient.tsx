"use client";

import { useSessionDetails } from "@/hooks/nutritionist/session/use-session-details";

import SessionDetailsHeader from "./SessionDetailsHeader";
import SessionOverview from "./SessionOverview";
import SessionInformation from "./SessionInformation";
import SessionPricing from "./SessionPricing";
import SessionMeetingRoom from "./SessionMeetingRoom";
import SessionParticipantsSection from "./SessionParticipantsSection";
import SessionMetadata from "./SessionMetadata";
import SessionDetailsSkeleton from "./SessionDetailsSkeleton";
import SessionDetailsError from "./SessionDetailsError";
import SessionDetailsDialogs from "./SessionDetailsDialogs";

interface SessionDetailsClientProps {
  sessionId: string;
}

export default function SessionDetailsClient({
  sessionId,
}: SessionDetailsClientProps) {
  const {
    session,
    loading,
    error,
    deleting,
    publishing,
    showPublishConfirm,
    showDeleteConfirm,
    setShowPublishConfirm,
    setShowDeleteConfirm,
    handlePublish,
    handleDelete,
  } = useSessionDetails(sessionId);

  if (loading) {
    return <SessionDetailsSkeleton />;
  }

  if (error || !session) {
    return <SessionDetailsError message={error ?? "Session not found."} />;
  }

  return (
    <div className="space-y-6">
      <SessionDetailsHeader
        session={session}
        publishing={publishing}
        deleting={deleting}
        onPublish={() => setShowPublishConfirm(true)}
        onDelete={() => setShowDeleteConfirm(true)}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SessionOverview session={session} />

        <SessionInformation session={session} />

        <SessionPricing
          pricingType={session.pricingType}
          pricing={session.pricing}
        />

        {session.status !== "completed" && (
          <SessionMeetingRoom roomId={session.roomId} />
        )}
      </div>
      <SessionParticipantsSection
        sessionId={session.sessionId}
        isFree={session.pricingType === "free"}
      />

      <SessionMetadata
        createdAt={session.createdAt}
        updatedAt={session.updatedAt}
      />

      <SessionDetailsDialogs
        showPublishConfirm={showPublishConfirm}
        showDeleteConfirm={showDeleteConfirm}
        publishing={publishing}
        deleting={deleting}
        onPublishOpenChange={setShowPublishConfirm}
        onDeleteOpenChange={setShowDeleteConfirm}
        onPublish={handlePublish}
        onDelete={handleDelete}
      />
    </div>
  );
}
