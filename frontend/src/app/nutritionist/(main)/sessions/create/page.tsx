import type { Metadata } from "next";

import { CreateSessionForm } from "@/components/nutritionist/sessions/create/CreateSessionForm";

export const metadata: Metadata = {
  title: "Create Session | NutriWise",
  description:
    "Create and schedule a nutrition session for your clients on NutriWise.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateSessionPage() {
  return <CreateSessionForm />;
}
