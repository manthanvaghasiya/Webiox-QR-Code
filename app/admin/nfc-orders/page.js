import { CreditCard } from "lucide-react";

export const metadata = { title: "NFC Orders" };

export default function AdminNfcOrdersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">NFC Orders</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
          <CreditCard className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">No NFC orders yet</h2>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          Physical NFC card orders will appear here once the ordering flow is
          live in a later stage.
        </p>
      </div>
    </div>
  );
}
