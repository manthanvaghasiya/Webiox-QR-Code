import { ObjectId } from 'mongodb';
import { createHash } from 'crypto';

export const COLLECTION = 'scan_events';

const TTL_SECONDS = 365 * 24 * 60 * 60;

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ qrCodeId: 1, timestamp: -1 }),
    col.createIndex({ profileId: 1, timestamp: -1 }),
    col.createIndex({ timestamp: 1 }, { expireAfterSeconds: TTL_SECONDS }),
  ]);
}

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT ?? 'default-salt';
  return createHash('sha256').update(salt + ip).digest('hex');
}

export async function recordEvent(db, data) {
  const doc = {
    type: data.type,
    qrCodeId: data.qrCodeId ? new ObjectId(data.qrCodeId) : null,
    profileId: data.profileId ? new ObjectId(data.profileId) : null,
    timestamp: data.timestamp ?? new Date(),
    ip: data.ip ? hashIp(data.ip) : null,
    country: data.country ?? null,
    region: data.region ?? null,
    city: data.city ?? null,
    device: data.device ?? null,
    os: data.os ?? null,
    browser: data.browser ?? null,
    referrer: data.referrer ?? null,
    userAgent: data.userAgent ?? null,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getEventsByQr(db, qrCodeId, { start, end } = {}) {
  const filter = { qrCodeId: new ObjectId(qrCodeId) };
  if (start || end) {
    filter.timestamp = {};
    if (start) filter.timestamp.$gte = new Date(start);
    if (end) filter.timestamp.$lte = new Date(end);
  }
  return db.collection(COLLECTION).find(filter).sort({ timestamp: -1 }).toArray();
}

export async function getEventsByProfile(db, profileId, { start, end } = {}) {
  const filter = { profileId: new ObjectId(profileId) };
  if (start || end) {
    filter.timestamp = {};
    if (start) filter.timestamp.$gte = new Date(start);
    if (end) filter.timestamp.$lte = new Date(end);
  }
  return db.collection(COLLECTION).find(filter).sort({ timestamp: -1 }).toArray();
}

export async function countScansForUser(db, userId, sinceDays = 7) {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);

  const userQrIds = await db.collection('qr_codes')
    .find({ userId: new ObjectId(userId) }, { projection: { _id: 1 } })
    .toArray();

  if (userQrIds.length === 0) return 0;

  return db.collection(COLLECTION).countDocuments({
    qrCodeId: { $in: userQrIds.map((q) => q._id) },
    timestamp: { $gte: since },
  });
}

export async function aggregateEventsByDay(db, filter, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const match = { timestamp: { $gte: since }, ...filter };
  if (match.qrCodeId) match.qrCodeId = new ObjectId(match.qrCodeId);
  if (match.profileId) match.profileId = new ObjectId(match.profileId);

  return db.collection(COLLECTION).aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).toArray();
}
