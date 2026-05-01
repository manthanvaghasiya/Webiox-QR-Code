import { ObjectId } from 'mongodb';
import { createHash, randomBytes } from 'crypto';

export const COLLECTION = 'password_reset_tokens';

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1 }),
    col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createResetToken(db, userId, expiresInMs = 60 * 60 * 1000) {
  const token = randomBytes(32).toString('hex');
  const doc = {
    userId: userId instanceof ObjectId ? userId : new ObjectId(userId),
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + expiresInMs),
    usedAt: null,
  };
  await db.collection(COLLECTION).insertOne(doc);
  // Return the raw token once — it is never stored in plaintext
  return token;
}

export async function verifyAndConsumeToken(db, token) {
  const tokenHash = hashToken(token);
  const now = new Date();
  const doc = await db.collection(COLLECTION).findOneAndUpdate(
    { tokenHash, usedAt: null, expiresAt: { $gt: now } },
    { $set: { usedAt: now } },
    { returnDocument: 'after' }
  );
  return doc ?? null;
}
