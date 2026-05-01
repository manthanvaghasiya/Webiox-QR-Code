import { Suspense } from "react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import UserActions from "./UserActions";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";

export const metadata = { title: "All Users" };

const LIMIT = 20;

export default async function AdminUsersPage({ searchParams }) {
  const { page: pageStr = "1", search = "" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr) || 1);
  const skip = (page - 1) * LIMIT;

  const client = await clientPromise;
  const db = client.db();

  const filter = search.trim()
    ? { email: { $regex: search.trim(), $options: "i" } }
    : {};

  const [users, total] = await Promise.all([
    db
      .collection("users")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT)
      .toArray(),
    db.collection("users").countDocuments(filter),
  ]);

  // Aggregate QR + profile counts for this page's users
  const ids = users.map((u) => u._id);
  const [qrAgg, profileAgg] = await Promise.all([
    db
      .collection("qr_codes")
      .aggregate([
        { $match: { userId: { $in: ids } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ])
      .toArray(),
    db
      .collection("business_profiles")
      .aggregate([
        { $match: { userId: { $in: ids } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const qrMap = Object.fromEntries(
    qrAgg.map((r) => [r._id.toString(), r.count])
  );
  const profileMap = Object.fromEntries(
    profileAgg.map((r) => [r._id.toString(), r.count])
  );

  // Serialize for client components
  const rows = users.map((u) => ({
    id: u._id.toString(),
    name: u.name ?? null,
    email: u.email,
    role: u.role ?? "user",
    plan: u.plan ?? "free",
    qrCount: qrMap[u._id.toString()] ?? 0,
    profileCount: profileMap[u._id.toString()] ?? 0,
    createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
  }));

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-sm text-gray-400 mt-1">
            {total.toLocaleString()} total
          </p>
        </div>
        <Suspense>
          <AdminSearch placeholder="Search by email…" />
        </Suspense>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Role / Plan
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                  QRs
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                  Profiles
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Joined
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                rows.map((u) => {
                  const initial =
                    u.name?.[0]?.toUpperCase() ??
                    u.email?.[0]?.toUpperCase() ??
                    "?";
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {u.name ?? (
                                <span className="text-gray-400 italic text-xs">
                                  No name
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit text-xs px-2 py-0.5 rounded-full font-medium ${
                              u.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : u.role === "suspended"
                                ? "bg-gray-100 text-gray-500"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {u.role}
                          </span>
                          <span
                            className={`inline-flex w-fit text-xs px-2 py-0.5 rounded-full font-medium ${
                              u.plan === "enterprise"
                                ? "bg-purple-100 text-purple-700"
                                : u.plan === "pro"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {u.plan}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 font-medium">
                        {u.qrCount}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 font-medium">
                        {u.profileCount}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {u.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        <UserActions user={u} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {skip + 1}–{Math.min(skip + LIMIT, total)} of{" "}
              {total.toLocaleString()}
            </p>
            <Suspense>
              <AdminPagination page={page} totalPages={totalPages} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
