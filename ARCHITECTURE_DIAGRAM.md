# 🏗️ System Architecture Diagram

## Complete Business Profile System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WEBIOX BUSINESS PROFILE SYSTEM                       │
└─────────────────────────────────────────────────────────────────────────┘

USER CREATES BUSINESS PROFILE
┌──────────────────────────────────────┐
│ POST /api/business-profiles          │
│ {                                    │
│   businessName: "Coffee Shop Pro"    │
│   phone: "+1-555-0123"               │
│   email: "hello@coffeeshop.com"      │
│   website: "coffeeshop.com"          │
│   primaryColor: "#8B4513"            │
│ }                                    │
└──────────────┬───────────────────────┘
               │
     ┌─────────┼─────────┐
     ↓         ↓         ↓

THREE AUTOMATIC CREATIONS:

┌─────────────────────────────┐
│  1. QR CODE RECORD          │
├─────────────────────────────┤
│ _id: ObjectId               │
│ userId: ObjectId            │
│ type: "business-profile"    │
│ isDynamic: true             │
│ destination: "/b/coffee..." │
│ shortId: "abc123"           │
│ scanCount: 0                │
│ design:                     │
│   fgColor: "#8B4513"        │
│   bgColor: "#ffffff"        │
│ createdAt: Date             │
└──────────┬──────────────────┘
           │
           └─→ Used by ProfileCard
               to render QR image
```

```
┌─────────────────────────────┐
│  2. BIOLINK RECORD          │
├─────────────────────────────┤
│ _id: ObjectId               │
│ userId: ObjectId            │
│ slug: "coffee-shop-pro"     │
│ title: "Coffee Shop Pro"    │
│ bio: "Best espresso..."     │
│ avatarUrl: logoUrl          │
│ blocks: [                   │
│   {                         │
│     type: "phone"           │
│     label: "Call"           │
│     url: "tel:+1-555-0123"  │
│     icon: "phone"           │
│   },                        │
│   { email block },          │
│   { website block }         │
│ ]                           │
│ theme:                      │
│   primaryColor: "#8B4513"   │
│   secondaryColor: "#D2691E" │
│ blockClicks: {}             │
│ totalClicks: 0              │
│ createdAt: Date             │
└──────────┬──────────────────┘
           │
           └─→ Accessed via
               /link/coffee-shop-pro
```

```
┌─────────────────────────────────────┐
│  3. BUSINESS PROFILE RECORD         │
├─────────────────────────────────────┤
│ _id: ObjectId                       │
│ userId: ObjectId                    │
│ slug: "coffee-shop-pro"             │
│ qrCodeId: ObjectId (→ QR record)    │
│ biolinkId: ObjectId (→ Biolink)     │
│ biolinkSlug: "coffee-shop-pro"      │
│ businessName: "Coffee Shop Pro"     │
│ phone: "+1-555-0123"                │
│ email: "hello@coffeeshop.com"       │
│ website: "coffeeshop.com"           │
│ address: { ... }                    │
│ businessHours: { ... }              │
│ gallery: [ ... ]                    │
│ reviews: [ ... ]                    │
│ theme:                              │
│   primaryColor: "#8B4513"           │
│   secondaryColor: "#D2691E"         │
│ totalScans: 0                       │
│ totalCalls: 0                       │
│ totalDirectionClicks: 0             │
│ createdAt: Date                     │
└─────────────────────────────────────┘
```

STORED RELATIONSHIPS:
```
Business Profile
├── qrCodeId ────→ QR Code Record
│                  (for QR rendering)
│
├── biolinkId ────→ Biolink Record
│                  (for biolink access)
│
└── biolinkSlug ──→ "coffee-shop-pro"
                    (for /link/slug URL)
```

---

## DASHBOARD DISPLAY

```
┌───────────────────────────────────────────────────────────────────┐
│ DASHBOARD → MY PROFILES                                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ████████████ [PRIMARY COLOR BAR]                            │ │
│ │                                                             │ │
│ │ [☕] Coffee Shop Pro                    ← Logo/Initial      │ │
│ │      Best espresso in town             ← Tagline          │ │
│ │      webiox.in/b/coffee-shop-pro       ← URL              │ │
│ │                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────┐ │
│ │ │ ANALYTICS GRID:                                         │ │
│ │ │                                                         │ │
│ │ │  [QR Code]      [Links]         [Stats]              │ │
│ │ │  ██████████    [🏢 Profile]    📊 42 Scans          │ │
│ │ │  ██████████    [🔗 Biolink]    📞 3 Calls           │ │
│ │ │  ██████████                                          │ │
│ │ │                                                         │ │
│ │ └─────────────────────────────────────────────────────────┘ │
│ │                                                             │ │
│ │ EXTENDED STATS:                                            │ │
│ │ [📊 Scans: 42] [📞 Calls: 3]  [📍 Directions: 1]        │ │
│ │                                                             │ │
│ │ ACTIONS:                                                   │ │
│ │ [👁️ View Profile] [✏️ Edit] [🗑️ Delete]                  │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## USER ACCESS PATHS

