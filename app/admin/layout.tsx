export const dynamic = "force-dynamic";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 bg-gray-50 p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
