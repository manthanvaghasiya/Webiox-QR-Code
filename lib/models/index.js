import { createIndexes as usersIndexes } from './users.js';
import { createIndexes as qrCodesIndexes } from './qrCodes.js';
import { createIndexes as businessProfilesIndexes } from './businessProfiles.js';
import { createIndexes as scanEventsIndexes } from './scanEvents.js';
import { createIndexes as nfcOrdersIndexes } from './nfcOrders.js';
import { createIndexes as foldersIndexes } from './folders.js';
import { createIndexes as passwordResetTokensIndexes } from './passwordResetTokens.js';
import { createIndexes as qrTemplatesIndexes } from './qrTemplates.js';
import { createIndexes as pagesIndexes } from '../db/pages.js';

export async function ensureIndexes(db) {
  await Promise.all([
    usersIndexes(db),
    qrCodesIndexes(db),
    businessProfilesIndexes(db),
    scanEventsIndexes(db),
    nfcOrdersIndexes(db),
    foldersIndexes(db),
    passwordResetTokensIndexes(db),
    qrTemplatesIndexes(db),
    pagesIndexes(db),
  ]);
}

export * from './users.js';
export * from './qrCodes.js';
export * from './businessProfiles.js';
export * from './scanEvents.js';
export * from './nfcOrders.js';
export * from './folders.js';
export * from './passwordResetTokens.js';
export * from './qrTemplates.js';
