// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD HELPERS — bcrypt wrappers
//
// hashPassword(plain)  → returns hash to store in user.passwordHash
// verifyPassword(plain, hash) → boolean, used by NextAuth credentials provider
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from "bcryptjs";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
