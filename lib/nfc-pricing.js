// Normalize card type to lowercase
function normalizeCardType(type) {
  if (!type) return null;
  return type.toLowerCase();
}

export const CARD_TYPE_INFO = {
  pvc: { name: 'PVC Card', description: 'Classic plastic card with NFC chip', basePrice: 50 },
  metal: { name: 'Metal Card', description: 'Premium metal card with embedded NFC', basePrice: 150 },
  wood: { name: 'Wood Card', description: 'Eco-friendly wooden card with NFC', basePrice: 200 },
};

export function calculatePrice(cardType, quantity) {
  const normalized = normalizeCardType(cardType);
  const cardInfo = CARD_TYPE_INFO[normalized];
  if (!cardInfo) throw new Error('Invalid card type');

  const basePrice = cardInfo.basePrice;
  let discountPercent = 0;

  if (quantity >= 100) {
    discountPercent = 15;
  } else if (quantity >= 50) {
    discountPercent = 10;
  } else if (quantity >= 25) {
    discountPercent = 5;
  }

  const pricePerCard = basePrice * (1 - discountPercent / 100);
  return Math.round(pricePerCard * quantity);
}
