# Graph Report - Webiox-QR-Code  (2026-04-30)

## Corpus Check
- 64 files · ~273,157 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 163 nodes · 109 edges · 5 communities detected
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 8|Community 8]]

## God Nodes (most connected - your core abstractions)
1. `formatQrData()` - 5 edges
2. `findQrCodesByUser()` - 3 edges
3. `POST()` - 2 edges
4. `POST()` - 2 edges
5. `GET()` - 2 edges
6. `GET()` - 2 edges
7. `GeneratorInner()` - 2 edges
8. `useQrGenerator()` - 2 edges
9. `escVCard()` - 2 edges
10. `escMeCard()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `ensureIndexes()`  [INFERRED]
  app\api\admin\ensure-indexes\route.js → lib\models\index.js
- `POST()` --calls--> `createQrCode()`  [INFERRED]
  app\api\qrcodes\route.js → lib\models\qrCodes.js
- `GET()` --calls--> `findQrCodesByUser()`  [INFERRED]
  app\api\qrcodes\route.js → lib\models\qrCodes.js
- `GET()` --calls--> `findQrCodesByUser()`  [INFERRED]
  app\api\qrcodes\mine\route.js → lib\models\qrCodes.js
- `GeneratorInner()` --calls--> `useQrGenerator()`  [INFERRED]
  app\generator\page.js → hooks\useQrGenerator.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (5): GET(), createQrCode(), findQrCodesByUser(), GET(), POST()

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (2): hashIp(), recordEvent()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (2): GeneratorInner(), useQrGenerator()

### Community 4 - "Community 4"
Cohesion: 0.6
Nodes (5): escMeCard(), escVCard(), escWifi(), fmtICalUTC(), formatQrData()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (2): POST(), ensureIndexes()

## Knowledge Gaps
- **Thin community `Community 2`** (7 nodes): `scanEvents.js`, `aggregateEventsByDay()`, `createIndexes()`, `getEventsByProfile()`, `getEventsByQr()`, `hashIp()`, `recordEvent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (6 nodes): `page.js`, `Fallback()`, `GeneratorInner()`, `GeneratorPage()`, `useQrGenerator.js`, `useQrGenerator()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (4 nodes): `route.js`, `POST()`, `index.js`, `ensureIndexes()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `findQrCodesByUser()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`findQrCodesByUser()` has 2 INFERRED edges - model-reasoned connections that need verification._