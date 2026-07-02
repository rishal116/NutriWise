import Header from "@/components/common/Header";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-green-50 min-h-screen">
      <Header />
      <main>{children}</main>
    </div>
  );
}
