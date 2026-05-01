"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, QrCode, Store, BarChart3,
  CreditCard, Folder, Settings, Sparkles,
  Menu, X, Bell, Search, ChevronDown,
  LogOut, User, Receipt,
} from "lucide-react";
import Logo from "@/components/Logo";

/* ─── Config ─────────────────────────────── */

const NAV_ITEMS = [
  { href: "/dashboard",            icon: LayoutDashboard, label: "Overview",      exact: true },
  { href: "/dashboard/qr-codes",   icon: QrCode,          label: "My QR Codes"               },
  { href: "/dashboard/profiles",   icon: Store,           label: "My Profiles",  badge: "New" },
  { href: "/dashboard/analytics",  icon: BarChart3,       label: "Analytics"                  },
  { href: "/dashboard/nfc",        icon: CreditCard,      label: "NFC Cards"                  },
  { href: "/dashboard/folders",    icon: Folder,          label: "Folders"                    },
  { href: "/dashboard/settings",   icon: Settings,        label: "Settings"                   },
];

const PAGE_TITLES = {
  "/dashboard":           "Overview",
  "/dashboard/qr-codes":  "My QR Codes",
  "/dashboard/profiles":  "My Profiles",
  "/dashboard/analytics": "Analytics",
  "/dashboard/nfc":       "NFC Cards",
  "/dashboard/folders":   "Folders",
  "/dashboard/settings":  "Settings",
};

/* ─── Sub-components ─────────────────────── */

function PlanBadge({ plan }) {
  if (plan === "pro") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-brand-500 to-purple-600 text-white leading-none">
        Pro
      </span>
    );
  }
  if (plan === "business") {
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-amber-900 leading-none">
        Business
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-ink-100 text-ink-500 leading-none">
      Free
    </span>
  );
}

function NavItem({ item, pathname, onClick }) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={[
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold",
        "transition-all duration-150 cursor-pointer",
        isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-brand-500/20"
          : "text-ink-500 hover:bg-ink-100 hover:text-ink-900",
      ].join(" ")}
    >
      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span
          className={[
            "px-1.5 py-px text-[10px] font-bold rounded-full leading-none",
            isActive ? "bg-white/25 text-white" : "bg-brand-100 text-brand-600",
          ].join(" ")}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SidebarContent({ user, pathname, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo row */}
      <div className="flex items-center justify-between h-16 px-4 flex-shrink-0 border-b border-ink-100">
        <Link href="/dashboard" onClick={onClose} className="flex-shrink-0">
          <Logo variant="full" size="sm" />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
        ))}
      </nav>

      {/* Upgrade card — free plan only */}
      {user?.plan === "free" && (
        <div className="p-3 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-600 via-purple-600 to-pink-600 text-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-white/75 mb-3 leading-relaxed">
              Dynamic QR codes, analytics, NFC cards, and more.
            </p>
            <Link
              href="/pricing"
              onClick={onClose}
              className="block text-center text-xs font-bold py-1.5 bg-white text-brand-700 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-ink-100 transition-colors cursor-pointer"
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user?.image ? (
          <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initial}
          </div>
        )}
        <PlanBadge plan={user?.plan} />
        <ChevronDown
          className={[
            "w-3.5 h-3.5 text-ink-400 transition-transform duration-150 flex-shrink-0",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1.5 w-52 z-50 bg-white rounded-2xl shadow-glow border border-ink-100 overflow-hidden"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-ink-100">
              <p className="text-sm font-semibold text-ink-900 truncate">{user?.name ?? "User"}</p>
              <p className="text-xs text-ink-400 truncate mt-px">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-ink-400" />
                Profile settings
              </Link>
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-ink-400" />
                Billing
              </Link>
            </div>

            <div className="border-t border-ink-100 py-1">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Shell ──────────────────────────────── */

export default function DashboardShell({ children, user }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50/60">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-white border-r border-ink-100">
        <SidebarContent user={user} pathname={pathname} />
      </aside>

      {/* Mobile sidebar (drawer) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <SidebarContent
                user={user}
                pathname={pathname}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-ink-100">
          {/* Hamburger – mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="lg:hidden flex-shrink-0 p-2 rounded-xl text-ink-500 hover:bg-ink-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <p className="text-sm font-bold text-ink-900 flex-shrink-0 truncate">{pageTitle}</p>

          <div className="flex-1 min-w-0" />

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Search */}
            <label className="hidden sm:flex items-center gap-2 h-9 px-3 bg-ink-50 border border-ink-200 rounded-xl cursor-text hover:border-ink-300 transition-colors">
              <Search className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-ink-700 placeholder-ink-400 w-28 lg:w-44"
                aria-label="Search"
              />
            </label>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-ink-500 hover:bg-ink-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white"
              />
            </button>

            {/* User menu */}
            <UserMenu user={user} />
          </div>
        </header>

        {/* Page content with enter animation */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
