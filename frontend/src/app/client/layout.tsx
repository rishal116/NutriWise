"use client";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This is now a clean shell for both Messages and Dashboard
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}