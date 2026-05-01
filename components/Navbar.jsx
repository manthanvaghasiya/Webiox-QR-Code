"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "/",          label: "Home" },
  { href: "/generator", label: "QR Studio" },
  { href: "/api-docs",  label: "Developers API" },
  { href: "/pricing",   label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const isActive = (href) => pathname === href;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? "pt-4" : "pt-6"}`}>
      <nav className={`w-[95%] max-w-6xl mx-auto rounded-full transition-all duration-500 ease-out ${
        scrolled 
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 px-6 py-3" 
          : "bg-transparent px-6 py-4"
      }`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" aria-label="Webiox QR Studio home" className="hover:scale-105 transition-transform">
            <Logo variant="full" size="md" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center bg-gray-50/50 backdrop-blur-md border border-gray-200/50 rounded-full px-2 py-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="relative px-5 py-2 group rounded-full"
                >
                  <span
                    className={`relative z-10 text-[13px] font-bold tracking-wide transition-colors ${
                      active
                        ? "text-brand-700"
                        : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-100"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: auth + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              aria-current={isActive("/signin") ? "page" : undefined}
              className={`hidden md:inline text-[13px] font-bold transition-colors ${
                isActive("/signin") ? "text-brand-600" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-[13px] font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Sign up <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[80px] inset-x-4 md:hidden bg-white/90 backdrop-blur-2xl border border-gray-200/50 shadow-2xl rounded-3xl p-4 flex flex-col gap-2"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`px-5 py-3.5 rounded-2xl text-[15px] font-bold transition-colors ${
                    active ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="h-px w-full bg-gray-100 my-2" />
            <Link
              href="/signin"
              onClick={closeMobile}
              className="px-5 py-3.5 rounded-2xl text-[15px] font-bold text-gray-600 hover:bg-gray-50"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={closeMobile}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gray-900 text-white text-[15px] font-bold"
            >
              Sign up <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
