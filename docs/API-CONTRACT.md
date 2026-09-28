# API integration contract

The frontend is operational in mock mode. This document describes the HTTP
adapter contract; it is not a claim that a backend has been deployed or agreed
with a backend engineer.

## Transport and session

`VITE_API_MODE=http` selects HTTP. `VITE_API_BASE_URL` defaults to `/api`.
Requests use native fetch with `credentials: include`. Use HttpOnly, Secure,
SameSite session cookies. For cross-origin deployments, configure exact CORS
origins, credentials and CSRF protection on the server. Do not place session
secrets in Vite variables or Zustand.

JSON responses are returned directly (no `data` wrapper). Successful deletes may
return 204. Errors use `{ "message": "...", "fields": { "title": "..." } }`.
Use 401 for expired sessions, 403 for unauthorized ownership actions, 404 for
unavailable records, 409 for conflicts and 422 for validation failures. Field keys
may use dotted form paths such as `location.city`.

`GET /auth/me` returns a user or `null` for a guest. Other protected calls returning
401 clear private cached state and redirect to login. User shape:
`{ id, name, email, phone, avatar }`.

## Endpoints expected by the adapters

| Method | Path | Result / input |
| --- | --- | --- |
| GET | `/properties` | Filters below; `{ items, total, pages, page }` |
| GET | `/properties/featured` | Property array |
| GET | `/properties/recent` | Property array |
| GET | `/properties/:id` | Property; drafts visible only to owner |
| GET | `/categories` | Counts keyed by category slug |
| GET | `/me/properties` | Current user's property array |
| POST | `/properties` | Listing payload → saved property |
| PATCH | `/properties/:id` | Listing payload → saved property |
| DELETE | `/properties/:id` | No body required |
| GET | `/me/favorites` | Current user's property array |
| POST | `/me/favorites/:id` | Save property |
| DELETE | `/me/favorites/:id` | Remove saved property |
| GET | `/auth/me` | Safe user profile or null |
| POST | `/auth/login` | `{ email, password }` → user + session cookie |
| POST | `/auth/signup` | `{ name, email, phone, password, ... }` → user + cookie |
| POST | `/auth/logout` | Clear session cookie |
| POST | `/auth/forgot-password` | `{ email }` → generic confirmation |
| POST | `/auth/reset-password` | `{ token, password, confirmPassword }` |
| POST | `/auth/change-password` | `{ currentPassword, password, confirmPassword }` |
| PATCH | `/me` | `{ name, email, phone, avatar }` → safe user |
| POST | `/uploads` | Multipart `file`, `purpose` → `{ url }` |

Server route matching must handle `/featured` and `/recent` before `/:id`.
The demo forgot-password response includes a reset token so it can be tried
without email. The production endpoint must never return that token in its
response; deliver it through the email flow instead.

## Search

Supported query keys: `listingType` (`buy` or `rent`), `location`, `category`,
`propertyType`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `minArea`,
`areaUnit`, `sort` (`latest`, `price-asc`, `price-desc`) and `page` (one-based).
The current frontend expects six results per page. Bedroom/bathroom filters mean
"at least". Price-on-call listings are excluded when a budget filter is active.
Area comparisons must use the specified unit. Only published properties are
publicly searchable. Validate and normalize query inputs server-side.

## Listing payload

The canonical JavaScript schema lives in
`src/features/property-management/schemas/propertySchema.js`.
Core fields include title, listingType, category, propertyType, price/pricing
basis, price-on-call, location, measurements, building/room/parking counts,
features, landmarks, media URLs, description, contact, policy and duration.

- `status` is `draft` or `published`.
- `location` contains province, district, city, area and optional mapUrl.
- `images` is an ordered URL array. First image is the cover.
- `areaSystem` is hilly, terai or metric; original components remain in
  `measurements`. Summary area is normalized to aana or kattha for local units.
- 1 ropani = 16 aana; 1 aana = 4 paisa = 16 daam.
- 1 bigha = 20 kattha; 1 kattha = 20 dhur.
- Floor count permits halves. Room and parking counts are nonnegative integers.
- Sale listing type is `buy` for compatibility with browsing filters.
- Money is NPR. Price period is month/year for rent; sale basis is total/per unit.
- `seller`, IDs, featured status and timestamps are server-controlled.
- Drafts may omit publication-required fields; invalid supplied values still fail.
- Do not allow clients to change ownership or feature their own listings.
- Server validation must mirror publishing requirements, enforce policy and
  media ownership, and enforce authorized update/delete operations.

## Upload and description handling

Validate real image content, size (20 MB max), minimum dimensions (600 × 400 for
property images), and ownership server-side. Allow at most 12 listing images.
Return durable HTTPS URLs and clean up abandoned uploads. Avatars use a smaller
client-side demo image and have no 600 × 400 minimum. Never trust client MIME
checks. The mock resizes images into browser storage; real mode sends the source
file as multipart instead.

Descriptions are plain text with basic Markdown. The UI never uses raw HTML.
Sanitize appropriately if a richer renderer is introduced later.

## Before switching to HTTP

1. Implement endpoints or adapt only the feature API modules to your contract.
2. Verify cookies, CORS, CSRF and expired-session behavior.
3. Test ownership restrictions with two real accounts, not only hidden UI controls.
4. Test drafts, publish validation, upload failures and persistent media storage.
5. Confirm email/reset expiry and single-use tokens.
6. Decide listing moderation/expiry rules and supply legal content.
7. Run lint, unit/component tests, HTTP integration tests and browser journeys.
8. Build `dist/`, configure API routing and SPA deep-link fallback, then deploy
   to the agreed host. No automatic deployment is configured here.
