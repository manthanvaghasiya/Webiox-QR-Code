/**
 * vCard generator for Bio Links
 * Generates vCard 3.0 and meCard formats from biolink data
 */

function esc(v) {
  return String(v ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Extract structured contact info from biolink blocks
 * Looks for specific types: email, phone, whatsapp, website
 */
export function extractContactFromBlocks(blocks = []) {
  const contact = {
    email: null,
    phone: null,
    whatsapp: null,
    website: null,
  };

  for (const block of blocks) {
    if (!block.url) continue;

    if (block.type === 'email' || block.label?.toLowerCase().includes('email')) {
      if (block.url.startsWith('mailto:')) {
        contact.email = block.url.replace('mailto:', '');
      }
    } else if (block.type === 'phone' || block.label?.toLowerCase().includes('phone')) {
      if (block.url.startsWith('tel:')) {
        contact.phone = block.url.replace('tel:', '');
      }
    } else if (block.type === 'whatsapp' || block.label?.toLowerCase().includes('whatsapp')) {
      const url = block.url;
      const match = url.match(/[\d+\-()]{6,}/);
      if (match) {
        contact.whatsapp = match[0];
      }
    } else if (block.type === 'website' || block.label?.toLowerCase().includes('website')) {
      if (block.url.startsWith('http')) {
        contact.website = block.url;
      }
    }
  }

  return contact;
}

/**
 * Generate vCard 3.0 string from a biolink document
 * @param {Object} biolink - The biolink document
 * @param {string} baseUrl - Base URL for the biolink
 * @returns {string} vCard 3.0 formatted string
 */
export function generateVCardFromBiolink(biolink, baseUrl = '') {
  const contact = extractContactFromBlocks(biolink.blocks || []);

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(biolink.title || 'Contact')}`,
  ];

  // Name (first name / last name not available, use title as FN)
  lines.push(`N:${esc(biolink.title || '')};;;;`);

  if (contact.email) {
    lines.push(`EMAIL:${esc(contact.email)}`);
  }

  if (contact.phone) {
    lines.push(`TEL;TYPE=CELL:${esc(contact.phone)}`);
  }

  if (contact.whatsapp && contact.whatsapp !== contact.phone) {
    lines.push(`TEL;TYPE=CELL:${esc(contact.whatsapp)}`);
  }

  if (contact.website) {
    lines.push(`URL:${esc(contact.website)}`);
  }

  // Bio as NOTE
  if (biolink.bio) {
    lines.push(`NOTE:${esc(biolink.bio)}`);
  }

  // Avatar as photo
  if (biolink.avatarUrl) {
    lines.push(`PHOTO;VALUE=uri:${biolink.avatarUrl}`);
  }

  // URL to the biolink page
  if (baseUrl) {
    const bioLinkUrl = `${baseUrl}/link/${biolink.slug}`;
    lines.push(`URL;TYPE=internet:${esc(bioLinkUrl)}`);
  }

  // Social profiles
  const socialBlocks = biolink.blocks?.filter(b =>
    ['instagram', 'twitter', 'facebook', 'linkedin', 'github', 'youtube', 'tiktok'].includes(b.type?.toLowerCase())
  ) || [];

  for (const social of socialBlocks) {
    if (social.url) {
      lines.push(`X-SOCIALPROFILE;TYPE=${esc(social.type || 'other')}:${esc(social.url)}`);
    }
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Generate meCard format (compact vCard for QR codes)
 * Format: MECARD:N:LastName,FirstName;TEL:+1234567890;EMAIL:email@example.com;URL:https://example.com;;
 * @param {Object} biolink - The biolink document
 * @param {string} baseUrl - Base URL for the biolink
 * @returns {string} meCard formatted string
 */
export function generateMeCard(biolink, baseUrl = '') {
  const contact = extractContactFromBlocks(biolink.blocks || []);
  const parts = [];

  // Name
  parts.push(`N:${biolink.title || 'Contact'}`);

  // Phone
  if (contact.phone) {
    parts.push(`TEL:${contact.phone}`);
  }

  // Email
  if (contact.email) {
    parts.push(`EMAIL:${contact.email}`);
  }

  // Website
  if (contact.website) {
    parts.push(`URL:${contact.website}`);
  }

  // Bio as MEMO
  if (biolink.bio) {
    parts.push(`MEMO:${biolink.bio}`);
  }

  // Biolink URL
  if (baseUrl) {
    const bioLinkUrl = `${baseUrl}/link/${biolink.slug}`;
    parts.push(`URL:${bioLinkUrl}`);
  }

  return `MECARD:${parts.join(';')};`;
}

/**
 * Get the download filename for a biolink's vCard
 */
export function getVCardFilename(biolink) {
  const name = (biolink.title || 'contact')
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  return `${name}.vcf`;
}
