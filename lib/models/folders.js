import { ObjectId } from 'mongodb';

export const COLLECTION = 'folders';

export async function createIndexes(db) {
  await db.collection(COLLECTION).createIndex({ userId: 1 });
}

export async function createFolder(db, data) {
  const doc = {
    userId: data.userId instanceof ObjectId ? data.userId : new ObjectId(data.userId),
    name: data.name,
    color: data.color ?? null,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findFoldersByUser(db, userId) {
  return db.collection(COLLECTION)
    .find({ userId: userId instanceof ObjectId ? userId : new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function deleteFolder(db, id, userId) {
  return db.collection(COLLECTION).deleteOne({
    _id: new ObjectId(id),
    userId: userId instanceof ObjectId ? userId : new ObjectId(userId),
  });
}
