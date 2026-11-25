"use client";

import { useParams } from "next/navigation";

import { EditSessionForm } from "@/components/nutritionist/sessions/edit/EditSessionForm";

export default function EditSessionPage() {
  const params = useParams<{ sessionId: string }>();

  return <EditSessionForm sessionId={params.sessionId} />;
}
