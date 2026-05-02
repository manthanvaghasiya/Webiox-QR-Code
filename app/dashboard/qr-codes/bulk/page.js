import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BulkImportShell from "@/components/dashboard/BulkImportShell";

export default async function BulkPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/dashboard/qr-codes/bulk");
  return <BulkImportShell />;
}
