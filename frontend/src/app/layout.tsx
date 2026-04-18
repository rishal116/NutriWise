import "./globals.css";
import { ReactNode } from "react";
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
