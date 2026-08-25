# Larder 🍎

A private calorie, weight and waist tracker with a built-in UK food database.

The app is a single self-contained `public/index.html` (no framework, no build step). It works **local-first** — everything is stored in your browser (`localStorage`) and the app is fully usable offline. An optional **cross-device sync** is served by a tiny Cloudflare Worker backed by Workers KV; it's off until you create a sync code.

## Features

- **UK food database** (~155 common foods, calories per 100 g/ml + typical servings) plus your own custom foods
- **Daily log** by meal (breakfast/lunch/dinner/snacks) with a calorie ring vs. your goal
- **Weight & waist** logging in kg/lb/st and cm/in
- **Progress** charts: daily calories vs. goal, weight & waist trends, routine summaries, and an **intake-vs-body** comparison
- **Goal calculator** (BMR/TDEE, Mifflin–St Jeor) that suggests a daily calorie target
- **Reuse meals**: copy a previous day, or save meals for one-tap logging
- **Export**: CSV for spreadsheet analysis (daily summary + food log), or a full JSON backup to restore
- **Cross-device sync**: link phone + computer with a private sync code (no account, no password)
- **Mobile-first**: bottom navigation, safe-area support, installable ("Add to Home Screen")
- Light & dark themes

## Project layout

```
public/            ← the static site (served as Worker assets)
  index.html         the whole app
  favicon.svg, manifest.webmanifest, _headers
worker/index.js    ← Cloudflare Worker: serves public/ + the /api/state sync endpoint
wrangler.jsonc     ← Worker config (assets dir + KV binding)
```

## Run locally

- **UI only** (no sync API): `npx serve public`
- **Full app incl. sync API**: `npx wrangler dev` — runs the Worker + a local KV, serving at `http://localhost:8787`.

## Deploy (Cloudflare Workers)

The site deploys as a single Worker (static assets + sync API). One command:

```bash
npx wrangler deploy
```

That reads `wrangler.jsonc`, uploads `public/`, and binds the KV namespace. Re-run it any time to publish updates. (Auto-deploy on `git push` is also possible via **Workers Builds** — connect the repo in the Cloudflare dashboard; it uses the same `wrangler.jsonc`.)

**First-time setup** (already done for this project) needs a KV namespace:

```bash
npx wrangler kv namespace create SYNC_KV   # copy the printed id into wrangler.jsonc → kv_namespaces
```

## Cross-device sync

No accounts. On one device: tap the **cloud icon** (top-right) → **Create a sync code**. On your other devices: cloud icon → **I already have a code** → paste it. Your food, weights, measurements and settings then stay in step (the app pushes on change and pulls when you return to it).

How it works: the code is a long random string. Data is stored in Workers KV under a key derived from `SHA-256(code)` — the raw code is never stored — so only someone with the code can read or write that record. **Keep the code private.** It's simple by design; for a personal tracker it's a good fit. Trade-off vs. a login: anyone with the code has access, and there's no password reset.

## Push this repo to GitHub

```bash
# create an EMPTY repo on github.com first (no README), then:
git remote add origin https://github.com/<you>/larder.git
git branch -M main
git push -u origin main
```

## Notes

- Data lives per-browser until you link devices with a sync code. **Settings → Export** also gives you CSV (for analysis) and JSON (for backup/restore).
- `public/_headers` sets caching + a Content-Security-Policy; the sync API is same-origin (`/api/*`).
