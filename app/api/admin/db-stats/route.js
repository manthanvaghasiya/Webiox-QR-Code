import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const colList = await db.listCollections().toArray();
    const names = colList.map((c) => c.name).sort();

    const counts = await Promise.all(
      names.map(async (name) => ({
        name,
        count: await db.collection(name).countDocuments(),
      }))
    );

    return NextResponse.json({
      database: db.databaseName,
      collections: counts,
    });
  } catch (err) {
    console.error("[db-stats]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
