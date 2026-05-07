// ─────────────────────────────────────────────────────────────────────────────
// SessionProviderWrapper — client-side Auth.js session context
//
// Thin "use client" boundary that exposes next-auth's SessionProvider so
// server-rendered layouts can still nest client components that call useSession.
// Used in: app/layout.js (root layout).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
