import { ObjectId } from 'mongodb';

export const COLLECTION = 'users';

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await col.createIndex({ email: 1 }, { unique: true });
}

export async function findUserByEmail(db, email) {
  return db.collection(COLLECTION).findOne({ email });
}

export async function findUserById(db, id) {
  return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createUser(db, data) {
  const now = new Date();
  const doc = {
    email: data.email,
    emailVerified: data.emailVerified ?? null,
    name: data.name ?? null,
    image: data.image ?? null,
    passwordHash: data.passwordHash ?? null,
    role: data.role ?? 'user',
    plan: data.plan ?? 'free',
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function updateUser(db, id, patch) {
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return result;
}
