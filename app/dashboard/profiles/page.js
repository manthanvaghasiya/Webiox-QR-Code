import Link from "next/link";
import { Store, Plus } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";

export default function ProfilesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="My Profiles"
        description="Build a smart business profile page — share contact info, services, social links, and more."
        action={
          <Link
            href="/dashboard/profiles/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create profile
          </Link>
        }
      />

      <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
        <EmptyState
          icon={Store}
          title="No business profiles yet"
          description="Create a profile page to showcase your business, services, and social links — all behind one QR code."
          cta="Create profile"
          ctaHref="/dashboard/profiles/new"
        />
      </div>
    </div>
  );
}
