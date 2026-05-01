import { Briefcase } from "lucide-react";

export const metadata = { title: "All Profiles" };

export default function AdminProfilesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Profiles</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <Briefcase className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">No profiles yet</h2>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          Digital business profiles will appear here once users start creating
          them in Stage 2.
        </p>
      </div>
    </div>
  );
}
