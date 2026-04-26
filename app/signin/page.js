import Link from "next/link";
import { LogIn, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Sign In — Coming Soon · Webiox QR Studio",
  description: "Sign in to Webiox QR Studio. Coming soon.",
};

export default function SignInPage() {
  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col items-center justify-center px-4 py-20 w-full">
      <div className="max-w-md w-full rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
          <LogIn className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sign In
          </span>
        </h1>
        <p className="text-gray-600 font-medium mb-2">Coming soon.</p>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Accounts aren&apos;t live yet — but the generator is fully free to
          use without one.
        </p>
        <Link
          href="/generator"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-sm transition-colors"
        >
          Continue to Generator
        </Link>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
