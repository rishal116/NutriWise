import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Menubar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar/>
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <Navbar/>
        <main className="pt-24 px-6 pb-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
