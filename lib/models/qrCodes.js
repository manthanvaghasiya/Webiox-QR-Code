import { ObjectId } from 'mongodb';

export const COLLECTION = 'qr_codes';

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1 }),
    col.createIndex({ shortId: 1 }, { unique: true, sparse: true }),
    col.createIndex({ createdAt: -1 }),
  ]);
}

export async function createQrCode(db, data) {
  const now = new Date();
  const doc = {
    userId: data.userId
      ? (data.userId instanceof ObjectId ? data.userId : new ObjectId(data.userId))
      : null,
    type: data.type,
    isDynamic: data.isDynamic ?? false,
    shortId: data.shortId ?? null,
    destination: data.destination ?? null,
    staticContent: data.staticContent ?? null,
    design: {
      fgColor: data.design?.fgColor ?? '#000000',
      bgColor: data.design?.bgColor ?? '#ffffff',
      useGradient: data.design?.useGradient ?? false,
      gradientColor1: data.design?.gradientColor1 ?? null,
      gradientColor2: data.design?.gradientColor2 ?? null,
      gradientType: data.design?.gradientType ?? 'linear',
      dotPattern: data.design?.dotPattern ?? 'square',
      cornerStyle: data.design?.cornerStyle ?? 'square',
      eyeBallStyle: data.design?.eyeBallStyle ?? 'square',
      useCustomEyeColor: data.design?.useCustomEyeColor ?? false,
      eyeFrameColor: data.design?.eyeFrameColor ?? null,
      eyeBallColor: data.design?.eyeBallColor ?? null,
      logo: data.design?.logo ?? null,
      errorCorrectionLevel: data.design?.errorCorrectionLevel ?? 'M',
      frameStyle: data.design?.frameStyle ?? null,
      frameText: data.design?.frameText ?? null,
      frameTextColor: data.design?.frameTextColor ?? null,
      frameFillColor: data.design?.frameFillColor ?? null,
    },
    name: data.name ?? null,
    folderId: data.folderId ?? null,
    scanCount: 0,
    lastScannedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findQrCodesByUser(db, userId, { folderId, limit = 20, skip = 0 } = {}) {
  const filter = { userId: userId instanceof ObjectId ? userId : new ObjectId(userId) };
  if (folderId !== undefined) filter.folderId = folderId;
  return db.collection(COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function findQrCodeByShortId(db, shortId) {
  return db.collection(COLLECTION).findOne({ shortId });
}

export async function updateQrDestination(db, id, userId, newDestination) {
  return db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id), userId: userId instanceof ObjectId ? userId : new ObjectId(userId) },
    { $set: { destination: newDestination, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
}

export async function incrementScanCount(db, shortId) {
  return db.collection(COLLECTION).updateOne(
    { shortId },
    { $inc: { scanCount: 1 }, $set: { lastScannedAt: new Date() } }
  );
}
