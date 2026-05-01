import { Suspense } from "react";
import clientPromise from "@/lib/mongodb";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";

export const metadata = { title: "All QR Codes" };

const LIMIT = 25;

export default async function AdminQrCodesPage({ searchParams }) {
  const {
    page: pageStr = "1",
    search = "",
    dynamic: dynamicFilter = "",
  } = await searchParams;
  const page = Math.max(1, parseInt(pageStr) || 1);
  const skip = (page - 1) * LIMIT;

  const client = await clientPromise;
  const db = client.db();

  // Build filter for generated_codes (legacy collection)
  const filter = {};
  if (search.trim()) filter.text = { $regex: search.trim(), $options: "i" };
  if (dynamicFilter === "1") filter.isDynamic = true;
  else if (dynamicFilter === "0") filter.isDynamic = { $ne: true };

  const [codes, total] = await Promise.all([
    db
      .collection("generated_codes")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT)
      .toArray(),
    db.collection("generated_codes").countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All QR Codes</h1>
          <p className="text-sm text-gray-400 mt-1">
            {total.toLocaleString()} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <AdminSearch placeholder="Search content…" />
          </Suspense>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Content
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Design
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Dynamic
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Logo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {codes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No QR codes found.
                  </td>
                </tr>
              ) : (
                codes.map((c) => (
                  <tr
                    key={c._id.toString()}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-800 truncate text-xs font-mono">
                        {c.text ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded border border-gray-200 flex-shrink-0 inline-block"
                          style={{ background: c.fgColor ?? "#000" }}
                          title={`FG: ${c.fgColor ?? "#000"}`}
                        />
                        <span
                          className="w-5 h-5 rounded border border-gray-200 flex-shrink-0 inline-block"
                          style={{ background: c.bgColor ?? "#fff" }}
                          title={`BG: ${c.bgColor ?? "#fff"}`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.isDynamic
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.isDynamic ? "Dynamic" : "Static"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.hasLogo
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {c.hasLogo ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))
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
