import './globals.css';
import { ReactNode } from 'react';
import { ReduxProvider } from '@/redux/provider';
import { Toaster } from "react-hot-toast";
import GProviders from "./providers";
import RootWrapper from './root-wrapper';

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
          <RootWrapper> 
          <GProviders>{children}</GProviders>
          <Toaster position="top-right" reverseOrder={false} />
          </RootWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}

