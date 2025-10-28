import './globals.css';
import { ReactNode } from 'react';
import { ReduxProvider } from '@/redux/provider';

export const metadata = {
  title: 'NutriWise',
  icons: {
    icon: '/logo.png',
  },
  description: 'Health & Nutrition Consultation App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

