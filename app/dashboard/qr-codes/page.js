import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { findQrCodesByUser, countQrCodesByUser } from "@/lib/models/qrCodes";
import { findFoldersByUser } from "@/lib/models/folders";
import { countScansForUser } from "@/lib/models/scanEvents";
import { auth } from "@/auth";
import QrListShell from "@/components/dashboard/QrListShell";

const PLAN_LIMITS = {
  free: { dynamicLimit: 5, label: "Free" },
  pro: { dynamicLimit: 250, label: "Pro" },
  business: { dynamicLimit: null, label: "Business" },
};

export default async function QrCodesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/dashboard/qr-codes");
  }

  const client = await clientPromise;
  const db = client.db();

  const [qrs, folders, qrCount, dynamicCount, weeklyScans] = await Promise.all([
    findQrCodesByUser(db, session.user.id, { limit: 100 }),
    findFoldersByUser(db, session.user.id),
    countQrCodesByUser(db, session.user.id),
    db.collection("qr_codes").countDocuments({
      userId: new ObjectId(session.user.id),
      isDynamic: true,
    }),
    countScansForUser(db, session.user.id, 7),
  ]);

  const plan = session.user.plan || "free";
  const planInfo = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const initialSummary = {
    qrCount,
    dynamicCount,
    weeklyScans,
    plan,
    planLabel: planInfo.label,
    dynamicLimit: planInfo.dynamicLimit,
    weeklyScansSince: since.toISOString(),
  };

  // Serialize ObjectIds + Dates for the client component
  const safe = (v) => JSON.parse(JSON.stringify(v));

  return (
    <div className="-mt-px h-full">
      <QrListShell
        initialQrs={safe(qrs)}
        initialFolders={safe(folders)}
        initialSummary={initialSummary}
      />
    </div>
  );
}
