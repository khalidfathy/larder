# Larder 🍎

A private calorie, weight and waist tracker with a built-in UK food database.
It's a single self-contained `index.html` — no build step, no backend, no accounts.
All your data is stored **locally in your browser** (`localStorage`); nothing is sent anywhere.

## Features

- **UK food database** (~155 common foods, calories per 100 g/ml + typical servings) plus your own custom foods
- **Daily log** by meal (breakfast/lunch/dinner/snacks) with a calorie ring vs. your goal
- **Weight & waist** logging in kg/lb/st and cm/in
- **Progress** charts: daily calories vs. goal, weight & waist trends, and routine summaries (by meal, by weekday, most-logged foods)
- **Goal calculator** (BMR/TDEE, Mifflin–St Jeor) that suggests a daily calorie target
- **Reuse meals**: copy a previous day, or save meals for one-tap logging
- **Backup**: export / import your data as JSON
- **Mobile-first**: bottom navigation, safe-area support, and "Add to Home Screen" (installable)
- Light & dark themes

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy to Cloudflare Pages

This repo is ready to deploy as-is (static files at the repo root).

### Option A — Git integration (recommended, auto-deploys on every push)

1. Push this repo to GitHub (see below).
2. In the **Cloudflare dashboard** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorise GitHub and pick this repository.
4. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
5. **Save and Deploy.** Your site goes live at `https://<project>.pages.dev`, and every `git push` redeploys it.

### Option B — Direct upload with Wrangler (no GitHub)

```bash
npx wrangler login
npx wrangler pages deploy . --project-name larder
```

### Custom domain (optional)

In the Pages project → **Custom domains** → **Set up a domain**, enter a domain you've added to Cloudflare. DNS is configured automatically and HTTPS is issued for you.

## Push this repo to GitHub

```bash
# create an EMPTY repo on github.com first (no README), then:
git remote add origin https://github.com/<you>/larder.git
git branch -M main
git push -u origin main
```

## Notes

- Data lives per-browser/per-origin. Moving to a new device or domain? Use **Settings → Export backup**, then **Import backup** on the other one.
- Files: `index.html` (the whole app), `favicon.svg`, `manifest.webmanifest`, `_headers` (Cloudflare caching + security headers).
