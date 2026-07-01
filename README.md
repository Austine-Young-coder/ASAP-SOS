# ASAP-SOS

Get help fast. A Progressive Web App (installable like a native app, no app store needed) for emergency response in Nigeria — one-tap calling to the nearest responder, customizable panic alerts, and community broadcast alerts for banditry, kidnapping, terrorism, and natural/man-made disasters.

Live: **https://asap-sos.vercel.app**

---

## What's built and working right now

- Splash screen with the animated red-circle reveal, onboarding carousel (first launch only), Google/Apple sign-in (no password), a permissions walkthrough, and the main app (Home, Call, Broadcasts, Settings).
- A built-in dataset of verified national and all-36-state-plus-FCT emergency numbers, with nearest-state resolution from GPS so the right number surfaces automatically (`src/data/emergencyNumbers.js`).
- One-tap `tel:` calling (browsers can't silently dial — this opens the dialer pre-filled, which is the most a web app can do).
- A configurable panic button: hold-to-arm SOS that can call a saved number, open a broadcast composer, record a 30-second video straight to the device, or ask each time.
- Broadcast alerts (text or video) to nearby or wider users, a live feed of nearby alerts, and false-alarm reporting with automatic 2-week suspension after 3 reports.
- Installable as a PWA (the "Install" / "Add to Home Screen" prompt appears automatically on supported browsers) and works offline for cached pages, saved numbers, and queues broadcasts/reports made while offline to sync later.
- "Get help" button that opens WhatsApp directly: `https://wa.me/2348109352330`.

## What needs your setup before it's fully live

A static site (this PWA) cannot run a backend, store accounts, send real push notifications, place real phone calls, or read SMS — those need either a backend service or native mobile code. Here's exactly what to do for each:

### 1. Supabase (accounts, broadcasts, reports — free tier is enough to start)

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once created, go to **SQL Editor** → paste in the contents of `supabase/schema.sql` from this repo → Run. This creates the `profiles`, `broadcasts`, `reports` tables, row-level security policies, the suspension trigger, and the nearby-broadcast lookup function.
3. Go to **Storage** → New bucket → name it `broadcast-videos`, mark it public (so video broadcast links work).
4. Go to **Project Settings → API** → copy your **Project URL** and **anon public key**.
5. In Vercel (see step 4 below), add them as environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### 2. Google sign-in

1. In Supabase: **Authentication → Providers → Google** → toggle it on.
2. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a project (or use an existing one) → **APIs & Services → Credentials → Create Credentials → OAuth Client ID** → type **Web application**.
3. Add this Authorized redirect URI (Supabase shows you the exact one to copy on the same provider screen): `https://<your-project-ref>.supabase.co/auth/v1/callback`.
4. Copy the generated **Client ID** and **Client Secret** into the Supabase Google provider screen → Save.

### 3. Apple sign-in

Apple Sign-In requires a **paid Apple Developer account** ($99/year) — there's no free path around this, since Apple's identity service requires a registered Services ID and a signed JWT secret.

1. In your [Apple Developer account](https://developer.apple.com/account): **Certificates, Identifiers & Profiles → Identifiers** → register an App ID and a separate Services ID for web sign-in.
2. Enable "Sign in with Apple" on that Services ID, and add the Supabase redirect URL (same pattern as Google's, shown on Supabase's Apple provider screen).
3. Generate a private key for Sign in with Apple, then follow Supabase's [Apple provider guide](https://supabase.com/docs/guides/auth/social-login/auth-apple) to generate the client secret JWT (Supabase's docs include a generator script).
4. Paste the Services ID and generated secret into Supabase → **Authentication → Providers → Apple**.

Until this is configured, the Apple button will show a clear inline error rather than silently failing, with a "Continue without an account" fallback so the app is still usable end-to-end for testing.

### 4. Push notifications (for live broadcast alerts when the app isn't open)

This needs a service worker push subscription + a push service (e.g. web-push library on a small serverless function, or a Supabase Edge Function). Not yet wired up — broadcasts work in real time while the app is open; background push is the natural next addition once you're ready, and I'm happy to build it next.

### 5. Deploy

```bash
# from this folder
git init
git add .
git commit -m "ASAP-SOS: initial build"
git branch -M main
git remote add origin https://github.com/<your-username>/ASAP-SOS.git
git push -u origin main
```

Then in [Vercel](https://vercel.com):
1. **Add New → Project** → import the `ASAP-SOS` repo.
2. Framework preset: Vite (auto-detected).
3. **Environment Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from step 1.
4. Deploy. Then in **Project Settings → Domains**, your project gets `asap-sos.vercel.app` automatically if that name is free under your account — if taken, Vercel will suggest the closest available alternative.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

## Notes on native-only features

A few things in the original brief need real native Android/iOS code and can't run inside a website, even an installed PWA:

- **Hardware volume-button or screen-off triggers** — browsers can't listen for hardware button presses while the screen is locked. The current build uses a large on-screen hold-to-arm SOS button instead, which works identically whether installed or opened in a browser tab.
- **"Display over other apps"** — an Android-specific permission that only native apps can request.
- **Silently placing a call or reading/sending SMS without user interaction** — browsers require a user tap before opening the dialer or messaging app (`tel:` / `sms:` links), as a deliberate anti-abuse protection that no website can bypass.

If/when you want these, the natural next step is wrapping this same React codebase in **React Native** (or Capacitor, which reuses most of this code directly) for an installable native APK with full hardware access — happy to help with that conversion when you're ready.

## Emergency number sourcing

Numbers in `src/data/emergencyNumbers.js` were compiled from NEMA, FRSC, and state police command public listings as of June 2026. These do change — treat this as a strong starting point, and consider adding a simple admin update flow (a Supabase table editable by you) rather than redeploying code every time a number changes.
