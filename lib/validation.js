/**
 * Validation utilities for input sanitization and schema checking
 */

import { ObjectId } from 'mongodb';

const ALLOWED_FONTS = [
  'Inter',
  'Roboto',
  'Poppins',
  'Playfair Display',
  'Montserrat',
  'Raleway',
  'Lato',
  'Open Sans',
  'Oswald',
  'Bebas Neue',
];

const ALLOWED_COLORS = /^#[0-9A-F]{6}$/i;
const ALLOWED_BLOCK_TYPES = ['link', 'phone', 'email', 'social', 'text', 'image', 'video'];
const BLOCK_ID_PATTERN = /^[a-z0-9]{6}$/;
const URL_PATTERN = /^(https?:\/\/|tel:|mailto:|sms:|wa\.me\/)/;

// Validate block ID format (6 alphanumeric chars from nanoid)
export function validateBlockId(blockId) {
  if (!blockId || typeof blockId !== 'string') return false;
  return BLOCK_ID_PATTERN.test(blockId);
}

// Validate color format (hex)
export function validateColor(color) {
  if (!color || typeof color !== 'string') return false;
  return ALLOWED_COLORS.test(color);
}

// Validate font family (only allow whitelisted fonts)
export function validateFontFamily(font) {
  if (!font || typeof font !== 'string') return false;
  return ALLOWED_FONTS.includes(font);
}

// Validate block URL format
export function validateBlockUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.length > 2000) return false;
  return URL_PATTERN.test(url);
}

// Validate block label (max 100 chars)
export function validateBlockLabel(label) {
  if (typeof label !== 'string') return false;
  if (label.length === 0 || label.length > 100) return false;
  return true;
}

// Validate block type
export function validateBlockType(type) {
  return type && ALLOWED_BLOCK_TYPES.includes(type);
}

// Validate and sanitize a single block
export function validateBlock(block, index) {
  if (!block || typeof block !== 'object') {
    throw new Error(`Block ${index} is not an object`);
  }

  const sanitized = {
    id: block.id || undefined, // Will be generated if not provided
    type: block.type || 'link',
    label: block.label || '',
    icon: block.icon || '',
    url: block.url || '',
    color: block.color || null,
    order: block.order ?? index,
  };

  // Validate types
  if (!validateBlockType(sanitized.type)) {
    throw new Error(`Block ${index}: Invalid type "${sanitized.type}"`);
  }

  if (sanitized.label && !validateBlockLabel(sanitized.label)) {
    throw new Error(`Block ${index}: Label must be 1-100 characters`);
  }

  if (sanitized.url && !validateBlockUrl(sanitized.url)) {
    throw new Error(`Block ${index}: Invalid URL format or length > 2000 chars`);
  }

  if (sanitized.color && !validateColor(sanitized.color)) {
    throw new Error(`Block ${index}: Invalid color format (use #RRGGBB)`);
  }

  return sanitized;
}

// Validate blocks array
export function validateBlocks(blocks) {
  if (!Array.isArray(blocks)) {
    throw new Error('Blocks must be an array');
  }

  if (blocks.length === 0 || blocks.length > 50) {
    throw new Error('Blocks must have 1-50 items');
  }

  return blocks.map((b, idx) => validateBlock(b, idx));
}

// Validate theme object
export function validateTheme(theme) {
  if (!theme || typeof theme !== 'object') {
    return null;
  }

  const sanitized = {
    template: theme.template || 'feature-rich',
    primaryColor: theme.primaryColor || '#4F46E5',
    secondaryColor: theme.secondaryColor || '#7C3AED',
    fontFamily: theme.fontFamily || 'Inter',
  };

  if (!validateColor(sanitized.primaryColor)) {
    throw new Error('Invalid primaryColor format');
  }

  if (!validateColor(sanitized.secondaryColor)) {
    throw new Error('Invalid secondaryColor format');
  }

  if (!validateFontFamily(sanitized.fontFamily)) {
    throw new Error(`Invalid fontFamily. Allowed: ${ALLOWED_FONTS.join(', ')}`);
  }

  return sanitized;
}

// Validate string length
export function validateStringLength(str, min = 1, max = 500) {
  if (typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
}

// Validate design object for QR codes
export function validateQrDesign(design) {
  if (!design || typeof design !== 'object') {
    return null;
  }

  const sanitized = {};

  if (design.fgColor !== undefined) {
    if (!validateColor(design.fgColor)) {
      throw new Error('Invalid design.fgColor');
    }
    sanitized.fgColor = design.fgColor;
  }

  if (design.bgColor !== undefined) {
    if (!validateColor(design.bgColor)) {
      throw new Error('Invalid design.bgColor');
    }
    sanitized.bgColor = design.bgColor;
  }

  if (design.gradientColor !== undefined && design.gradientColor !== null) {
    if (!validateColor(design.gradientColor)) {
      throw new Error('Invalid design.gradientColor');
    }
    sanitized.gradientColor = design.gradientColor;
  }

  return sanitized;
}

// Validate business profile basic info
export function validateBusinessProfile(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data');
  }

  if (!validateStringLength(data.businessName, 2, 100)) {
    throw new Error('businessName must be 2-100 characters');
  }

  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format');
  }

  if (data.phone && !validateStringLength(data.phone, 5, 20)) {
    throw new Error('phone must be 5-20 characters');
  }

  if (data.website && !isValidUrl(data.website)) {
    throw new Error('Invalid website URL');
  }

  return true;
}

// Helper: validate email
export function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Helper: validate URL
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Sanitize for MongoDB: handle Date serialization
export function serializeMongo(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // Keep dates as ISO strings for consistency
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
}
