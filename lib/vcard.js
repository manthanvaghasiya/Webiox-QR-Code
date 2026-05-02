/**
 * vCard 3.0 generator for Business Profiles.
 * Generates a standards-compliant .vcf string.
 */

function esc(v) {
  return String(v ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Generate a vCard 3.0 string from a business profile document.
 * @param {Object} profile - The full business profile document
 * @returns {string} vCard 3.0 formatted string
 */
export function generateVCard(profile) {
  const c = profile.contact || {};
  const a = profile.address || {};

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(profile.businessName)}`,
    `ORG:${esc(profile.businessName)}`,
  ];

  if (profile.tagline) {
    lines.push(`TITLE:${esc(profile.tagline)}`);
  }

  if (c.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${esc(c.phone)}`);
  }
  if (c.whatsapp && c.whatsapp !== c.phone) {
    lines.push(`TEL;TYPE=CELL:${esc(c.whatsapp)}`);
  }

  if (c.email) {
    lines.push(`EMAIL;TYPE=WORK:${esc(c.email)}`);
  }

  if (c.website) {
    lines.push(`URL:${esc(c.website)}`);
  }

  // Structured address
  const hasAddr = a.addressLine1 || a.city || a.state || a.postalCode || a.country;
  if (hasAddr) {
    lines.push(
      `ADR;TYPE=WORK:;;${esc(a.addressLine1 || '')}${a.addressLine2 ? ' ' + esc(a.addressLine2) : ''};${esc(a.city || '')};${esc(a.state || '')};${esc(a.postalCode || '')};${esc(a.country || '')}`
    );
  }

  // Geo coordinates
  if (a.latitude != null && a.longitude != null) {
    lines.push(`GEO:${a.latitude};${a.longitude}`);
  }

  // About / Note
  if (profile.about) {
    lines.push(`NOTE:${esc(profile.about)}`);
  }

  // Logo URL (not base64 to keep the VCF lightweight)
  if (profile.logoUrl) {
    lines.push(`PHOTO;VALUE=uri:${profile.logoUrl}`);
  }

  // Social profiles as X-SOCIALPROFILE
  if (Array.isArray(profile.socialLinks)) {
    for (const link of profile.socialLinks) {
      if (link.url) {
        lines.push(`X-SOCIALPROFILE;TYPE=${esc(link.platform || 'other')}:${esc(link.url)}`);
      }
    }
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Get the download filename for a profile's vCard.
 */
export function getVCardFilename(profile) {
  const name = (profile.businessName || 'contact')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  return `${name}.vcf`;
}
