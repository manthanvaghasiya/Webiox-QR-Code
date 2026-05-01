import { customAlphabet } from 'nanoid';
import { randomBytes } from 'crypto';
import { cache } from 'react';
import clientPromise from '@/lib/mongodb';

export const COLLECTION = 'pages';

const nanoid8 = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

async function pagesCol() {
  const client = await clientPromise;
  return client.db().collection(COLLECTION);
}

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ shortId: 1 }, { unique: true }),
    col.createIndex({ editToken: 1 }, { unique: true }),
    col.createIndex({ createdAt: -1 }),
  ]);
}

export async function generateShortId() {
  const col = await pagesCol();
  for (let i = 0; i < 3; i++) {
    const id = nanoid8();
    const hit = await col.findOne({ shortId: id }, { projection: { _id: 1 } });
    if (!hit) return id;
  }
  throw new Error('generateShortId: failed to find unique ID after 3 attempts');
}

export async function generateEditToken() {
  const col = await pagesCol();
  for (let i = 0; i < 3; i++) {
    const token = 'tok_' + randomBytes(10).toString('hex');
    const hit = await col.findOne({ editToken: token }, { projection: { _id: 1 } });
    if (!hit) return token;
  }
  throw new Error('generateEditToken: failed to find unique token after 3 attempts');
}

export async function createPage({ type, config, theme, meta }) {
  const col = await pagesCol();
  const now = new Date();
  const shortId = await generateShortId();
  const editToken = await generateEditToken();

  const doc = {
    shortId,
    editToken,
    type,
    config: config ?? {},
    theme: {
      primaryColor: theme?.primaryColor ?? '#4F46E5',
      accentColor: theme?.accentColor ?? '#7C3AED',
      bgColor: theme?.bgColor ?? '#ffffff',
      textColor: theme?.textColor ?? '#0A0F1E',
      logoUrl: theme?.logoUrl ?? null,
    },
    meta: {
      title: meta?.title ?? '',
      description: meta?.description ?? '',
      ogImageUrl: meta?.ogImageUrl ?? null,
    },
    stats: {
      scans: 0,
      lastScanAt: null,
    },
    createdAt: now,
    updatedAt: now,
  };

  await col.insertOne(doc);
  return { shortId, editToken };
}

// Wrapped in React.cache so multiple calls in one request (e.g. generateMetadata
// + the page itself) hit the DB once and only increment scans once.
export const getPageByShortId = cache(async (shortId) => {
  const col = await pagesCol();
  return col.findOneAndUpdate(
    { shortId },
    { $inc: { 'stats.scans': 1 }, $set: { 'stats.lastScanAt': new Date() } },
    { returnDocument: 'after' }
  );
});

export async function getPageByEditToken(editToken) {
  const col = await pagesCol();
  return col.findOne({ editToken });
}

// Only config, theme, and meta are writable. Returns null when the token is invalid.
export async function updatePage(editToken, updates) {
  const col = await pagesCol();
  const patch = {};
  if (updates.config !== undefined) patch.config = updates.config;
  if (updates.theme !== undefined) patch.theme = updates.theme;
  if (updates.meta !== undefined) patch.meta = updates.meta;

  if (Object.keys(patch).length === 0) return null;

  return col.findOneAndUpdate(
    { editToken },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
}
