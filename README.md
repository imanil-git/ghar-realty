# Ghar Realty

A React + JavaScript real-estate frontend with light/dark themes, browsing, saved
homes, accounts, and a continuous create/edit listing form. The default backend
is a local demo adapter; no real properties or emails are published.

## Start

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the address printed by Vite. No environment file is required for demo mode.
Copy `.env.example` to `.env.local` when changing public configuration.

Demo login:

- Email: `aarav@example.com`
- Password: `GharDemo123!`

Use fictional details in this demonstration. Your browser stores sample listings,
profiles, favorites, and salted password verifiers, never plaintext passwords.
This is not production authentication: someone with browser access can modify the
local database. Sessions are tab-scoped and expire after eight hours. Clear the
`ghar-demo-v2` and `ghar-session` storage entries to reset the demo.

## What is implemented

- Editorial monochrome styling with the supplied Red Hat Display font.
- Persistent theme, custom accessible controls, mobile navigation, shared layout.
- Home, category and search pages; URL filters, sorting and pagination.
- Detail gallery, phone action, share link, location link and related properties.
- Signup, login/logout, password reset/change and profile/avatar editing.
- Favorites and responsive listing management with search, sort, edit and delete.
- One continuous listing form shared by create and edit: overview, address,
  photos/video, local area units, roads, parking, rooms, amenities, landmarks,
  pricing, description, contact, policy, review, drafts and publication.
- Image selection/drop, processing feedback, retry, cover selection, reorder and
  remove. Demo images are resized before browser storage. Animated uploads use
  their first frame. Storage-quota errors preserve the form.
- Drafts allow missing publishing details; publication validates required fields.
- Session/ownership checks in the demo adapter; unsaved-change prompts.
- Loading/error/empty states, route errors and not-found page.

Your Lucide theme-toggle customization is preserved. Only a Regular font file
was supplied, so bold headings currently use browser-synthesized weight. Add real
font weight files later if desired.

## Replace sample photos

Replace files in `public/images/` or update the image paths in
`src/mocks/data/properties.js`. Images are illustrative architectural photographs,
not verified images of the Nepal sample listings. The seed is copied to browser
storage on first use; reset the demo database after changing seed records.

## State and folder conventions

- `app/`: router, provider and QueryClient.
- `components/ui/`: reusable controls without property logic.
- `components/layout/`: site/account shells, header, navigation and footer.
- `features/`: domain APIs, hooks, schemas and components.
- `pages/`: page composition; API requests stay in feature modules.
- `services/`: HTTP configuration/client and uploads.
- `mocks/`: fixtures and browser-backed API implementations.
- `store/uiStore.js`: theme only; no duplicated auth/filter stores.
- `styles/theme.css`: semantic color roles for both themes.

TanStack Query owns server/session state; the URL owns applied search filters;
React Hook Form owns forms; component state owns temporary controls. Feature API
functions select the mock or HTTP adapter without changing page code.

`/design/components` keeps the reusable component preview available.
Descriptions support basic Markdown; raw HTML is never injected.

## Checks

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Vitest covers schemas, search, mock session/ownership rules and controls.
Playwright covers browsing, responsive widths, theme persistence, protected
routes, favorites and the draft/edit/publish/delete journey. `npm run format`
formats source and tests. Playwright reports and build output are ignored by Git.

## Backend handoff and hosting

See `docs/API-CONTRACT.md` for the HTTP contract and integration checklist.
Set `VITE_API_MODE=http` and `VITE_API_BASE_URL` only after those endpoints exist.
Frontend variables are public; never put secrets in them.

A production bundle is created in `dist/`. Netlify SPA redirects and a Vercel
rewrite configuration are included for direct route refreshes. If your backend
shares `/api`, configure that proxy before enabling the SPA fallback on the host.
No deployment was performed; no hosting destination or backend was supplied.

## Remaining external work

The frontend and mock flows are implemented. Real API integration cannot be
verified until a backend is available. Production launch also needs real session
security, ownership enforcement, upload storage, email delivery, approved terms
and privacy policy, moderation, and listing-expiration behavior. The 180-day
listing duration is currently metadata, not a background expiry job.

Social login, in-app messaging, offers, site visits and interactive map/split
views remain outside this version, as agreed in the plan.

The previous phase approval checkpoints were removed at your request; work now
continues through all remaining phases without asking between them.
