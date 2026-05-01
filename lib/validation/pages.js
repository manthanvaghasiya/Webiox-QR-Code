// Shared validation for POST /api/pages and PATCH /api/pages/[token].
//
// The two routes share a validator (with `partial: true` for PATCH) so a field
// shape is enforced consistently no matter how it gets into the DB.

export const ALLOWED_TYPES = ['social'];
// Reserved (will be added as renderers ship):
// 'pdf', 'business', 'rating', 'feedback', 'coupon', 'gallery', 'mp3', 'video', 'appstore'

export const MAX_BODY_BYTES = 50 * 1024;
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 300;

function fail(error, status = 400) {
  return { ok: false, error, status };
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isSafeUrl(s) {
  if (typeof s !== 'string' || !s.trim()) return false;
  try {
    const u = new URL(s);
    return !['javascript:', 'data:'].includes(u.protocol.toLowerCase());
  } catch {
    return false;
  }
}

// Read JSON body and reject if it exceeds the byte budget. Returns
// { ok:true, body } or { ok:false, error, status }.
export async function readJsonBodyWithLimit(request, maxBytes = MAX_BODY_BYTES) {
  let text;
  try {
    text = await request.text();
  } catch {
    return fail('Could not read request body');
  }
  if (Buffer.byteLength(text, 'utf8') > maxBytes) {
    return fail('Request body exceeds 50KB limit', 413);
  }
  try {
    return { ok: true, body: JSON.parse(text || '{}') };
  } catch {
    return fail('Invalid JSON');
  }
}

function validateSocialConfig(config, { partial }) {
  if (!isPlainObject(config)) return fail('config must be an object');

  const out = {};

  if (config.pageTitle !== undefined) {
    if (typeof config.pageTitle !== 'string') return fail('config.pageTitle must be a string');
    out.pageTitle = config.pageTitle;
  } else if (!partial) {
    return fail('config.pageTitle is required');
  }

  if (config.pageDescription !== undefined) {
    if (typeof config.pageDescription !== 'string') return fail('config.pageDescription must be a string');
    out.pageDescription = config.pageDescription;
  }

  if (config.links !== undefined) {
    if (!Array.isArray(config.links)) return fail('config.links must be an array');
    if (!partial && config.links.length === 0) return fail('config.links must not be empty');
    const cleanedLinks = [];
    for (let i = 0; i < config.links.length; i++) {
      const link = config.links[i];
      if (!isPlainObject(link)) return fail(`config.links[${i}] must be an object`);
      if (typeof link.platform !== 'string' || !link.platform.trim()) {
        return fail(`config.links[${i}].platform is required`);
      }
      if (!isSafeUrl(link.url)) {
        return fail(`config.links[${i}].url is not a valid URL`);
      }
      const cleaned = { platform: link.platform, url: link.url };
      if (link.label !== undefined) {
        if (typeof link.label !== 'string') return fail(`config.links[${i}].label must be a string`);
        cleaned.label = link.label;
      }
      cleanedLinks.push(cleaned);
    }
    out.links = cleanedLinks;
  } else if (!partial) {
    return fail('config.links is required');
  }

  return { ok: true, value: out };
}

function validateConfig(type, config, { partial }) {
  switch (type) {
    case 'social':
      return validateSocialConfig(config, { partial });
    default:
      return fail(`Unsupported type: ${type}`);
  }
}

function validateTheme(theme) {
  if (theme === undefined) return { ok: true, value: undefined };
  if (!isPlainObject(theme)) return fail('theme must be an object');

  const out = {};
  for (const key of ['primaryColor', 'accentColor', 'bgColor', 'textColor']) {
    if (theme[key] === undefined) continue;
    if (typeof theme[key] !== 'string') return fail(`theme.${key} must be a string`);
    out[key] = theme[key];
  }
  if (theme.logoUrl !== undefined && theme.logoUrl !== null) {
    if (!isSafeUrl(theme.logoUrl)) return fail('theme.logoUrl is not a valid URL');
    out.logoUrl = theme.logoUrl;
  } else if (theme.logoUrl === null) {
    out.logoUrl = null;
  }
  return { ok: true, value: out };
}

function validateMeta(meta) {
  if (meta === undefined) return { ok: true, value: undefined };
  if (!isPlainObject(meta)) return fail('meta must be an object');

  const out = {};
  if (meta.title !== undefined) {
    if (typeof meta.title !== 'string') return fail('meta.title must be a string');
    if (meta.title.length > MAX_TITLE) return fail(`meta.title must be ≤ ${MAX_TITLE} characters`);
    out.title = meta.title;
  }
  if (meta.description !== undefined) {
    if (typeof meta.description !== 'string') return fail('meta.description must be a string');
    if (meta.description.length > MAX_DESCRIPTION) return fail(`meta.description must be ≤ ${MAX_DESCRIPTION} characters`);
    out.description = meta.description;
  }
  if (meta.ogImageUrl !== undefined && meta.ogImageUrl !== null) {
    if (!isSafeUrl(meta.ogImageUrl)) return fail('meta.ogImageUrl is not a valid URL');
    out.ogImageUrl = meta.ogImageUrl;
  } else if (meta.ogImageUrl === null) {
    out.ogImageUrl = null;
  }
  return { ok: true, value: out };
}

// Validate a POST body (full page) or a PATCH body (partial update with `partial: true`).
// Returns { ok:true, value } where value has only validated keys present, or
// { ok:false, error, status }.
export function validatePageInput(input, { partial = false } = {}) {
  if (!isPlainObject(input)) return fail('Body must be a JSON object');

  const value = {};

  // type: required for POST, forbidden in PATCH
  if (partial) {
    if (input.type !== undefined) return fail('type cannot be changed via PATCH');
  } else {
    if (typeof input.type !== 'string' || !ALLOWED_TYPES.includes(input.type)) {
      return fail(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
    }
    value.type = input.type;
  }

  // config: required for POST; optional for PATCH but if present must validate.
  // We need the type for type-specific validation. On PATCH, fetch caller passes
  // the existing page's type via the second arg's `existingType`.
  const effectiveType = value.type ?? input._existingType;

  if (input.config !== undefined) {
    if (!effectiveType) return fail('Cannot validate config without type');
    if (!isPlainObject(input.config)) return fail('config must be an object');
    if (!partial && Object.keys(input.config).length === 0) return fail('config must be a non-empty object');
    const r = validateConfig(effectiveType, input.config, { partial });
    if (!r.ok) return r;
    value.config = r.value;
  } else if (!partial) {
    return fail('config is required');
  }

  if (input.theme !== undefined) {
    const r = validateTheme(input.theme);
    if (!r.ok) return r;
    if (r.value !== undefined) value.theme = r.value;
  }

  if (input.meta !== undefined) {
    const r = validateMeta(input.meta);
    if (!r.ok) return r;
    if (r.value !== undefined) value.meta = r.value;
  }

  // PATCH must change at least one writable field
  if (partial && Object.keys(value).length === 0) {
    return fail('No writable fields provided');
  }

  return { ok: true, value };
}
