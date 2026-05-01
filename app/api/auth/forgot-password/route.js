import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { findUserByEmail } from "@/lib/models/users";
import { createResetToken } from "@/lib/models/passwordResetTokens";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await findUserByEmail(db, email.trim().toLowerCase());

    // Always return success to prevent email enumeration attacks
    if (!user) return NextResponse.json({ success: true });

    // createResetToken stores only the hash; the raw token is returned once
    const token = await createResetToken(db, user._id);

    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetLink = `${base}/reset-password?token=${token}`;
    console.log("[PasswordReset] Reset link:", resetLink);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
