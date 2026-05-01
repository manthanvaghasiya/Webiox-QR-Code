import Link from "next/link";
import { QrCode, Plus } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";
import QrCodeCard from "@/components/dashboard/QrCodeCard";
import clientPromise from "@/lib/mongodb";
import { findQrCodesByUser } from "@/lib/models/qrCodes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function QrCodesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const client = await clientPromise;
  const db = client.db();
  const qrs = await findQrCodesByUser(db, session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="My QR Codes"
        description="Create, manage, and track all your QR codes in one place."
        action={
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create QR code
          </Link>
        }
      />

      {qrs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {qrs.map((qr) => (
            <QrCodeCard key={qr._id.toString()} qr={JSON.parse(JSON.stringify(qr))} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
          <EmptyState
            icon={QrCode}
            title="No QR codes yet"
            description="Generate your first QR code — URL, vCard, WiFi, and 20+ more types."
            cta="Create QR code"
            ctaHref="/generator"
          />
        </div>
      )}
    </div>
  );
}
