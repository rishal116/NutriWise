
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'NutriWise',
  description: 'Health & Nutrition Consultation App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
