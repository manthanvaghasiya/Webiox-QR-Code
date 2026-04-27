"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/",          label: "Home" },
  { href: "/generator", label: "QR Generator" },
  { href: "/api-docs",  label: "QR API" },
  { href: "/pricing",   label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const isActive = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-ink-100/60 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" aria-label="Webiox QR Studio home">
            <Logo variant="full" size="md" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex flex-col items-center px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-semibold transition-colors ${
                      active
                        ? "text-brand-600"
                        : "text-ink-500 group-hover:text-ink-900"
                    }`}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-500"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: auth + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              aria-current={isActive("/signin") ? "page" : undefined}
              className={`hidden md:inline text-sm font-bold transition-colors ${
                isActive("/signin") ? "text-brand-600" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Sign In
            </Link>
            <Button href="/signup" variant="primary" size="sm">
              Sign Up
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-700 hover:bg-ink-50 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden border-t border-ink-100/60 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? "text-brand-600 bg-brand-50"
                        : "text-ink-700 hover:bg-ink-50"
                    }`}
                  >
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-ink-100" />
              <Link
                href="/signin"
                onClick={closeMobile}
                aria-current={isActive("/signin") ? "page" : undefined}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive("/signin")
                    ? "text-brand-600 bg-brand-50"
                    : "text-ink-700 hover:bg-ink-50"
                }`}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
