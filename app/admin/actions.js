"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { updateUser } from "@/lib/models/users";
import { ensureIndexes } from "@/lib/models/index";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function promoteToAdmin(userId) {
  await requireAdmin();
  const client = await clientPromise;
  await updateUser(client.db(), userId, { role: "admin" });
  revalidatePath("/admin/users");
}

export async function demoteFromAdmin(userId) {
  await requireAdmin();
  const client = await clientPromise;
  await updateUser(client.db(), userId, { role: "user" });
  revalidatePath("/admin/users");
}

export async function changeUserPlan(userId, plan) {
  await requireAdmin();
  const client = await clientPromise;
  await updateUser(client.db(), userId, { plan });
  revalidatePath("/admin/users");
}

export async function suspendUser(userId) {
  await requireAdmin();
  const client = await clientPromise;
  await updateUser(client.db(), userId, { role: "suspended" });
  revalidatePath("/admin/users");
}

export async function restoreUser(userId) {
  await requireAdmin();
  const client = await clientPromise;
  await updateUser(client.db(), userId, { role: "user" });
  revalidatePath("/admin/users");
}

export async function runEnsureIndexes() {
  await requireAdmin();
  const client = await clientPromise;
  await ensureIndexes(client.db());
  return { ok: true };
}

export async function clearOldScanEvents() {
  await requireAdmin();
  const client = await clientPromise;
  const db = client.db();
  const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const result = await db
    .collection("scan_events")
    .deleteMany({ timestamp: { $lt: cutoff } });
  revalidatePath("/admin/system");
  return { deleted: result.deletedCount };
}
