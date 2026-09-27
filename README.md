# Ghar Realty

React + JavaScript frontend for browsing and managing real-estate listings.

## Run locally

Use Node.js 24 LTS and npm. Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

```sh
npm run lint
npm run build
npm run preview
```

## Phase 1 — project setup

- React/Vite starter retained and missing image imports removed.
- Tailwind CSS integrated through `@tailwindcss/vite`.
- React Router, TanStack Query, Zustand, React Hook Form, Zod, and resolvers installed.
- Supplied Red Hat Display Regular font retained and connected locally.
- Feature-based folders scaffolded; `.gitkeep` files preserve empty directories.
- `.env.example` documents future public API settings; no backend is connected yet.
- The current page is a setup screen, not the finished homepage.

Only the Regular font face was supplied. Additional real weights can be added during the typography phase; the file is not declared as a variable font.

## Phase approval checkpoints

1. Project setup — complete; lint and production build passed, development server checked. Awaiting approval for Phase 2.
2. Theme and basic UI — pending approval.
3. Routing, shared layout, header and footer — pending.
4. Mock API and common property model — pending.
5. Public browsing pages — pending.
6. Authentication and account pages — pending.
7. Continuous add/edit property form — pending.
8. Real backend integration and release — pending backend availability.

Stop after each phase and ask for approval before starting the next.

## Architecture

- `app/`: composition, providers, and routing.
- `components/ui/`: reusable business-independent controls.
- `components/layout/`: header, footer, and layout shells.
- `features/`: domain components, API functions, hooks, and schemas.
- `pages/`: route-level composition.
- `services/`: shared HTTP and upload infrastructure.
- `mocks/`: replaceable fixtures and mock API implementations.
- `store/`: shared UI preferences only; start with theme in Phase 2.
- `styles/`: future shared theme styles. Tailwind currently enters through `src/index.css`.

State ownership: TanStack Query for API/session data, URL parameters for search,
React Hook Form for forms, Zustand for shared UI preferences, and local React
state for temporary controls. Do not create duplicated auth or filter stores.

## Design direction

Red Hat Display; editorial monochrome; light mode initially. Later phases add
light/dark persistence, signed-out Login, signed-in listing actions, and a single
continuous property form. Sample photography will be replaceable.
