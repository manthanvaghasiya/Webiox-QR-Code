import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";
import { updateUser } from "@/lib/models/users";

// PATCH /api/user — update profile (name, image)
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const patch = {};
    if (typeof body.name === "string") patch.name = body.name.trim();
    if (typeof body.image === "string" || body.image === null) patch.image = body.image;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const updated = await updateUser(db, session.user.id, patch);
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
