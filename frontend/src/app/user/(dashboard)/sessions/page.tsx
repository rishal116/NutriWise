import type { Metadata } from "next";

import UserSessionsClient from "@/components/user/session/list/UserSessionsClient";

export const metadata: Metadata = {
  title: "My Sessions | NutriWise",
  description:
    "View and manage your registered nutrition sessions, track registration status, and stay updated on upcoming sessions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserSessionsPage() {
  return <UserSessionsClient />;
}
