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
- **Cross-device sync (optional)**: sign in and your data follows you between phone and computer (Supabase)
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

## Cross-device sync with Supabase (optional)

By default your data lives only in the browser you're using. To use the **same data on your phone and computer**, connect a free Supabase project. It stays off until you fill in `config.js`.

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is plenty).
2. **Create the table**: dashboard → **SQL Editor** → **New query** → paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**. This makes an `app_state` table with Row-Level Security so each account only sees its own data.
3. **(Recommended for personal use)** turn off email confirmation so you can sign in immediately: **Authentication → Sign In / Providers → Email** → disable **Confirm email** → Save.
4. **Add your keys**: dashboard → **Project Settings → API**. Copy **Project URL** and the **anon / public** key into `config.js`:
   ```js
   window.LARDER_CONFIG = {
     supabaseUrl: "https://YOUR-REF.supabase.co",
     supabaseAnonKey: "eyJ...your anon public key..."
   };
   ```
   (The anon key is meant to be public — security comes from Row-Level Security, not from hiding it.)
5. **Redeploy** (`git push`, or `npx wrangler pages deploy .`).

Then open the app, tap the **cloud icon** (top-right), **Create account**, and sign in with the same email/password on every device. Edits sync automatically; the app also re-checks the cloud whenever you return to it.

> Prefer passwordless login? In `openAuth()` you can swap `signInWithPassword` for `signInWithOtp` (magic links) — but email/password needs no email delivery setup, so it's the default.

## Push this repo to GitHub

```bash
# create an EMPTY repo on github.com first (no README), then:
git remote add origin https://github.com/<you>/larder.git
git branch -M main
git push -u origin main
```

## Notes

- Without sync, data lives per-browser/per-origin. Either sign in (above) or use **Settings → Export backup** / **Import backup** to move it.
- Files: `index.html` (the whole app), `config.js` (your Supabase keys), `vendor/supabase.js` (bundled client), `supabase/schema.sql` (database setup), `favicon.svg`, `manifest.webmanifest`, `_headers` (Cloudflare caching + security headers).
