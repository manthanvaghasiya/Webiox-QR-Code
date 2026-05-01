import Link from "next/link";
import { ArrowRight, CreditCard, Smartphone, CheckCircle2, QrCode } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "NFC Smart Cards | Webiox",
  description: "Get a premium physical NFC card for your business. One tap to share your digital profile.",
};

export default function NFCCardsPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-brand-500/30 pt-[100px]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-8 border border-indigo-100">
            <CreditCard className="w-4 h-4" />
            <span>Premium Physical Product</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            One Tap to Share <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-brand-600">
              Your Entire Shop
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upgrade your business with a sleek, premium NFC card. Customers just tap their phone on your card to instantly see your digital profile, WhatsApp, and product catalog.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-105"
            >
              Order Your NFC Card <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How NFC Cards Work</h2>
            <p className="text-lg text-gray-600">The modern way to share your business details.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Tap the Phone</h3>
              <p className="text-gray-600 leading-relaxed">
                No apps required. Just tap the premium card to any modern smartphone and it works instantly like magic.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Profile Opens</h3>
              <p className="text-gray-600 leading-relaxed">
                Your AI-generated digital storefront opens directly in their browser, showing your products, location, and WhatsApp.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Backup QR Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Every NFC card also comes with a beautifully printed QR code on the back, ensuring 100% compatibility with older phones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-900 to-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              Get the Ultimate Shop Upgrade
            </h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Your free digital profile is a great start. Upgrading to a premium NFC card makes sharing it effortless.
            </p>
            
            <div className="relative z-10">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-transform"
              >
                View Pricing <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
