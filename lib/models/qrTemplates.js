// ─────────────────────────────────────────────────────────────────────────────
// QR TEMPLATES MODEL — Reusable QR design presets
//
// Collection: `qr_templates`
// Fields: userId, name, design (colors/pattern/logo/frame), createdAt
// Lets users save a QR look once and apply it to many QRs.
// Loaded by the QR generator's TemplateGallery component.
// ─────────────────────────────────────────────────────────────────────────────

import { ObjectId } from 'mongodb';

export const COLLECTION = 'qr_templates';

function toObjectId(value) {
  if (!value) return null;
  return value instanceof ObjectId ? value : new ObjectId(value);
}

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1 }),
    col.createIndex({ createdAt: -1 }),
  ]);
}

export async function createTemplate(db, { userId, name, design }) {
  const doc = {
    userId: toObjectId(userId),
    name: String(name || 'Untitled template').trim().slice(0, 80),
    design: design || {},
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findTemplatesByUser(db, userId) {
  return db.collection(COLLECTION)
    .find({ userId: toObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function deleteTemplate(db, id, userId) {
  return db.collection(COLLECTION).deleteOne({
    _id: toObjectId(id),
    userId: toObjectId(userId),
  });
}
