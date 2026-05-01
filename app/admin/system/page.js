import SystemActions from "./SystemActions";

export const metadata = { title: "System" };

export default function AdminSystemPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System</h1>
        <p className="text-sm text-gray-400 mt-1">
          Database maintenance and diagnostics
        </p>
      </div>
      <SystemActions />
    </div>
  );
}
