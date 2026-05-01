/**
 * One-time migration: dynamic_pages → pages collection.
 *
 * Reads all docs from the old `dynamic_pages` collection, transforms each into
 * the new `pages` schema (type: "social", existing fields → config, theme),
 * generates an editToken for each, and inserts into the `pages` collection
 * using the SAME shortId so old QR codes keep working.
 *
 * Idempotent: running twice is safe — skips if shortId already exists in pages.
 * Does NOT delete the old collection — kept as backup until Phase 1 is done.
 *
 * Usage: node scripts/migrate-social-pages.js
 *
 * Requires MONGODB_URI env var (set in .env.local or pass inline).
 */

import { MongoClient } from 'mongodb';
import { randomBytes } from 'crypto';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is required. Set it in .env.local or pass inline.');
  process.exit(1);
}

const OLD_COLLECTION = 'dynamic_pages';
const NEW_COLLECTION = 'pages';

function generateEditToken() {
  return 'tok_' + randomBytes(10).toString('hex');
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const oldCol = db.collection(OLD_COLLECTION);
    const newCol = db.collection(NEW_COLLECTION);

    const oldDocs = await oldCol.find({}).toArray();
    console.log(`Found ${oldDocs.length} docs in ${OLD_COLLECTION}`);

    let migrated = 0;
    let skipped = 0;

    for (const doc of oldDocs) {
      // Skip if already migrated (idempotent)
      const existing = await newCol.findOne(
        { shortId: doc.shortId },
        { projection: { _id: 1 } }
      );
      if (existing) {
        skipped++;
        continue;
      }

      const now = new Date();
      const newDoc = {
        shortId: doc.shortId,
        editToken: generateEditToken(),
        type: 'social',
        config: {
          pageTitle: doc.title ?? doc.pageTitle ?? '',
          pageDescription: doc.description ?? doc.pageDescription ?? '',
          links: Array.isArray(doc.links) ? doc.links : [],
        },
        theme: {
          primaryColor: '#4F46E5',
          accentColor: '#7C3AED',
          bgColor: doc.bgColor ?? '#ffffff',
          textColor: doc.fgColor ?? doc.textColor ?? '#0A0F1E',
          logoUrl: null,
        },
        meta: {
          title: doc.title ?? doc.pageTitle ?? '',
          description: doc.description ?? doc.pageDescription ?? '',
          ogImageUrl: null,
        },
        stats: {
          scans: doc.scanCount ?? doc.scans ?? 0,
          lastScanAt: doc.lastScannedAt ?? doc.lastScanAt ?? null,
        },
        createdAt: doc.createdAt ?? now,
        updatedAt: doc.updatedAt ?? now,
      };

      await newCol.insertOne(newDoc);
      migrated++;
    }

    console.log(`Migration complete: ${migrated} migrated, ${skipped} skipped (already exist).`);

    // Ensure indexes on the new collection
    await newCol.createIndex({ shortId: 1 }, { unique: true });
    await newCol.createIndex({ editToken: 1 }, { unique: true });
    await newCol.createIndex({ createdAt: -1 });
    console.log('Indexes verified on pages collection.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
