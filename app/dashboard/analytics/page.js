import { BarChart3 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <PageHeader
        title="Analytics"
        description="Track scans, visits, device types, and geographic data across all your QR codes."
      />

      <div className="bg-white rounded-3xl border border-ink-100 shadow-card">
        <EmptyState
          icon={BarChart3}
          title="No data to show yet"
          description="Analytics will appear here once your QR codes start getting scanned. Create a QR code to get started."
        />
      </div>
    </div>
  );
}
