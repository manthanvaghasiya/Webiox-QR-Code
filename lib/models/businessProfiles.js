import { ObjectId } from 'mongodb';
import { customAlphabet } from 'nanoid';

export const COLLECTION = 'business_profiles';

const nanoid6 = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

const RESERVED_SLUGS = new Set([
  'api', 'admin', 'dashboard', 'b', 'static', 'signin', 'signup',
  'signout', 'auth', 'login', 'logout', 'register', 'settings',
  'pricing', 'about', 'contact', 'help', 'support', 'terms',
  'privacy', 'public', 'assets', 'images', 'uploads', 'edit',
  'new', 'delete', 'create', 'update', 'profile', 'profiles',
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
    col.createIndex({ qrCodeId: 1 }, { sparse: true }),
  ]);
}

// ── Slug Generation ──

export async function generateSlug(db, businessName) {
  const col = db.collection(COLLECTION);
  const base = slugify(businessName || 'business');

  // First try the clean slug
  if (base && !RESERVED_SLUGS.has(base)) {
    const exists = await col.findOne({ slug: base }, { projection: { _id: 1 } });
    if (!exists) return base;
  }

  // Append random suffix on collision
  for (let i = 0; i < 5; i++) {
    const candidate = `${base || 'biz'}-${nanoid6()}`;
    if (RESERVED_SLUGS.has(candidate)) continue;
    const exists = await col.findOne({ slug: candidate }, { projection: { _id: 1 } });
    if (!exists) return candidate;
  }
  throw new Error('generateSlug: failed after 5 attempts');
}

export function isSlugReserved(slug) {
  return RESERVED_SLUGS.has(slugify(slug));
}

// ── Default business hours ──

function defaultBusinessHours() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((day, i) => ({
    day,
    isOpen: i < 6, // Mon–Sat open by default
    slots: [{ open: '09:00', close: '18:00' }],
  }));
}

// ── Create ──

export async function createProfile(db, data) {
  const now = new Date();
  const slug = data.slug || await generateSlug(db, data.businessName);

  const doc = {
    userId: toObjectId(data.userId),
    qrCodeId: data.qrCodeId ? toObjectId(data.qrCodeId) : null,
    slug,

    // Identity
    businessName: data.businessName || '',
    tagline: data.tagline || '',
    logoUrl: data.logoUrl || null,
    coverImageUrl: data.coverImageUrl || null,
    about: data.about || '',

    // Contact
    contact: {
      phone: data.contact?.phone || '',
      whatsapp: data.contact?.whatsapp || '',
      email: data.contact?.email || '',
      website: data.contact?.website || '',
    },

    // Address & map
    address: {
      addressLine1: data.address?.addressLine1 || '',
      addressLine2: data.address?.addressLine2 || '',
      city: data.address?.city || '',
      state: data.address?.state || '',
      country: data.address?.country || '',
      postalCode: data.address?.postalCode || '',
      latitude: data.address?.latitude ?? null,
      longitude: data.address?.longitude ?? null,
    },
    timezone: data.timezone || 'Asia/Kolkata',

    // Business hours
    businessHours: data.businessHours || defaultBusinessHours(),

    // Social links
    socialLinks: data.socialLinks || [],

    // Services/Products
    services: data.services || [],

    // Gallery
    gallery: data.gallery || [],

    // Reviews/Testimonials
    reviews: data.reviews || [],

    // Theme
    theme: {
      primaryColor: data.theme?.primaryColor || '#4F46E5',
      secondaryColor: data.theme?.secondaryColor || '#7C3AED',
      accentColor: data.theme?.accentColor || '#10B981',
      fontFamily: data.theme?.fontFamily || 'Inter',
    },

    // Counters
    totalScans: 0,
    totalCalls: 0,
    totalDirectionClicks: 0,
    totalContactSaves: 0,

    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

// ── Read ──

export async function findProfileBySlug(db, slug) {
  return db.collection(COLLECTION).findOne({ slug, isActive: true });
}

export async function findProfileById(db, id, userId) {
  const filter = { _id: toObjectId(id) };
  if (userId) filter.userId = toObjectId(userId);
  return db.collection(COLLECTION).findOne(filter);
}

export async function findProfilesByUser(db, userId) {
  return db.collection(COLLECTION)
    .find({ userId: toObjectId(userId), isActive: true })
    .sort({ createdAt: -1 })
    .toArray();
}

// ── Update ──

const ALLOWED_UPDATE_FIELDS = [
  'businessName', 'tagline', 'logoUrl', 'coverImageUrl', 'about',
  'contact', 'address', 'timezone', 'businessHours',
  'socialLinks', 'services', 'gallery', 'reviews', 'theme',
];

export async function updateProfile(db, id, userId, patch) {
  const $set = { updatedAt: new Date() };
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (patch[key] !== undefined) {
      $set[key] = patch[key];
    }
  }
  return db.collection(COLLECTION).findOneAndUpdate(
    { _id: toObjectId(id), userId: toObjectId(userId) },
    { $set },
    { returnDocument: 'after' },
  );
}

// ── Soft Delete ──

export async function deleteProfile(db, id, userId) {
  return db.collection(COLLECTION).findOneAndUpdate(
    { _id: toObjectId(id), userId: toObjectId(userId) },
    { $set: { isActive: false, updatedAt: new Date() } },
    { returnDocument: 'after' },
  );
}

// ── Counter increments ──

export async function incrementCounter(db, slug, field) {
  const allowed = ['totalScans', 'totalCalls', 'totalDirectionClicks', 'totalContactSaves'];
  if (!allowed.includes(field)) return null;
  return db.collection(COLLECTION).updateOne(
    { slug },
    { $inc: { [field]: 1 } },
  );
}

// ── Link QR ──

export async function linkQrCode(db, profileId, qrCodeId) {
  return db.collection(COLLECTION).updateOne(
    { _id: toObjectId(profileId) },
    { $set: { qrCodeId: toObjectId(qrCodeId), updatedAt: new Date() } },
  );
}
