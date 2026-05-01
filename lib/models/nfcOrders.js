import { ObjectId } from 'mongodb';

export const COLLECTION = 'nfc_orders';

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1 }),
    col.createIndex({ status: 1 }),
    col.createIndex({ createdAt: -1 }),
  ]);
}

export async function createOrder(db, data) {
  const now = new Date();
  const doc = {
    userId: data.userId instanceof ObjectId ? data.userId : new ObjectId(data.userId),
    profileId: data.profileId ? new ObjectId(data.profileId) : null,
    cardDesign: {
      material: data.cardDesign?.material ?? 'pvc',
      color: data.cardDesign?.color ?? null,
      finish: data.cardDesign?.finish ?? null,
      customLogo: data.cardDesign?.customLogo ?? null,
    },
    shippingAddress: {
      fullName: data.shippingAddress?.fullName ?? null,
      line1: data.shippingAddress?.line1 ?? null,
      line2: data.shippingAddress?.line2 ?? null,
      city: data.shippingAddress?.city ?? null,
      state: data.shippingAddress?.state ?? null,
      zip: data.shippingAddress?.zip ?? null,
      country: data.shippingAddress?.country ?? null,
      phone: data.shippingAddress?.phone ?? null,
    },
    quantity: data.quantity ?? 1,
    unitPrice: data.unitPrice,
    totalPrice: data.totalPrice,
    currency: data.currency ?? 'USD',
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: data.paymentMethod ?? null,
    paymentRef: data.paymentRef ?? null,
    notes: data.notes ?? null,
    trackingNumber: null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findOrdersByUser(db, userId, { limit = 20, skip = 0 } = {}) {
  return db.collection(COLLECTION)
    .find({ userId: userId instanceof ObjectId ? userId : new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function findAllOrders(db, { status, limit = 50, skip = 0 } = {}) {
  const filter = status ? { status } : {};
  return db.collection(COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function updateOrderStatus(db, id, patch) {
  return db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
}
