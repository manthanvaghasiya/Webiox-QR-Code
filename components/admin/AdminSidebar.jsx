"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  QrCode,
  Briefcase,
  CreditCard,
  Megaphone,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/qr-codes", label: "All QR Codes", icon: QrCode },
  { href: "/admin/profiles", label: "All Profiles", icon: Briefcase },
  { href: "/admin/nfc-orders", label: "NFC Orders", icon: CreditCard },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
  { href: "/admin/system", label: "System", icon: Settings },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();

  function isActive(href, exact) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const initial =
    user?.name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "A";

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-white border-r border-gray-200 z-30">
      {/* Header */}
      <div className="h-16 flex items-center gap-3 px-4 bg-gradient-to-r from-red-600 to-orange-500 flex-shrink-0">
        <Logo variant="mark" size="sm" light />
        <div>
          <div className="text-white font-bold text-sm leading-tight">
            Webiox QR Studio
          </div>
          <div className="text-red-100 text-xs font-medium tracking-wide uppercase">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors group ${
                active
                  ? "bg-red-50 text-red-700 border-l-2 border-red-600 pl-[10px]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  active
                    ? "text-red-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {label}
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-red-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-gray-100 p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-gray-800 truncate">
              {user?.name ?? "Admin"}
            </div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
