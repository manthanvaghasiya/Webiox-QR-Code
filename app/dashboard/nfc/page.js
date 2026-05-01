import Link from "next/link";
import { CreditCard, Plus } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";

export default function NfcPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="NFC Cards"
        description="Order premium NFC tap cards that link directly to your business profile."
        action={
          <Link
            href="/dashboard/nfc/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Order now
          </Link>
        }
      />

      <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
        <EmptyState
          icon={CreditCard}
          title="Order your first NFC tap card"
          description="Tap-to-share NFC cards in PVC, metal, or wood — link to any business profile instantly."
          cta="Order now"
          ctaHref="/dashboard/nfc/new"
        />
      </div>
    </div>
  );
}
