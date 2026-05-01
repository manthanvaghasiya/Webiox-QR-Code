"use client";

import { Download, Globe, ArrowRight } from "lucide-react";

export default function AppStorePage({ page }) {
  const config = page.config || {};
  const { asName, asDesc, asIos, asAndroid, asWeb } = config;

  return (
    <div className="min-h-screen bg-[#101415] text-white selection:bg-blue-500/30 font-sans pb-24 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-md mx-auto px-6 pt-16 flex flex-col items-center flex-1">
        
        {/* App Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center border-2 border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] text-5xl font-black text-white">
            {(asName || "A").charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="text-center mb-12 w-full">
          <h1 className="text-3xl font-black tracking-tight mb-3">
            {asName || "Download App"}
          </h1>
          {asDesc && (
            <p className="text-gray-300 text-[15px] leading-relaxed mx-auto max-w-[90%] opacity-90">
              {asDesc}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4 mb-10 mt-auto">
          {asIos && (
            <a 
              href={asIos.startsWith('http') ? asIos : `https://${asIos}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center justify-between p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M16.365 21.43c-1.393.98-2.673.935-3.993.04-1.362-.934-2.316-.889-3.797.085-1.554.98-2.915.935-4.12-.667C2.083 17.65 1.017 13.06 2.84 9.47c1.02-2.092 2.993-3.38 5.127-3.425 1.554-.045 2.993 1.068 3.84 1.068.847 0 2.548-1.291 4.362-1.113 1.86.09 3.55 1.024 4.546 2.626-4.038 2.537-3.326 8.32 1.02 10.055-.89 2.36-2.083 4.586-3.37 6.47-.935 1.425-1.815 2.805-3.085 2.805M14.943 4.394C15.834 3.237 16.279 1.77 16.1 0c-1.554.09-3.245 1.068-4.223 2.225-.847 1.068-1.425 2.582-1.157 4.14 1.732.134 3.326-.846 4.223-1.97" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Download on the</p>
                  <p className="text-white font-bold text-lg">App Store</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
            </a>
          )}
          
          {asAndroid && (
            <a 
              href={asAndroid.startsWith('http') ? asAndroid : `https://${asAndroid}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center justify-between p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.5 13.9l-10-5.8c-1-.6-2.1.2-2.1 1.2v11.6c0 1.1 1.1 1.8 2.1 1.2l10-5.8c1-.5 1-.9 0-1.2zm-10 4.1v-8l6.9 4-6.9 4z"/></svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">GET IT ON</p>
                  <p className="text-white font-bold text-lg">Google Play</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
            </a>
          )}

          {asWeb && (
            <a 
              href={asWeb.startsWith('http') ? asWeb : `https://${asWeb}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex items-center justify-between p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.02] hover:border-gray-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 via-gray-500/5 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">AVAILABLE ON</p>
                  <p className="text-white font-bold text-lg">Web App</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
