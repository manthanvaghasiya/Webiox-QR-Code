"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Terminal, Mail, ArrowRight, CheckCircle2, Zap } from "lucide-react";

const CURL_SAMPLE = `curl -X POST https://api.webioxqr.com/v1/qr \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "url",
    "data": "https://yourwebsite.com",
    "size": 1000,
    "color": "#2563eb",
    "format": "png"
  }' \\
  --output qr.png`;

const JS_SAMPLE = `import { WebioxQR } from "@webiox/qr";

const client = new WebioxQR({ apiKey: process.env.WEBIOX_API_KEY });

const qr = await client.generate({
  type: "url",
  data: "https://yourwebsite.com",
  style: {
    color:    "#2563eb",
    gradient: { from: "#2563eb", to: "#7c3aed", type: "linear" },
    dotPattern: "rounded",
    eyeBallStyle: "dot",
  },
  size: 1000,
  format: "svg",
});

// qr.url → CDN URL of the rendered code
// qr.id  → persistent reference for analytics`;

function CodeBlock({ code, language }) {
  return (
    <div className="rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{language}</span>
      </div>
      <pre className="p-5 text-sm text-gray-100 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col w-full">
      {/* Hero */}
      <section className="px-4 sm:px-8 pt-16 pb-12 md:pt-24 max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm text-xs font-bold text-blue-700 uppercase tracking-wider mb-6"
        >
          <Zap className="w-3.5 h-3.5" /> Developer Preview
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-5 leading-[1.05]"
        >
          QR Code API —{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Coming Soon
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          A simple REST API for programmatic QR generation. Same engine as the
          web app — colors, gradients, logos, all 22+ types.
        </motion.p>
      </section>

      {/* Code samples */}
      <section className="px-4 sm:px-8 pb-12 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <Terminal className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">curl</h2>
            </div>
            <CodeBlock language="bash" code={CURL_SAMPLE} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <Code2 className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">JavaScript SDK</h2>
            </div>
            <CodeBlock language="javascript" code={JS_SAMPLE} />
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4 italic">
          Preview only — endpoints and SDK are not live yet.
        </p>
      </section>

      {/* Email signup */}
      <section className="px-4 sm:px-8 pb-24 max-w-xl mx-auto w-full">
        <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Get notified when the API launches
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            We&apos;ll email you the day it goes live. No spam.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              Thanks — we&apos;ll be in touch.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="you@yourdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-full focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Notify me
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <p className="mt-6 text-xs text-gray-500">
            Already need a QR?{" "}
            <Link href="/generator" className="font-semibold text-blue-600 hover:text-blue-700">
              Use the free generator
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
