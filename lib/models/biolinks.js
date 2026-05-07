// ─────────────────────────────────────────────────────────────────────────────
// BIOLINKS MODEL — Linktree-style landing pages
//
// Collection: `biolinks`
// Fields: slug (unique URL part), userId, title, bio, avatarUrl, blocks[]
//   (each block: type/label/url/icon for phone/email/website/social),
//   theme, blockClicks (per-block click counts), totalClicks
// Public URL: /link/{slug}  ·  Auto-created when a business profile is created.
// ─────────────────────────────────────────────────────────────────────────────

import { ObjectId } from 'mongodb';
import { customAlphabet } from 'nanoid';

export const COLLECTION = 'biolinks';

const nanoid6 = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

const RESERVED_SLUGS = new Set([
  'api', 'admin', 'dashboard', 'link', 'links', 'static', 'signin', 'signup',
  'signout', 'auth', 'login', 'logout', 'register', 'settings',
  'pricing', 'about', 'contact', 'help', 'support', 'terms',
  'privacy', 'public', 'assets', 'images', 'uploads', 'edit',
  'new', 'delete', 'create', 'update', 'profile', 'profiles', 'b',
]);

function toObjectId(v) {
  if (!v) return null;
  return v instanceof ObjectId ? v : new ObjectId(v);
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

// ── Indexes ──

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ slug: 1 }, { unique: true }),
    col.createIndex({ userId: 1 }),
  ]);
}

// ── Slug Generation ──

export async function generateSlug(db, title) {
  const col = db.collection(COLLECTION);
  const base = slugify(title || 'biolink');

  if (base && !RESERVED_SLUGS.has(base)) {
    const exists = await col.findOne({ slug: base }, { projection: { _id: 1 } });
    if (!exists) return base;
  }

  for (let i = 0; i < 5; i++) {
    const candidate = `${base || 'link'}-${nanoid6()}`;
    if (RESERVED_SLUGS.has(candidate)) continue;
    const exists = await col.findOne({ slug: candidate }, { projection: { _id: 1 } });
    if (!exists) return candidate;
  }
  throw new Error('generateSlug: failed after 5 attempts');
}

export function isSlugReserved(slug) {
  return RESERVED_SLUGS.has(slugify(slug));
}

// ── Create ──

export async function createBiolink(db, data) {
  const now = new Date();
  const slug = data.slug || await generateSlug(db, data.title);

  const doc = {
    userId: toObjectId(data.userId),
    slug,
    customDomain: data.customDomain || null,

    // Branding
    title: data.title || '',
    bio: data.bio || '',
    avatarUrl: data.avatarUrl || null,
    backgroundUrl: data.backgroundUrl || null,

    // Theme
    theme: {
      template: data.theme?.template || 'feature-rich',
      primaryColor: data.theme?.primaryColor || '#4F46E5',
      secondaryColor: data.theme?.secondaryColor || '#7C3AED',
      fontFamily: data.theme?.fontFamily || 'Inter',
    },

    // Blocks (links)
    blocks: Array.isArray(data.blocks) ? data.blocks.map((b, idx) => ({
      id: b.id || nanoid6(),
      type: b.type || 'link',
      label: b.label || '',
      icon: b.icon || '',
      url: b.url || '',
      color: b.color || null,
      order: b.order ?? idx,
    })) : [],

    // Analytics
    totalClicks: 0,
    blockClicks: {}, // { blockId: count }

    // Metadata
    isPublished: data.isPublished ?? true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

// ── Read ──

export async function findBiolinkBySlug(db, slug) {
  return db.collection(COLLECTION).findOne({ slug, isActive: true });
}

export async function findBiolinkById(db, id, userId) {
  const filter = { _id: toObjectId(id) };
  if (userId) filter.userId = toObjectId(userId);
  return db.collection(COLLECTION).findOne(filter);
}

export async function findBiolinksByUser(db, userId) {
  return db.collection(COLLECTION)
    .find({ userId: toObjectId(userId), isActive: true })
    .sort({ createdAt: -1 })
    .toArray();
}

// ── Update ──

export async function updateBiolink(db, id, userId, patch) {
  const filter = { _id: toObjectId(id), userId: toObjectId(userId) };
  const update = {
    $set: {
      ...patch,
      updatedAt: new Date(),
    },
  };

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    filter,
    update,
    { returnDocument: 'after' }
  );

  return result.value;
}

// ── Delete ──

export async function deleteBiolink(db, id, userId) {
  const filter = { _id: toObjectId(id), userId: toObjectId(userId) };
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    filter,
    { $set: { isActive: false, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  return result.value;
}

// ── Analytics ──

export async function recordBlockClick(db, id, blockId) {
  const filter = { _id: toObjectId(id) };
  const update = {
    $inc: {
      'totalClicks': 1,
      [`blockClicks.${blockId}`]: 1,
    },
  };

  return db.collection(COLLECTION).findOneAndUpdate(filter, update, { returnDocument: 'after' });
}

export async function getBlockClicks(db, id) {
  const biolink = await findBiolinkById(db, id);
  if (!biolink) return null;

  return {
    _id: biolink._id,
    totalClicks: biolink.totalClicks || 0,
    blockClicks: biolink.blockClicks || {},
    blocks: biolink.blocks || [],
  };
}
