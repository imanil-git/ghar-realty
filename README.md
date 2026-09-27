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
- The current page is a component preview, not the finished homepage.

Only the Regular font face was supplied. It is preserved as a static font. Headings currently use browser-synthesized bold; actual Medium/SemiBold/Bold font files can replace that later.

## Phase approval checkpoints

1. Project setup — complete.
2. Theme and basic UI — complete; awaiting approval for Phase 3.
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
- `store/`: `uiStore.js` owns the shared theme preference only.
- `styles/theme.css`: semantic light/dark colors and Tailwind theme mappings. `src/index.css` loads the font and shared control styling.

State ownership: TanStack Query for API/session data, URL parameters for search,
React Hook Form for forms, Zustand for shared UI preferences, and local React
state for temporary controls. Do not create duplicated auth or filter stores.

## Design direction

Red Hat Display; editorial monochrome; light mode initially. Later phases add
light/dark persistence, signed-out Login, signed-in listing actions, and a single
continuous property form. Sample photography will be replaceable.

## Phase 2 — theme and controls

The root page temporarily renders `ComponentPreview`. It demonstrates typography,
colors, buttons, form validation, and disabled/read-only/loading states. No example
form data is sent or stored.

- `Button`: primary, secondary, or ghost; defaults to `type="button"`; loading also disables it.
- `Input`, `Select`, `Textarea`: visible labels, hint/error descriptions, generated or explicit IDs, native HTML props.
- `Checkbox`: label, error/hint, required and disabled states.
- `FormField`: label and message wrapper for future custom controls.
- `ThemeToggle`: sun in light mode and moon in dark mode, with keyboard support and a descriptive label.
- `Container`, `PageHeading`: consistent width, responsive gutters, and page title spacing.

React 19 forwards the `ref` prop through the controls to their native elements.
They work directly with React Hook Form's `register()` without a wrapper or controller.

```jsx
<Input
  label="Property title"
  required
  error={errors.title?.message}
  {...register('title')}
/>

<Button type="submit" loading={isSubmitting}>
  Save property
</Button>
```

Use semantic Tailwind classes such as `bg-background`, `bg-surface`, `text-text`,
`text-muted`, and `border-border` rather than repeating light/dark colors in every
component. Inputs use the stronger `border-control-border` for visible boundaries.

`public/theme.js` reads `ghar-theme` before React/CSS load. The Zustand store
updates the document and persists only the chosen theme. Invalid or unavailable
storage falls back to light; switching still works without persistence.

### Verification

- `npm run lint` and `npm run build` pass.
- Browser: light → dark → reload retains dark; keyboard activation returns to light.
- Empty form: four errors and focus on the title field.
- Completed form: success feedback, no save or network request.
- Mobile/tablet/desktop width checks: no horizontal document overflow.
- Loading/disabled controls are disabled; the browser console has no warnings or errors.

The header, footer, authentication and real property form belong to later phases.
