import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ReduxProvider } from "@/redux/provider";
import SocketProvider from "@/providers/socket-provider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "NutriWise",
    template: "%s | NutriWise",
  },
  description:
    "NutriWise is a health and nutrition platform connecting users with expert nutritionists for personalized wellness and diet guidance.",
  icons: {
    icon: "/nutriwise.png",
    shortcut: "/nutriwise.png",
    apple: "/nutriwise.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>

            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
            />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}