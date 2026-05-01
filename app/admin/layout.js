import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: { template: "%s · Admin · Webiox QR Studio", default: "Admin · Webiox QR Studio" },
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session) redirect("/signin?callbackUrl=/admin");

  if (session.user.role !== "admin") {
    return (
      <div className="animate-gradient-mesh flex-grow flex flex-col items-center justify-center px-4 py-20 w-full">
        <div className="max-w-md w-full rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
            <ShieldX className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold mb-3">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Access Denied
            </span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            You don&apos;t have admin privileges. This area is restricted to
            administrators only.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={session.user} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}
