import clientPromise from "@/lib/mongodb";
import { Users, QrCode, Briefcase, Activity, Package } from "lucide-react";

export const metadata = { title: "Overview" };

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const client = await clientPromise;
  const db = client.db();
  const since = todayStart();

  const [
    totalUsers,
    totalQrAll,
    totalQrToday,
    totalProfiles,
    scansToday,
    pendingOrders,
    recentSignups,
  ] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("generated_codes").countDocuments(),
    db.collection("generated_codes").countDocuments({ createdAt: { $gte: since } }),
    db.collection("business_profiles").countDocuments(),
    db.collection("scan_events").countDocuments({ timestamp: { $gte: since } }),
    db.collection("nfc_orders").countDocuments({ status: "pending" }),
    db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray(),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "QR Codes",
      value: totalQrAll,
      sub: `+${totalQrToday} today`,
      icon: QrCode,
      color: "bg-purple-500",
    },
    {
      label: "Profiles",
      value: totalProfiles,
      icon: Briefcase,
      color: "bg-emerald-500",
    },
    {
      label: "Scans Today",
      value: scansToday,
      icon: Activity,
      color: "bg-amber-500",
    },
    {
      label: "Pending NFC Orders",
      value: pendingOrders,
      icon: Package,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform snapshot as of{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent signups */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent Signups</h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 10 registered users</p>
        </div>
        <div className="divide-y divide-gray-50">
          {recentSignups.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              No users yet.
            </p>
          ) : (
            recentSignups.map((u) => {
              const initial =
                u.name?.[0]?.toUpperCase() ??
                u.email?.[0]?.toUpperCase() ??
                "?";
              return (
                <div
                  key={u._id.toString()}
                  className="flex items-center gap-4 px-6 py-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {u.name ?? <span className="text-gray-400 italic">No name</span>}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "suspended"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {u.role ?? "user"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
