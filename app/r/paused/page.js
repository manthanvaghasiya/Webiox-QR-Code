import { PauseCircle } from "lucide-react";

export const metadata = { title: "QR code paused" };

export default function PausedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50/60 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-ink-100 shadow-card p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
          <PauseCircle className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-xl font-bold text-ink-900 mb-2">This QR code is paused</h1>
        <p className="text-sm text-ink-500">
          The owner has temporarily disabled this QR code. Please check back later.
        </p>
      </div>
    </div>
  );
}
