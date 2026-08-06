import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ReduxProvider } from "@/redux/provider";
import SocketProvider from "@/providers/SocketProvider";
import { Toaster } from "sonner";
import { ThemeProviders } from "@/providers/ThemeProvider";
import AuthProvider from "@/providers/AuthProvider";
import GlobalLoading from "@/components/common/GlobalLoading";
import QueryProvider from "@/providers/QueryProvider";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <ThemeProviders>
                <SocketProvider>
                  <GlobalLoading />
                  {children}
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={3000}
                  />
                </SocketProvider>
              </ThemeProviders>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
