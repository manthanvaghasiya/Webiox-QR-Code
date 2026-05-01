import { Megaphone } from "lucide-react";

export const metadata = { title: "Broadcast" };

export default function AdminBroadcastPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Broadcast</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
          <Megaphone className="w-7 h-7 text-orange-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Coming in Stage 4</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
          WhatsApp broadcast campaigns to engage users will be available in
          Stage 4. This panel will let you compose, schedule, and track
          campaigns.
        </p>
      </div>
    </div>
  );
}
