import { ObjectId } from 'mongodb';

export const COLLECTION = 'nfc_orders';

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

function calculatePrice(cardType, quantity) {
  const pricePerCard = {
    pvc: 50,
    metal: 150,
    wood: 200,
  };

  const unitPrice = pricePerCard[cardType] || 50;
  const basePrice = unitPrice * quantity;

  let discount = 0;
  if (quantity >= 100) {
    discount = basePrice * 0.15;
  } else if (quantity >= 50) {
    discount = basePrice * 0.1;
  } else if (quantity >= 25) {
    discount = basePrice * 0.05;
  }

  return Math.round(basePrice - discount);
}

export const CARD_TYPE_INFO = {
  pvc: { name: 'PVC Card', description: 'Classic plastic card with NFC chip', icon: '💳', basePrice: 50 },
  metal: { name: 'Metal Card', description: 'Premium metal card with embedded NFC', icon: '⚙️', basePrice: 150 },
  wood: { name: 'Wood Card', description: 'Eco-friendly wooden card with NFC', icon: '🌿', basePrice: 200 },
};
