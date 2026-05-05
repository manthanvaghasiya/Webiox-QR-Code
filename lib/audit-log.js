/**
 * Audit logging for sensitive operations
 * Logs all admin actions, deletions, and significant updates
 */

import clientPromise from '@/lib/mongodb';

const COLLECTION = 'audit_logs';

export async function logAuditEvent(event) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection(COLLECTION);

    const logEntry = {
      timestamp: new Date(),
      action: event.action,
      userId: event.userId || null,
      userEmail: event.userEmail || null,
      resourceType: event.resourceType,
      resourceId: event.resourceId || null,
      changes: event.changes || {},
      ipAddress: event.ipAddress || null,
      userAgent: event.userAgent || null,
      status: event.status || 'success',
      error: event.error || null,
    };

    await col.insertOne(logEntry);
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

export async function createAuditIndexes(db) {
  const col = db.collection(COLLECTION);
  await Promise.all([
    col.createIndex({ timestamp: -1 }),
    col.createIndex({ userId: 1, timestamp: -1 }),
    col.createIndex({ action: 1, timestamp: -1 }),
    col.createIndex({ resourceId: 1, timestamp: -1 }),
  ]);
}

// Helper to extract audit info from request
export function getAuditContext(request, session) {
  const clientIp = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return {
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    ipAddress: clientIp,
    userAgent: request.headers.get('user-agent'),
  };
}

// Audit actions
export const AUDIT_ACTIONS = {
  // Admin
  ADMIN_VIEW_USERS: 'admin:view_users',
  ADMIN_UPDATE_ROLE: 'admin:update_role',
  ADMIN_SUSPEND_USER: 'admin:suspend_user',

  // QR Code
  QR_CREATE: 'qr:create',
  QR_UPDATE: 'qr:update',
  QR_DELETE: 'qr:delete',
  QR_BULK_DELETE: 'qr:bulk_delete',
  QR_DOWNLOAD: 'qr:download',

  // Business Profile
  PROFILE_CREATE: 'profile:create',
  PROFILE_UPDATE: 'profile:update',
  PROFILE_DELETE: 'profile:delete',
  PROFILE_UPLOAD: 'profile:upload',

  // Biolink
  BIOLINK_CREATE: 'biolink:create',
  BIOLINK_UPDATE: 'biolink:update',
  BIOLINK_DELETE: 'biolink:delete',

  // Authentication
  AUTH_LOGIN: 'auth:login',
  AUTH_SIGNUP: 'auth:signup',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_RESET_PASSWORD: 'auth:reset_password',
};
