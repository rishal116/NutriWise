import './globals.css';
import { ReactNode } from 'react';
import { ReduxProvider } from '@/redux/provider';
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

export const metadata = {
  title: 'NutriWise',
  icons: {
    icon: "/favicon.png",
  },
  description: 'Health & Nutrition Consultation App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Providers>{children}</Providers>
          <Toaster position="top-right" reverseOrder={false} />
        </ReduxProvider>
      </body>
    </html>
  );
}

