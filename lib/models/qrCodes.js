import { ObjectId } from 'mongodb';

export const COLLECTION = 'qr_codes';

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1 }),
    col.createIndex({ shortId: 1 }, { unique: true, sparse: true }),
    col.createIndex({ createdAt: -1 }),
    col.createIndex({ userId: 1, folderId: 1 }),
    col.createIndex({ userId: 1, isPaused: 1 }),
  ]);
}

function toObjectId(value) {
  if (!value) return null;
  return value instanceof ObjectId ? value : new ObjectId(value);
}

export async function createQrCode(db, data) {
  const now = new Date();
  const doc = {
    userId: toObjectId(data.userId),
    type: data.type,
    isDynamic: data.isDynamic ?? false,
    isPaused: false,
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
    folderId: data.folderId ? toObjectId(data.folderId) : null,
    campaignStart: data.campaignStart ?? null,
    campaignEnd: data.campaignEnd ?? null,
    printRun: data.printRun ?? null,
    medium: data.medium ?? null,
    scanCount: 0,
    lastScannedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

const SORTS = {
  recent: { createdAt: -1 },
  oldest: { createdAt: 1 },
  scans: { scanCount: -1 },
  name: { name: 1 },
};

export async function findQrCodesByUser(
  db,
  userId,
  { folderId, status, search, sort = 'recent', limit = 100, skip = 0 } = {}
) {
  const filter = { userId: toObjectId(userId) };
  if (folderId === null || folderId === 'unassigned') {
    filter.folderId = null;
  } else if (folderId) {
    filter.folderId = toObjectId(folderId);
  }
  if (status === 'paused') filter.isPaused = true;
  if (status === 'active') filter.$or = [{ isPaused: false }, { isPaused: { $exists: false } }];
  if (search?.trim()) {
    const re = new RegExp(escapeRegex(search.trim()), 'i');
    const searchOr = [{ name: re }, { destination: re }, { staticContent: re }];
    filter.$and = filter.$or
      ? [{ $or: filter.$or }, { $or: searchOr }]
      : [{ $or: searchOr }];
    delete filter.$or;
  }
  return db.collection(COLLECTION)
    .find(filter)
    .sort(SORTS[sort] ?? SORTS.recent)
    .skip(skip)
    .limit(limit)
    .toArray();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function findQrCodeById(db, id, userId) {
  const filter = { _id: toObjectId(id) };
  if (userId) filter.userId = toObjectId(userId);
  return db.collection(COLLECTION).findOne(filter);
}

export async function findQrCodeByShortId(db, shortId) {
  return db.collection(COLLECTION).findOne({ shortId });
}

export async function shortIdExists(db, shortId, exceptId) {
  const filter = { shortId };
  if (exceptId) filter._id = { $ne: toObjectId(exceptId) };
  const found = await db.collection(COLLECTION).findOne(filter, { projection: { _id: 1 } });
  return !!found;
}

export async function updateQrDestination(db, id, userId, newDestination) {
  return db.collection(COLLECTION).findOneAndUpdate(
    { _id: toObjectId(id), userId: toObjectId(userId) },
    { $set: { destination: newDestination, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
}

const ALLOWED_PATCH_FIELDS = [
  'name', 'destination', 'staticContent', 'isPaused', 'folderId', 'shortId',
  'design', 'campaignStart', 'campaignEnd', 'printRun', 'medium',
];

export async function updateQrCode(db, id, userId, patch) {
  const $set = { updatedAt: new Date() };
  for (const key of ALLOWED_PATCH_FIELDS) {
    if (patch[key] === undefined) continue;
    if (key === 'folderId') {
      $set.folderId = patch.folderId ? toObjectId(patch.folderId) : null;
    } else {
      $set[key] = patch[key];
    }
  }
  const filter = { _id: toObjectId(id) };
  if (userId) filter.userId = toObjectId(userId);
  return db.collection(COLLECTION).findOneAndUpdate(
    filter,
    { $set },
    { returnDocument: 'after' }
  );
}

export async function deleteQrCode(db, id, userId) {
  const filter = { _id: toObjectId(id) };
  if (userId) filter.userId = toObjectId(userId);
  return db.collection(COLLECTION).deleteOne(filter);
}

export async function resetScanCount(db, id, userId) {
  return db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id), userId: toObjectId(userId) },
    { $set: { scanCount: 0, lastScannedAt: null, updatedAt: new Date() } }
  );
}

export async function incrementScanCount(db, shortId) {
  return db.collection(COLLECTION).updateOne(
    { shortId },
    { $inc: { scanCount: 1 }, $set: { lastScannedAt: new Date() } }
  );
}

export async function countQrCodesByUser(db, userId) {
  return db.collection(COLLECTION).countDocuments({ userId: toObjectId(userId) });
}
