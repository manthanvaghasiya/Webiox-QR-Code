"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NavbarFooterWrapper({ children }) {
  const pathname = usePathname();
  const hideChrome =
    pathname.startsWith("/p/") ||
    pathname.startsWith("/r/") ||
    pathname.startsWith("/b/") ||
    pathname.startsWith("/edit/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");
  return (
    <>
      {!hideChrome && <Navbar />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
