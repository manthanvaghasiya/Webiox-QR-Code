import { ObjectId } from 'mongodb';

export const COLLECTION = 'business_profiles';

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ username: 1 }, { unique: true }),
    col.createIndex({ userId: 1 }),
  ]);
}

export async function createProfile(db, data) {
  const now = new Date();
  const doc = {
    userId: data.userId instanceof ObjectId ? data.userId : new ObjectId(data.userId),
    username: data.username,
    displayName: data.displayName ?? null,
    tagline: data.tagline ?? null,
    bio: data.bio ?? null,
    photo: data.photo ?? null,
    coverImage: data.coverImage ?? null,
    theme: {
      primary: data.theme?.primary ?? '#000000',
      accent: data.theme?.accent ?? '#ffffff',
      mode: data.theme?.mode ?? 'light',
      font: data.theme?.font ?? null,
    },
    contact: {
      phone: data.contact?.phone ?? null,
      whatsapp: data.contact?.whatsapp ?? null,
      email: data.contact?.email ?? null,
      address: data.contact?.address ?? null,
      mapsUrl: data.contact?.mapsUrl ?? null,
    },
    hours: data.hours ?? [],
    services: data.services ?? [],
    products: data.products ?? [],
    socialLinks: data.socialLinks ?? [],
    gallery: data.gallery ?? [],
    ctaButton: data.ctaButton ?? null,
    reviews: {
      googleMapsUrl: data.reviews?.googleMapsUrl ?? null,
      displayCount: data.reviews?.displayCount ?? 3,
      autoFetch: data.reviews?.autoFetch ?? false,
    },
    visibility: data.visibility ?? 'public',
    visitCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findProfileByUsername(db, username) {
  return db.collection(COLLECTION).findOne({ username });
}

export async function findProfilesByUser(db, userId) {
  return db.collection(COLLECTION)
    .find({ userId: userId instanceof ObjectId ? userId : new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function updateProfile(db, id, userId, patch) {
  return db.collection(COLLECTION).findOneAndUpdate(
    {
      _id: new ObjectId(id),
      userId: userId instanceof ObjectId ? userId : new ObjectId(userId),
    },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
}

export async function incrementVisit(db, username) {
  return db.collection(COLLECTION).updateOne(
    { username },
    { $inc: { visitCount: 1 } }
  );
}
