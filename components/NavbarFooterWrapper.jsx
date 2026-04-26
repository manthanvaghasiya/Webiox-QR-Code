"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function NavbarFooterWrapper({ children }) {
  const pathname = usePathname();
  const isPublicPage = pathname.startsWith("/p/");
  return (
    <>
      {!isPublicPage && <Navbar />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!isPublicPage && <Footer />}
    </>
  );
}
