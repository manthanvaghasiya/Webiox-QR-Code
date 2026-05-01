import Link from "next/link";
import { X, Code2, BriefcaseBusiness } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-900 mt-auto">
      {/* Brand-tinted top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Logo variant="full" size="md" light className="mb-4" />
            <p className="text-sm text-gray-500 leading-relaxed">
              The professional standard for generating beautiful, high-quality
              QR codes — free forever, no watermark.
            </p>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/generator" className="text-sm hover:text-white transition-colors">QR Generator</Link></li>
              <li><Link href="/api-docs" className="text-sm hover:text-white transition-colors">QR Code API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">About Webiox</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Subtle separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-500/20 to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Webiox. All rights reserved.</p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter / X"
              className="text-gray-500 hover:text-brand-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="text-gray-500 hover:text-brand-400 transition-colors"
            >
              <Code2 className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-brand-400 transition-colors"
            >
              <BriefcaseBusiness className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
