/**
 * QR Code Type System
 * Supports 20+ different QR code types with configuration
 */

export const QR_TYPES = {
  // Contact & Communication
  VCARD: 'vcard',
  MECARD: 'mecard',
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',

  // Web & URLs
  URL: 'url',
  WIFI: 'wifi',
  TEXT: 'text',

  // Events & Calendar
  EVENT: 'event',
  GEOLOCATION: 'geolocation',

  // Business
  BUSINESS_PROFILE: 'business-profile',
  BIO_LINK: 'bio-link',

  // Payment & Commerce
  PAYPAL: 'paypal',
  VENMO: 'venmo',
  BITCOIN: 'bitcoin',
  CRYPTO: 'crypto',

  // Media & Files
  PDF: 'pdf',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',

  // Social Media
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  GITHUB: 'github',

  // App Store
  APP_STORE: 'app-store',
  GOOGLE_PLAY: 'google-play',

  // Other
  APP_DOWNLOAD: 'app-download',
  COUPON: 'coupon',
  RATING: 'rating',
  FEEDBACK: 'feedback',
};

/**
 * Type metadata with icons, descriptions, and configuration schemas
 */
export const TYPE_METADATA = {
  [QR_TYPES.VCARD]: {
    label: 'vCard Contact',
    icon: '📇',
    category: 'contact',
    description: 'Downloadable contact card (.vcf file)',
    configFields: ['name', 'email', 'phone', 'address'],
  },
  [QR_TYPES.MECARD]: {
    label: 'meCard',
    icon: '📋',
    category: 'contact',
    description: 'Compact contact format for phones',
    configFields: ['name', 'email', 'phone'],
  },
  [QR_TYPES.EMAIL]: {
    label: 'Email',
    icon: '✉️',
    category: 'contact',
    description: 'Open email client with preset recipient',
    configFields: ['email', 'subject', 'body'],
  },
  [QR_TYPES.PHONE]: {
    label: 'Phone Call',
    icon: '☎️',
    category: 'contact',
    description: 'Initiate phone call',
    configFields: ['phone'],
  },
  [QR_TYPES.SMS]: {
    label: 'Text Message',
    icon: '💬',
    category: 'contact',
    description: 'Send SMS with preset message',
    configFields: ['phone', 'message'],
  },
  [QR_TYPES.WHATSAPP]: {
    label: 'WhatsApp',
    icon: '💚',
    category: 'contact',
    description: 'Open WhatsApp chat',
    configFields: ['phone', 'message'],
  },
  [QR_TYPES.URL]: {
    label: 'URL / Website',
    icon: '🌐',
    category: 'web',
    description: 'Link to any website or web page',
    configFields: ['url'],
  },
  [QR_TYPES.WIFI]: {
    label: 'WiFi Network',
    icon: '📡',
    category: 'web',
    description: 'Connect to WiFi network',
    configFields: ['ssid', 'password', 'security'],
  },
  [QR_TYPES.TEXT]: {
    label: 'Plain Text',
    icon: '📝',
    category: 'web',
    description: 'Store and display plain text',
    configFields: ['text'],
  },
  [QR_TYPES.EVENT]: {
    label: 'Calendar Event',
    icon: '📅',
    category: 'event',
    description: 'Add event to calendar (iCal format)',
    configFields: ['title', 'startDate', 'endDate', 'location', 'description'],
  },
  [QR_TYPES.GEOLOCATION]: {
    label: 'Location / Map',
    icon: '🗺️',
    category: 'event',
    description: 'Open location on Google Maps',
    configFields: ['latitude', 'longitude', 'altitude'],
  },
  [QR_TYPES.BUSINESS_PROFILE]: {
    label: 'Business Profile',
    icon: '🏢',
    category: 'business',
    description: 'Link to business profile page',
    configFields: ['businessName', 'slug'],
  },
  [QR_TYPES.BIO_LINK]: {
    label: 'Bio Link',
    icon: '🔗',
    category: 'business',
    description: 'Link to bio-link landing page',
    configFields: ['title', 'slug'],
  },
  [QR_TYPES.PAYPAL]: {
    label: 'PayPal Payment',
    icon: '💳',
    category: 'payment',
    description: 'Request payment via PayPal',
    configFields: ['email', 'amount', 'itemName'],
  },
  [QR_TYPES.BITCOIN]: {
    label: 'Bitcoin Address',
    icon: '₿',
    category: 'payment',
    description: 'Bitcoin wallet address',
    configFields: ['address', 'amount'],
  },
  [QR_TYPES.VENMO]: {
    label: 'Venmo',
    icon: '💵',
    category: 'payment',
    description: 'Send payment via Venmo',
    configFields: ['username', 'amount', 'note'],
  },
  [QR_TYPES.PDF]: {
    label: 'PDF Document',
    icon: '📄',
    category: 'media',
    description: 'Link to PDF file download',
    configFields: ['url', 'filename'],
  },
  [QR_TYPES.IMAGE]: {
    label: 'Image',
    icon: '🖼️',
    category: 'media',
    description: 'Display image',
    configFields: ['url'],
  },
  [QR_TYPES.VIDEO]: {
    label: 'Video',
    icon: '🎬',
    category: 'media',
    description: 'Play video (YouTube, Vimeo, etc)',
    configFields: ['url'],
  },
  [QR_TYPES.INSTAGRAM]: {
    label: 'Instagram',
    icon: '📷',
    category: 'social',
    description: 'Link to Instagram profile',
    configFields: ['username'],
  },
  [QR_TYPES.FACEBOOK]: {
    label: 'Facebook',
    icon: '👤',
    category: 'social',
    description: 'Link to Facebook profile/page',
    configFields: ['profileId'],
  },
  [QR_TYPES.TWITTER]: {
    label: 'Twitter / X',
    icon: '𝕏',
    category: 'social',
    description: 'Link to Twitter profile',
    configFields: ['username'],
  },
  [QR_TYPES.LINKEDIN]: {
    label: 'LinkedIn',
    icon: '💼',
    category: 'social',
    description: 'Link to LinkedIn profile',
    configFields: ['profileId'],
  },
  [QR_TYPES.YOUTUBE]: {
    label: 'YouTube',
    icon: '▶️',
    category: 'social',
    description: 'Link to YouTube channel/video',
    configFields: ['channelId'],
  },
  [QR_TYPES.TIKTOK]: {
    label: 'TikTok',
    icon: '🎵',
    category: 'social',
    description: 'Link to TikTok profile',
    configFields: ['username'],
  },
  [QR_TYPES.GITHUB]: {
    label: 'GitHub',
    icon: '🐙',
    category: 'social',
    description: 'Link to GitHub profile',
    configFields: ['username'],
  },
  [QR_TYPES.APP_STORE]: {
    label: 'App Store',
    icon: '🎯',
    category: 'app',
    description: 'iOS App Store link',
    configFields: ['appId'],
  },
  [QR_TYPES.GOOGLE_PLAY]: {
    label: 'Google Play',
    icon: '🤖',
    category: 'app',
    description: 'Android Google Play link',
    configFields: ['packageName'],
  },
  [QR_TYPES.COUPON]: {
    label: 'Coupon / Discount',
    icon: '🏷️',
    category: 'commerce',
    description: 'Redeemable coupon code',
    configFields: ['code', 'discount', 'expiryDate'],
  },
  [QR_TYPES.RATING]: {
    label: 'Review / Rating',
    icon: '⭐',
    category: 'commerce',
    description: 'Link to leave review',
    configFields: ['url'],
  },
};

/**
 * Get all available QR types grouped by category
 */
export function getQrTypesByCategory() {
  const grouped = {};

  Object.entries(TYPE_METADATA).forEach(([type, meta]) => {
    if (!grouped[meta.category]) {
      grouped[meta.category] = [];
    }
    grouped[meta.category].push({ type, ...meta });
  });

  return grouped;
}

/**
 * Get metadata for a specific QR type
 */
export function getQrTypeMetadata(type) {
  return TYPE_METADATA[type] || null;
}

/**
 * Get all QR types as array
 */
export function getAllQrTypes() {
  return Object.entries(TYPE_METADATA).map(([type, meta]) => ({
    type,
    ...meta,
  }));
}
