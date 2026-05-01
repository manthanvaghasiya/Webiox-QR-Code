import { Clock } from "lucide-react";

export const metadata = { title: "QR code expired" };

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50/60 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-ink-100 shadow-card p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
          <Clock className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-ink-900 mb-2">This campaign has ended</h1>
        <p className="text-sm text-ink-500">
          The QR code you scanned is no longer active.
        </p>
      </div>
    </div>
  );
}
