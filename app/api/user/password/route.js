import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";
import { findUserById, updateUser } from "@/lib/models/users";
import { verifyPassword, hashPassword } from "@/lib/auth/password";

// POST /api/user/password — change password
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both passwords are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await findUserById(db, session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Your account uses OAuth sign-in. Password change is not available." },
        { status: 422 }
      );
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    await updateUser(db, session.user.id, { passwordHash: await hashPassword(newPassword) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/user/password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
