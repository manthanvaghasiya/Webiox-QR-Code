import { redirect, notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";
import { findQrCodeById } from "@/lib/models/qrCodes";
import {
  aggregateEventsByDay,
  aggregateBy,
  uniqueScanCount,
  totalScanCount,
} from "@/lib/models/scanEvents";
import QrDetailShell from "@/components/dashboard/analytics/QrDetailShell";

export default async function QrDetailPage({ params }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/dashboard/qr-codes");
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();

  const client = await clientPromise;
  const db = client.db();

  const userScope = session.user.role === "admin" ? null : session.user.id;
  const qr = await findQrCodeById(db, id, userScope);
  if (!qr) notFound();

  const days = 30;
  const [byDay, osBreakdown, deviceBreakdown, browserBreakdown, countryBreakdown, cityBreakdown, totalScans, uniqueScans] = await Promise.all([
    aggregateEventsByDay(db, { qrCodeId: id }, days),
    aggregateBy(db, id, "os"),
    aggregateBy(db, id, "device"),
    aggregateBy(db, id, "browser"),
    aggregateBy(db, id, "country"),
    aggregateBy(db, id, "city"),
    totalScanCount(db, id),
    uniqueScanCount(db, id),
  ]);

  const safe = (v) => JSON.parse(JSON.stringify(v));

  return (
    <QrDetailShell
      qr={safe(qr)}
      analytics={{
        byDay: safe(byDay),
        osBreakdown: safe(osBreakdown),
        deviceBreakdown: safe(deviceBreakdown),
        browserBreakdown: safe(browserBreakdown),
        countryBreakdown: safe(countryBreakdown),
        cityBreakdown: safe(cityBreakdown),
        totalScans,
        uniqueScans,
      }}
    />
  );
}
