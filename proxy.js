// ─────────────────────────────────────────────────────────────────────────────
// PROXY (Next.js 16 Middleware)
//
// In Next.js 16 the conventional `middleware.js` file was renamed to `proxy.js`.
// This runs on every request matching the `config.matcher` patterns below.
// Job: gate /dashboard/* and /admin/* — if the user isn't authenticated,
//      redirect to /signin?callbackUrl=<original-url>.
// All other routes are public and bypass this entirely.
// ─────────────────────────────────────────────────────────────────────────────

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected && !req.auth) {
    const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search);
    return NextResponse.redirect(
      new URL(`/signin?callbackUrl=${callbackUrl}`, req.nextUrl)
    );
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
