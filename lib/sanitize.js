/**
 * Lightweight server-side string sanitizer.
 * Strips HTML tags, trims whitespace, and enforces max length.
 * No external dependencies required.
 */

const HTML_TAG_RE = /<[^>]*>/g;
const MULTI_SPACE_RE = /\s{2,}/g;

/**
 * Strip HTML tags and normalize whitespace.
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(HTML_TAG_RE, '')
    .replace(MULTI_SPACE_RE, ' ')
    .trim();
}

/**
 * Sanitize a string: strip HTML, trim, enforce max length.
 */
export function sanitizeString(str, maxLength = 500) {
  const clean = stripHtml(str);
  return clean.slice(0, maxLength);
}

/**
 * Sanitize a URL string: basic validation + trim.
 * Returns empty string if not a valid-looking URL.
 */
export function sanitizeUrl(str) {
  if (typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (!trimmed) return '';
  // Allow http(s), tel:, mailto: schemes
  if (/^(https?:\/\/|tel:|mailto:)/i.test(trimmed)) {
    return trimmed.slice(0, 2048);
  }
  // If it looks like a domain, prepend https://
  if (/^[a-z0-9][\w.-]+\.[a-z]{2,}/i.test(trimmed)) {
    return `https://${trimmed}`.slice(0, 2048);
  }
  return '';
}

/**
 * Sanitize a phone number: keep digits, +, -, (, ), spaces
 */
export function sanitizePhone(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[^\d+\-() ]/g, '').trim().slice(0, 30);
}

/**
 * Sanitize an email address: basic validation.
 */
export function sanitizeEmail(str) {
  if (typeof str !== 'string') return '';
  const trimmed = str.trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed.slice(0, 254);
  }
  return '';
}

/**
 * Deep-sanitize a business profile data object before saving.
 */
export function sanitizeProfileData(data) {
  const s = { ...data };

  // Identity
  s.businessName = sanitizeString(s.businessName, 120);
  s.tagline = sanitizeString(s.tagline, 200);
  s.about = sanitizeString(s.about, 2000);

  // Contact
  if (s.contact) {
    s.contact = {
      phone: sanitizePhone(s.contact.phone),
      whatsapp: sanitizePhone(s.contact.whatsapp),
      email: sanitizeEmail(s.contact.email),
      website: sanitizeUrl(s.contact.website),
    };
  }

  // Address
  if (s.address) {
    s.address = {
      addressLine1: sanitizeString(s.address.addressLine1, 200),
      addressLine2: sanitizeString(s.address.addressLine2, 200),
      city: sanitizeString(s.address.city, 100),
      state: sanitizeString(s.address.state, 100),
      country: sanitizeString(s.address.country, 100),
      postalCode: sanitizeString(s.address.postalCode, 20),
      latitude: typeof s.address.latitude === 'number' ? s.address.latitude : null,
      longitude: typeof s.address.longitude === 'number' ? s.address.longitude : null,
    };
  }

  // Social links
  if (Array.isArray(s.socialLinks)) {
    s.socialLinks = s.socialLinks.slice(0, 20).map((link) => ({
      platform: sanitizeString(link.platform, 50),
      label: sanitizeString(link.label, 100),
      url: sanitizeUrl(link.url),
    })).filter((l) => l.url);
  }

  // Services
  if (Array.isArray(s.services)) {
    s.services = s.services.slice(0, 50).map((svc, i) => ({
      title: sanitizeString(svc.title, 120),
      description: sanitizeString(svc.description, 500),
      price: sanitizeString(String(svc.price ?? ''), 30),
      currency: sanitizeString(svc.currency || 'INR', 10),
      imageUrl: sanitizeUrl(svc.imageUrl),
      order: typeof svc.order === 'number' ? svc.order : i,
    }));
  }

  // Gallery
  if (Array.isArray(s.gallery)) {
    s.gallery = s.gallery.slice(0, 30).map((img, i) => ({
      imageUrl: sanitizeUrl(img.imageUrl),
      caption: sanitizeString(img.caption, 200),
      order: typeof img.order === 'number' ? img.order : i,
    })).filter((g) => g.imageUrl);
  }

  // Reviews
  if (Array.isArray(s.reviews)) {
    s.reviews = s.reviews.slice(0, 20).map((rev) => ({
      authorName: sanitizeString(rev.authorName, 100),
      authorPhotoUrl: sanitizeUrl(rev.authorPhotoUrl),
      rating: Math.min(5, Math.max(1, Number(rev.rating) || 5)),
      text: sanitizeString(rev.text, 500),
      date: rev.date || new Date().toISOString(),
    }));
  }

  // Theme
  if (s.theme) {
    s.theme = {
      primaryColor: sanitizeString(s.theme.primaryColor, 20) || '#4F46E5',
      secondaryColor: sanitizeString(s.theme.secondaryColor, 20) || '#7C3AED',
      accentColor: sanitizeString(s.theme.accentColor, 20) || '#10B981',
      fontFamily: sanitizeString(s.theme.fontFamily, 50) || 'Inter',
    };
  }

  return s;
}
