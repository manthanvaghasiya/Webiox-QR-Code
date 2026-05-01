import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "Dashboard – Webiox QR Studio",
};

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
