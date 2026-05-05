# Business + Digital Profile Integration

## Complete Workflow

### 1. Create One Business Profile
When you create a business profile at `/dashboard/profiles/new`:

```
POST /api/business-profiles
{
  "businessName": "Your Business Name",
  "tagline": "Your business tagline",
  "logoUrl": "https://...",
  "contact": {
    "phone": "+1234567890",
    "email": "contact@business.com",
    "website": "https://website.com"
  },
  "theme": {
    "primaryColor": "#4F46E5",
    "secondaryColor": "#7C3AED"
  }
  // ... other fields
}
```

### 2. Auto-Generated Resources

The system automatically creates:

#### **QR Code** 🔲
- **Type**: business-profile
- **Destination**: `https://webiox.in/b/{slug}`
- **Dynamic**: Yes (trackable)
- **Shorthand**: `https://webiox.in/r/{shortId}`
- **Analytics**: Tracks all QR code scans

#### **Digital Profile (Biolink)** 🔗
- **Type**: Bio-link landing page
- **URL**: `https://webiox.in/link/{slug}`
- **Features**:
  - Avatar from business logo
  - Business name as title
  - Business tagline as description
  - Automatic link blocks for:
    - 📞 Phone (if provided)
    - ✉️ Email (if provided)
    - 🌐 Website (if provided)
  - Theme colors applied (primary + secondary)
  - Click tracking per block

#### **Business Profile Page** 🏢
- **URL**: `https://webiox.in/b/{slug}`
- **Features**:
  - Full business information
  - Contact details
  - Services/products
  - Gallery
  - Business hours
  - Address & map
  - Social links
  - Reviews/testimonials

### 3. Dashboard Display

On `/dashboard/profiles`, each business profile card shows:

```
┌─────────────────────────────────────────┐
│ [Primary Color Bar]                     │
│                                         │
│ [Logo] Business Name                    │
│        Business Tagline                 │
│        webiox.in/b/business-slug        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [QR Code]  [Links]    [Analytics]   │ │
│ │    20x20   Profile     Scans: 42    │ │
│ │           Biolink     Calls: 3      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 📊 Scans: 42    📞 Calls: 3  📍 Dir: 1 │
│                                         │
│ [👁️ View] [✏️ Edit] [🗑️ Delete]        │
└─────────────────────────────────────────┘
```

### 4. Three Entry Points for Users

Users can access your business through:

1. **QR Code** 📲
   - Scan with phone → Redirects to `/b/{slug}`
   - Tracked for analytics
   - Dynamic (can be paused/resumed)

2. **Business Profile** 🏢
   - Visit `/b/{slug}` directly
   - Full business information
   - All contact options
   - Calls tracked

3. **Digital Profile (Biolink)** 🔗
   - Visit `/link/{slug}` directly
   - Simplified landing page
   - Quick access to key links
   - Click tracking per link

### 5. Unified Analytics

All interactions tracked:

**Business Profile (`/b/{slug}`):**
- Total scans (via QR code)
- Phone calls initiated
- Website clicks
- Direction requests
- Contact saves

**Digital Profile (`/link/{slug}`):**
- Total visits
- Individual block clicks:
  - Phone calls: `totalCalls`
  - Email clicks: `totalEmails`
  - Website clicks: `totalWebsiteClicks`

### 6. Data Relationships

```
Business Profile
├── qrCodeId → QR Code Record
│   ├── type: "business-profile"
│   ├── destination: "/b/{slug}"
│   ├── shortId: "ab12cd"
│   └── scanCount: 42
│
└── biolinkId → Biolink Record
    ├── slug: "business-slug"
    ├── blocks: [phone, email, website]
    ├── blockClicks: { blockId: count }
    └── theme: { primary, secondary }
```

## Implementation Features

✅ **Auto-Creation**: One business creates both QR code and biolink  
✅ **Visual QR Code**: Displayed on profile card with business colors  
✅ **Dual Links**: Both business profile and biolink accessible from card  
✅ **Unified Analytics**: Scans, calls, and clicks all tracked  
✅ **Responsive**: Works on mobile, tablet, desktop  
✅ **Themed**: Business colors applied to QR code  
✅ **Shareable**: Direct links to both pages  

## Files Modified

- `lib/models/businessProfiles.js` - Added `biolinkId` field
- `app/api/business-profiles/route.js` - Stores biolink ID
- `components/dashboard/ProfileCard.jsx` - Enhanced display with QR code, links, analytics

## Testing the Workflow

1. **Create a business**: `/dashboard/profiles/new`
2. **View the card**: Shows QR code + links + analytics
3. **Scan QR code**: Opens business profile at `/b/{slug}`
4. **View biolink**: Click "Biolink" button → `/link/{slug}`
5. **Check analytics**: Dashboard shows real-time stats

---

**Result**: One business profile generates a complete digital presence with QR code tracking, multiple access points, and comprehensive analytics.
