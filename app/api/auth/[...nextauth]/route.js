// ─────────────────────────────────────────────────────────────────────────────
// AUTH NEXTAUTH HANDLER — Auth.js v5 catch-all route (signin/signout/callback).
//
// GET|POST /api/auth/* — Dispatches to NextAuth handlers from @/auth.
// (Auth required: varies by sub-route  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
