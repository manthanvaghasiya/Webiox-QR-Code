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