```
VISITOR JOURNEY

Path 1: QR Code Scan 📲
┌──────────────────┐
│ Scan QR Code     │
│ with phone       │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ GET webiox.in/r/abc123               │
│ (Short link redirect)                │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ GET webiox.in/b/coffee-shop-pro          │
│ BUSINESS PROFILE PAGE                    │
│                                          │
│ Shows:                                   │
│ ├─ Logo                                  │
│ ├─ Full business details                 │
│ ├─ Contact information                   │
│ ├─ Services/products                     │
│ ├─ Hours of operation                    │
│ ├─ Gallery                               │
│ ├─ Reviews                               │
│ ├─ Action buttons                        │
│ │  ├─ Call: tel:+1-555-0123             │
│ │  ├─ Email: mailto:hello@...           │
│ │  ├─ Website: https://coffeeshop...    │
│ │  └─ Directions: Google Maps link      │
│ └─ Analytics:                            │
│    ├─ ✓ Scans recorded                   │
│    ├─ ✓ Calls tracked                    │
│    ├─ ✓ Emails tracked                   │
│    └─ ✓ Visits tracked                   │
└──────────────────────────────────────────┘


Path 2: Biolink Direct Access 🔗
┌──────────────────────────────┐
│ Visit webiox.in/link/...     │
│ (Share this for quick access)│
└────────┬─────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ DIGITAL PROFILE / BIOLINK PAGE       │
│                                      │
│ Shows:                               │
│ ├─ Avatar (from logo)                │
│ ├─ Business name                     │
│ ├─ Business tagline                  │
│ ├─ Quick action buttons (3):         │
│ │  ├─ 📞 Call +1-555-0123            │
│ │  ├─ ✉️ Email hello@coffeeshop...   │
│ │  └─ 🌐 Visit website               │
│ ├─ Business theme colors applied     │
│ ├─ Mobile optimized                  │
│ └─ Analytics:                        │
│    ├─ ✓ Block clicks tracked         │
│    ├─ ✓ Individual link analytics    │
│    └─ ✓ Total visits tracked         │
└──────────────────────────────────────┘


Path 3: Direct Profile Link 🏢
┌────────────────────────────────┐
│ Visit webiox.in/b/coffee...    │
│ (Full business info)           │
└────────┬───────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ BUSINESS PROFILE PAGE                    │
│ (Same as Path 1 after QR redirect)      │
└──────────────────────────────────────────┘
```

---

## ANALYTICS TRACKING

```
INTERACTION TRACKING FLOW

┌──────────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                         │
└──────────────────────────────────────────────────────────────┘

1. QR Code Scans
   ├─ Scanner opens QR → webiox.in/r/abc123
   ├─ Redirects to → webiox.in/b/coffee-shop-pro
   ├─ Backend: incrementScanCount(qrCodeId)
   └─ Dashboard: Shows scanCount on QR record

2. Profile Page Actions
   ├─ Phone button click → tel: protocol
   │  └─ Track: totalCalls ++
   │
   ├─ Email button click → mailto: protocol
   │  └─ Track: totalEmails ++
   │
   ├─ Website button click → https link
   │  └─ Track: totalWebsiteClicks ++
   │
   └─ Directions button → Google Maps
      └─ Track: totalDirectionClicks ++

3. Biolink Block Clicks
   ├─ Phone button → tel: protocol
   │  └─ Track: blockClicks[phoneBlockId] ++
   │
   ├─ Email button → mailto: protocol
   │  └─ Track: blockClicks[emailBlockId] ++
   │
   ├─ Website button → https link
   │  └─ Track: blockClicks[websiteBlockId] ++
   │
   └─ Total biolink visits tracked

ANALYTICS DISPLAY:
├─ Dashboard card shows:
│  ├─ QR Scans
│  ├─ Total Calls
│  └─ Total Directions
│
├─ Business profile shows per-action analytics
│
└─ Biolink shows per-block breakdown
```

---

## QR CODE TYPE FILTERING SYSTEM

