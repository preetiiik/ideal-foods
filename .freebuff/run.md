# Run doc — IDEAL Food Products (fusion-starter)

React + TS + Vite + Tailwind 4 site for IDEAL (since 1972). The site OPENS with the animated syrups showcase: `/` = syrup carousel hero + company content sections below (Our Story, NPC Award, Specialities, Customer Satisfaction, enquiry CTA). `/pickles` renders the SAME full Landing page with the pickle carousel hero (per-line story copy + bento tiles); `/syrups` redirects to `/`. Detail pages: `/syrup/:slug` + `/pickle/:slug`. Brand pages: `/about` (history/founder/award/next-gen), `/gallery` (all 9 products), `/contact` (form + info), `/enquiry` (bulk/distributorship form). Product data in `client/data/products.ts` (note: SYRUP_LINE.heroPath is `/`); art in `public/bottles/` (5 syrup bottles), `public/pickles/` (4 jars), and `/public/ideal-logo.png`. Vite dev server serves both the SPA and the Express API (`vite.config.ts` mounts the Express app as middleware in dev).

**Nav (2026-09):** ONE always-visible fixed `SiteNav` rendered at app level in `App.tsx` (zIndex 90, above every page/section — content never overlaps it). Over the dark cinematic heroes (`/`, `/pickles`, detail pages) it flips to white ink until scroll (60px), then becomes the cream pill bar; a white pill wraps the logo so it reads on any background. Pages do NOT embed the nav themselves.

**Theme (2026-09):** The animated carousel heroes keep their dark cinematic look (Anton ghost words, white text). Everything BELOW/BEYOND the heroes sits on ONE plain static beige backdrop — `#F3E7D3`, rendered by `client/components/SiteBackdrop.tsx` as a fixed `z-0` layer over a flat beige `/ideal-bg.svg` (no pattern, no colour washes; blend `soft-light` is a no-op safeguard). Content sections are OPEN layouts directly on the beige — no coloured rounded cards anywhere (the `BandCard` helpers in Landing/About are now plain two-column sections that ignore their legacy `bg`/`wash` props; Contact/Enquiry are open grids; Landing's application tiles + stats chips are neutral white; forms keep their own white cards). Fonts: **Fraunces** (display, `.display-font`) + **Nunito Sans** (body) loaded in `index.html` (Anton + Inter kept for the hero), ink text `#2E1F14` / `#5C4636`, accents `#C25E3A` (terra), `#2F6B4F` (green), `#C2477F` (rose), `#B97E14` (saffron), `#1D74B7` (sky) — colour lives only in small elements (accents, medallion borders, product pills). Product cards float each bottle over a flat pastel circle in its flavour `bg` with a rounded pill button underneath (`client/components/ProductGrid.tsx`); footer is deep green `#173A2E`. Stacking rule: `SiteBackdrop` is `fixed z-0`; the carousel root and the About orange hero band carry `zIndex: 1` so they paint ABOVE the backdrop.

## 1. Reproduce artifacts a fresh checkout needs

- **Dependencies:** install with the pinned package manager — pnpm 10 (`packageManager` field in `package.json`): `pnpm install`. (This checkout currently has a working `node_modules` from npm; either manager works, but re-install from scratch with pnpm.)
- **Env files:** `.env` lives in the repo root of this workspace. If running from a different worktree/checkout, COPY `.env` from the main checkout at `C:\Users\lenovo\Downloads\ideal-food-products-0a2` (never symlink — paths/ports may differ per worktree). Do not commit or paste its values here.
- **SMTP credentials:** `.env.local` (gitignored) holds `EMAIL_USER`, `EMAIL_PASSWORD` (Gmail app password), `RECEIVER_EMAIL` for the contact/enquiry email alerts. Missing vars = log-only mode (submissions validated + logged, API still returns ok). The same three vars must be set in the Vercel dashboard for production email delivery.
- No build artifacts are required for dev mode (`npm run dev` serves from source).

## 2. Run the server

- Default port: **8080** (set in `vite.config.ts` → `server.port`). Use it if free; otherwise pass `--port <free-port>` to `vite` and adapt the preview URL.
- Script: `npm run dev` (runs `vite`; host `::`, strictPort not set).

### Detached start (Windows, from repo root)

```powershell
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\lenovo\Downloads\ideal-food-products-0a2' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

- stdout and stderr MUST go to different files (PowerShell fails otherwise).
- `npm.cmd` must be named exactly — `Start-Process` does not resolve shell shims like `npm`.
- Vite takes ~7s to become ready. Confirm with `Get-Process -Id <pid>`, then wait for `HTTP 200` from `http://localhost:8080/` (e.g. `curl -s -o NUL -w "%{http_code}" http://localhost:8080/`) before registering the preview.

### Useful checks

- Typecheck: `npx tsc --noEmit` · Tests: `npx vitest --run` (5 tests).
- Backend smoke test: `curl -X POST http://localhost:8080/api/submit -H "Content-Type: application/json" -d '{"variant":"contact","name":"T","email":"t@example.com","message":"hi"}'` → `{"ok":true,"delivered":"log|email"}`. Validation failures return 400 with field issues.
- Favicon: `public/favicon.ico` must keep the ICO magic bytes `00 00 01 00` (a PNG renamed `.ico` gets rejected by some browsers — that was the missing-favicon bug). Regenerate from the logo with `node scripts/make-favicon.mjs` (needs `pngjs`, installed with `npm i --no-save pngjs`).

## 3. Deployment (Vercel — https://ideal-foods.vercel.app)

- The deployed API functions live in `api/` and are DELIBERATELY SELF-CONTAINED — `api/submit.ts` and `api/ping.ts` must not import from `../server` (relative cross-directory imports crash Vercel's bundler at cold start → `FUNCTION_INVOCATION_FAILED`, the form-500 bug). Keep validation/email logic mirrored between `api/submit.ts` and `server/submit-core.ts`.
- Set `EMAIL_USER`, `EMAIL_PASSWORD`, `RECEIVER_EMAIL` in Vercel → Project → Settings → Environment Variables (without them the deployed form succeeds but only logs).
- Health checks after deploy: `GET /api/ping` should return `{ok:true,...}`; `GET /api/submit` should return a clean 405 JSON (a raw 500 means the function crashed at boot).
- `vercel.json` rewrites `/api/*` to the functions and everything else to the SPA.
- Known-benign console noise: React Router v7 future-flag warnings; Vite `configLoader: 'native'` warnings about `__dirname`/extensionless imports in `vite.config.ts` / `server/index.ts`.
- If a preview says the server pid died but port 8080 still answers 200: the npm.cmd wrapper died while its vite child kept running. Find the real owner with `powershell -NoProfile -Command '$c = Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object -First 1; (Get-Process -Id $c.OwningProcess).Id'` and re-register that pid (verify it serves this workspace via the page `<title>` first).
