import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";

import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import SocketProvider from "@/providers/SocketProvider";
import AuthProvider from "@/providers/AuthProvider";

export const metadata = {
  title: "NutriWise",
  icons: {
    icon: "/favicon.png",
  },
  description: "Health & Nutrition Consultation App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://meet.jit.si/external_api.js"
          strategy="afterInteractive"
        />

        <ReduxProvider>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
            <Toaster position="top-right" reverseOrder={false} />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}