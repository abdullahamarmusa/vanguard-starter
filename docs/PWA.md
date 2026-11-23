# Responsive web and PWA foundation

VANGUARD is one Next.js App Router application for desktop, tablet, mobile web,
and supported installed PWA experiences. The application, backend, database,
and business rules stay shared. The responsive shell adapts navigation and
content presentation to the viewport.

## Responsive design system

The shared tokens live in `src/app/globals.css`: light neutral surfaces, teal
accent, IBM Plex Sans, card and sheet radii, and a common layout gap. Existing
breakpoints are 1080px for narrower content columns, 820px for the mobile
navigation shell, and 560px for phone-specific spacing. Use those breakpoints
before adding new ones. The sidebar becomes a touch-friendly menu on compact
screens; content columns stack and management data should use cards or
intentional horizontal scrolling rather than forcing the page wider.

Keep route composition in Server Components. Add client code only for browser
interactions such as the install and update controls. Keep shared controls in
`src/components` and business behavior in `src/features` or `src/server`.
Interactive targets should be at least 44px high on touch layouts. Keep visible
focus states and respect reduced-motion preferences.

## PWA behavior and privacy

Next.js serves the manifest from `src/app/manifest.ts`. Branded PNG icons are
under `public/icons/`. `public/sw.js` is a small, dependency-free worker,
registered only in production. It caches the static offline page and allowlisted
public icons/manifest; it does not cache navigations, account pages, or API
responses. Network navigation falls back to `public/offline.html`, which
contains no account data. New workers wait until the user chooses **Update
ready**; the worker then takes control and the page reloads once.

Do not add private API responses, authenticated HTML, or user-specific state to
the service worker cache. If authentication or account switching is later
implemented, preserve this rule and test it as part of the auth workflow.

The manifest and HTTPS are the platform install requirements documented by
[Next.js](https://nextjs.org/docs/app/guides/progressive-web-apps). Supported
browsers can install from their browser menu. Chromium may expose the
**Install app** action; on iOS Safari the app controls explain **Share → Add to
Home Screen**. Push notifications are not configured.

## Local development and testing

Start the shared desktop/mobile web app and database using the instructions in
the [development guide](DEVELOPMENT.md). `pnpm test:e2e` checks the overview,
mobile navigation, responsive widths (375px, 768px, 1280px), horizontal
overflow, manifest values, and icon dimensions against the development server.

To validate service worker registration and offline fallback against the
production worker:

```powershell
pnpm build
pnpm test:pwa
```

For manual installation checks, run `pnpm build` and `pnpm start`, then open the
site at `http://localhost:3000` in a supported browser. Localhost is treated as
a secure context by modern browsers. To install on a physical phone, use an
HTTPS preview or another trusted HTTPS host. In Chromium DevTools, inspect the
Application → Manifest and Service Workers panels; in Safari on iOS, use Share
→ Add to Home Screen. Check the app offline after its first successful load.

## Build and deployment

Deploy the same Next.js app as a Node.js service over HTTPS. Configure the
existing server-only database environment variables as described in the
[database guide](DATABASE.md); the PWA adds no secrets or public environment
variables. The service worker response is configured `no-cache` so clients can
discover releases. Build and run the existing `pnpm build` / `pnpm start`
commands, then run both the responsive and production PWA browser checks before
release.
