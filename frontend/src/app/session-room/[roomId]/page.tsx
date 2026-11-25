import type { Metadata } from "next";

import SessionRoomClient from "@/components/session/SessionRoomClient";

export const metadata: Metadata = {
  title: "Session Room | NutriWise",
  description:
    "Join your personalized nutrition coaching session on NutriWise.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SessionRoomPage() {
  return <SessionRoomClient />;
}
