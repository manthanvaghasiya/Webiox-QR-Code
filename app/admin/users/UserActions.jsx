"use client";

import { useTransition } from "react";
import {
  promoteToAdmin,
  demoteFromAdmin,
  changeUserPlan,
  suspendUser,
  restoreUser,
} from "@/app/admin/actions";

const PLANS = ["free", "pro", "enterprise"];

export default function UserActions({ user }) {
  const [pending, startTransition] = useTransition();
  const isSelf = false; // Could compare with session.user.id if needed

  function act(fn) {
    startTransition(() => fn());
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Role actions */}
      {user.role === "admin" ? (
        <button
          disabled={pending}
          onClick={() => act(() => demoteFromAdmin(user.id))}
          className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium transition-colors disabled:opacity-50"
        >
          Remove Admin
        </button>
      ) : user.role === "suspended" ? (
        <button
          disabled={pending}
          onClick={() => act(() => restoreUser(user.id))}
          className="text-xs px-2 py-1 rounded-md bg-green-50 hover:bg-green-100 text-green-700 font-medium transition-colors disabled:opacity-50"
        >
          Restore
        </button>
      ) : (
        <>
          <button
            disabled={pending}
            onClick={() => act(() => promoteToAdmin(user.id))}
            className="text-xs px-2 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium transition-colors disabled:opacity-50"
          >
            Make Admin
          </button>
          <button
            disabled={pending}
            onClick={() => act(() => suspendUser(user.id))}
            className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 font-medium transition-colors disabled:opacity-50"
          >
            Suspend
          </button>
        </>
      )}

      {/* Plan selector */}
      <select
        disabled={pending}
        value={user.plan ?? "free"}
        onChange={(e) => act(() => changeUserPlan(user.id, e.target.value))}
        className="text-xs px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50"
      >
        {PLANS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {pending && (
        <span className="text-xs text-gray-400 animate-pulse">Saving…</span>
      )}
    </div>
  );
}
