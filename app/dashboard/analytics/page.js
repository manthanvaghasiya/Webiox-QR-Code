import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";
import { findQrCodesByUser } from "@/lib/models/qrCodes";
import { totalScanCount, uniqueScanCount } from "@/lib/models/scanEvents";
import AnalyticsListShell from "@/components/dashboard/analytics/AnalyticsListShell";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/dashboard/analytics");
  }

  const client = await clientPromise;
  const db = client.db();

  // Fetch user's QR codes
  const qrs = await findQrCodesByUser(db, session.user.id, { limit: 100 });

  // Fetch scan stats for each QR code
  const qrsWithStats = await Promise.all(
    qrs.map(async (qr) => {
      const [totalScans, uniqueScans] = await Promise.all([
        totalScanCount(db, qr._id.toString()),
        uniqueScanCount(db, qr._id.toString()),
      ]);

      return {
        ...qr,
        stats: {
          totalScans: totalScans || 0,
          uniqueScans: uniqueScans || 0,
        },
      };
    })
  );

  // Serialize ObjectIds + Dates for the client component
  const safe = (v) => JSON.parse(JSON.stringify(v));

  return <AnalyticsListShell initialQrs={safe(qrsWithStats)} />;
}
