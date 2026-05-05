import { ObjectId } from 'mongodb';
import { CARD_TYPE_INFO, calculatePrice } from '@/lib/nfc-pricing';

export const COLLECTION = 'nfc_orders';
export { CARD_TYPE_INFO, calculatePrice };

const CARD_TYPES = ['pvc', 'metal', 'wood'];
const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export async function createIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ userId: 1, createdAt: -1 }),
    col.createIndex({ profileId: 1 }),
    col.createIndex({ status: 1 }),
    col.createIndex({ createdAt: -1 }),
  ]);
}

export async function createNfcOrder(db, data) {
  const now = new Date();
  const col = db.collection(COLLECTION);

  if (!CARD_TYPES.includes(data.cardType)) {
    throw new Error('Invalid card type');
  }

  const doc = {
    userId: new ObjectId(data.userId),
    profileId: new ObjectId(data.profileId),
    cardType: data.cardType,
    design: {
      color: data.design?.color || '#4F46E5',
      logoPosition: data.design?.logoPosition || 'top',
      quantity: data.design?.quantity || 10,
    },
    contactInfo: {
      name: data.contactInfo?.name || '',
      email: data.contactInfo?.email || '',
      phone: data.contactInfo?.phone || '',
      address: data.contactInfo?.address || '',
    },
    status: 'pending',
    totalPrice: calculatePrice(data.cardType, data.design?.quantity || 10),
    trackingNumber: null,
    notes: data.notes || '',
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findNfcOrdersByUser(db, userId) {
  const col = db.collection(COLLECTION);
  return col
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findNfcOrderById(db, orderId, userId = null) {
  const col = db.collection(COLLECTION);
  const filter = { _id: new ObjectId(orderId) };
  if (userId) {
    filter.userId = new ObjectId(userId);
  }
  return col.findOne(filter);
}

