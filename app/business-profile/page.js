import Link from "next/link";
import { ArrowRight, Sparkles, Store, MapPin, MessageCircle, Image as ImageIcon, Zap, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AI Business Profile | Webiox",
  description: "Create a stunning, AI-generated digital profile for your shop in seconds.",
};

export default function BusinessProfilePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-brand-500/30 pt-[100px]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-medium text-sm mb-8 border border-brand-100">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Digital Storefront</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Your Shop's Digital <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              Profile in Seconds
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Take a photo of your shop, enter your name, and let our AI generate a complete, 
            professional digital profile with descriptions in multiple languages, pre-built templates, and a free QR code.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-lg shadow-xl shadow-gray-900/20 transition-all hover:scale-105"
            >
              Create Free Profile <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to go digital</h2>
            <p className="text-lg text-gray-600">Built specifically for local businesses and shopkeepers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Content Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Don't worry about writing. Our AI automatically generates professional descriptions in English, Hindi, and Gujarati based on just 3-5 keywords.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pre-built Templates</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from highly optimized, beautiful templates designed specifically to showcase products, timings, and contact details effectively.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Turn visitors into customers instantly with 1-click WhatsApp chat buttons and pre-written greeting messages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              Ready to get your shop online?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of smart shopkeepers upgrading their business with a professional digital identity.
            </p>
            
            <div className="relative z-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-transform"
              >
                Create Profile Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