```
QR CODE TYPES: 25+ Types with Metadata

┌──────────────────────────────────────────────┐
│ QR TYPES ORGANIZED BY CATEGORY               │
├──────────────────────────────────────────────┤
│                                              │
│ Contact (📇):                                │
│ ├─ vCard 📇  → .vcf download                │
│ ├─ meCard 📋 → Compact format               │
│ ├─ Email ✉️  → mailto:                      │
│ ├─ Phone ☎️  → tel:                         │
│ ├─ SMS 💬   → sms:                          │
│ └─ WhatsApp 💚 → wa.me/                     │
│                                              │
│ Web (🌐):                                    │
│ ├─ URL 🌐    → https://                     │
│ ├─ WiFi 📡   → WiFi credentials             │
│ └─ Text 📝   → Plain text                   │
│                                              │
│ Business (🏢):                               │
│ ├─ Business Profile 🏢 → /b/{slug}          │
│ └─ Bio-Link 🔗 → /link/{slug}               │
│                                              │
│ ... and 11 more categories ...              │
│                                              │
└──────────────────────────────────────────────┘

TYPE FILTER DROPDOWN (NEW)
┌────────────────────────────────────────┐
│ ⬇ Type: All Types                      │
├────────────────────────────────────────┤
│ [All Types]                            │
│                                        │
│ ── CONTACT ──                          │
│ 📇 vCard Contact                       │
│    Downloadable contact card (.vcf)    │
│ 📋 meCard                              │
│    Compact contact format              │
│ ... more contact types ...             │
│                                        │
│ ── WEB ──                              │
│ 🌐 URL / Website                       │
│    Link to any website or page         │
│ 📡 WiFi Network                        │
│    Connect to WiFi network             │
│ ... more web types ...                 │
│                                        │
│ ── BUSINESS ──                         │
│ 🏢 Business Profile                    │
│ 🔗 Bio-Link                            │
│                                        │
│ ... scroll to see more ...             │
│                                        │
└────────────────────────────────────────┘

FILTERED RESULTS:
┌──────────────────────────────────────┐
│ QR Codes: Business Profile Type Only │
├──────────────────────────────────────┤
│                                      │
│ ┌────────────────────────────────┐  │
│ │ 🏢 Coffee Shop Pro             │  │
│ │    Business Profile Type       │  │
│ │    Scans: 42                   │  │
│ └────────────────────────────────┘  │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ 🏢 My Restaurant               │  │
│ │    Business Profile Type       │  │
│ │    Scans: 18                   │  │
│ └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## RESPONSIVE DESIGN

```
MOBILE (< 640px)
┌────────────────────┐
│ ████████████ [Bar]│
│                   │
│ [☕] Coffee Shop  │
│      Best espresso│
│                   │
│ ┌───────────────┐ │
│ │[QR] [L] [S]  │ │
│ │████ 🏢 42    │ │
│ │████ 🔗 3     │ │
│ └───────────────┘ │
│                   │
│ [View][Edit][🗑] │
└────────────────────┘

TABLET (640px - 1024px)
┌────────────────────────────────┐
│ ████████████ [Bar]             │
│                                │
│ [☕] Coffee Shop Pro           │
│     Best espresso              │
│     webiox.in/b/...            │
│                                │
│ ┌────────────────────────────┐ │
│ │ [QR Code]  [Profile]  S 42 │ │
│ │ ████████  [Biolink]   C 3  │ │
│ │ ████████                    │ │
│ └────────────────────────────┘ │
│                                │
│ [View] [Edit] [Delete]        │
└────────────────────────────────┘

DESKTOP (> 1024px)
┌──────────────────────────────────────────┐
│ ████████████ [Bar]                       │
│                                          │
│ [☕] Coffee Shop Pro                     │
│      Best espresso                       │
│      webiox.in/b/coffee-shop-pro         │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [QR]  [Buttons]        [Analytics]  │ │
│ │ ████  Profile Biolink  Scans: 42    │ │
│ │ ████                   Calls: 3     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ 📊 42  📞 3  📍 1                         │
│                                          │
│ [👁️ View] [✏️ Edit] [🗑️ Delete]         │
└──────────────────────────────────────────┘
```

---

## COMPLETE SYSTEM FLOW

```
                  ┌─────────────────────┐
                  │  USER ACTION        │
                  │  Create Business    │
                  └──────────┬──────────┘
                             │
                  ┌──────────▼──────────┐
                  │ POST /api/business- │
                  │ profiles            │
                  └──────────┬──────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
    ┌──────────┐    ┌──────────────┐    ┌───────────┐
    │ Create   │    │ Create QR    │    │ Create    │
    │ Biolink  │    │ Code Record  │    │ Business  │
    │          │    │              │    │ Profile   │
    │ /link/s  │    │ /r/shortId   │    │ /b/slug   │
    └────┬─────┘    └────┬─────────┘    └─────┬─────┘
         │               │                    │
         └───────────┬───┴──────────┬─────────┘
                     │              │
            ┌────────▼──────┐ ┌─────▼──────────┐
            │ Store IDs on  │ │ Return in API  │
            │ Business Prof │ │ Response       │
            └───────────────┘ └────────────────┘
                     │
          ┌──────────▼──────────┐
          │ User Views Dashboard│
          │ /dashboard/profiles │
          └────────┬────────────┘
                   │
       ┌───────────▼───────────┐
       │ ProfileCard Component │
       │                       │
       ├─ Render QR code      │
       ├─ Show Profile link   │
       ├─ Show Biolink link   │
       └─ Display analytics   │
```

---

**System Status: ✅ Complete and Integrated**

All three resources (QR, Business Profile, Biolink) auto-created, linked, and displayed together on one dashboard card with unified analytics.
