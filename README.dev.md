# Dev Setup Notes

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

Required:
```
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_BOOTSTRAP_SECRET=<any long random string>
```

---

## First-time Admin Setup

After signing up with your account, promote yourself to admin:

```bash
curl -X POST http://localhost:3000/api/admin/promote \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","secret":"<value of ADMIN_BOOTSTRAP_SECRET>"}'
```

Expected response:
```json
{ "ok": true, "message": "you@example.com has been promoted to admin." }
```

Then sign out and sign back in for the new role to take effect in your session.

---

## Database Indexes

Run once after first deploy (or use the Admin → System panel):

```bash
curl -X POST http://localhost:3000/api/admin/ensure-indexes \
  -H "Authorization: Bearer <ADMIN_SECRET>"
```

Or use the **System** page in the admin panel after promoting yourself to admin.
