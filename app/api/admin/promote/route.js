import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { findUserByEmail, updateUser } from "@/lib/models/users";

export async function POST(request) {
  const { email, secret } = await request.json().catch(() => ({}));

  if (!process.env.ADMIN_BOOTSTRAP_SECRET) {
    return NextResponse.json(
      { error: "ADMIN_BOOTSTRAP_SECRET is not configured on this server." },
      { status: 503 }
    );
  }

  if (!secret || secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  if (!email?.trim()) {
    return NextResponse.json({ error: "email is required." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await findUserByEmail(db, email.trim().toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: `No user found with email: ${email}` },
        { status: 404 }
      );
    }

    await updateUser(db, user._id.toString(), { role: "admin" });

    return NextResponse.json({
      ok: true,
      message: `${user.email} has been promoted to admin.`,
    });
  } catch (err) {
    console.error("[promote]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
