import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth/password";
import { verifyAndConsumeToken } from "@/lib/models/passwordResetTokens";
import { updateUser } from "@/lib/models/users";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Reset token is missing." },
        { status: 400 }
      );
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verifies the hash, checks expiry, marks usedAt — single atomic op
    const record = await verifyAndConsumeToken(db, token);

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired link." },
        { status: 400 }
      );
    }

    await updateUser(db, record.userId, { passwordHash: await hashPassword(password) });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
