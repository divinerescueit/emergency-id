# EmergencyID

A simple, real-world emergency QR system. Users register their medical
info and emergency contacts, get a unique QR code, and anyone who scans
it sees a one-tap emergency response page — call/SMS/WhatsApp contacts,
nearby hospital/police links, live tracking, and an alert form.

Built with **Next.js** (Pages Router) + **Supabase** (Postgres). Deploys
free on **Vercel**.

---

## 1. Project structure

```
emergency-id-app/
├── pages/
│   ├── index.js          # Landing page
│   ├── register.js       # Registration form
│   ├── success/[id].js   # Shows the generated QR code
│   ├── e/[id].js          # PUBLIC emergency page (what gets scanned)
│   ├── api/register.js   # Saves a new profile to the database
│   └── _app.js
├── lib/
│   ├── supabaseAdmin.js  # Server-side DB client (service_role key)
│   └── privacy.js        # Privacy-mode filtering logic
├── styles/globals.css
├── supabase/schema.sql   # Run this in Supabase to create the table
└── .env.local.example
```

---

## 2. Set up Supabase (free database)

1. Go to https://supabase.com and create a free account / project.
2. Once the project is created, open **SQL Editor → New query**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
   This creates the `emergency_profiles` table with Row Level Security
   enabled and **no public policies** — meaning the table can only be
   read/written through your server code (using the service role key
   below), never directly from a browser. This is what keeps the
   "Privacy Mode" feature actually private.
4. Go to **Project Settings → API**. You'll need two values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ The service_role key is secret — never put it in client-side code
   or commit it to git. In this project it's only used inside
   `pages/api/*` and `getServerSideProps`, which always run on the server.

---

## 3. Run locally

```bash
cd emergency-id-app
npm install

cp .env.local.example .env.local
# then edit .env.local and fill in your Supabase URL + service role key
```

```bash
npm run dev
```

Open http://localhost:3000 — register a test profile, then open the
"View My Emergency Page" link to see the scanned view.

---

## 4. Deploy to Vercel (free)

1. Push this project to a GitHub repository.
2. Go to https://vercel.com → **Add New Project** → import your repo.
3. In the project's **Environment Variables** settings, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → set this to your Vercel URL once you know
     it, e.g. `https://emergency-id.vercel.app` (or your custom domain).
     This is used to build the link embedded in the QR code.
4. Click **Deploy**.
5. After the first deploy, copy the live URL, update
   `NEXT_PUBLIC_SITE_URL` to match it exactly, and redeploy (or just
   trigger a redeploy from the Vercel dashboard) so QR codes point to
   the right domain.

That's it — your site is live. Anyone can go to `/register`, fill the
form, and get a QR code that links to `/e/<their-id>`, which works for
**anyone who scans it**, on any phone, with no login required.

---

## 5. Customizing

- **Branding / colors**: edit the CSS variables at the top of
  `styles/globals.css`.
- **Ambulance number**: `pages/e/[id].js` currently hardcodes India's
  108. Change this (or make it location-aware) for other countries.
- **Nearby hospital/police**: currently link to a generic Google Maps
  search. To show real distances, integrate the Google Places API and
  request the scanner's GPS location via the browser's Geolocation API.
- **Real-time alerts** (SMS/WhatsApp/Email automatically sent to
  contacts, push notifications, SOS escalation, offline PWA support):
  these are the more advanced features from the original spec. They
  require additional services — e.g. Twilio for SMS/WhatsApp, a push
  notification provider, and a service worker for offline/PWA support.
  The current "Send Alert" button is a working UI placeholder; wiring
  it to Twilio is the natural next step (add an
  `pages/api/send-alert.js` route that calls the Twilio API with the
  contact numbers from the profile).

---

## 6. Security notes

- The database table has RLS enabled with **zero policies**, so the
  Supabase anon/public API key cannot read or write any rows directly —
  all access goes through your server code, which enforces privacy
  modes before sending data to the browser.
- IDs are random 12-character hex strings (48 bits of randomness) —
  hard to guess, but anyone with the exact ID/QR can view that
  person's emergency page by design (that's the point of the QR).
  Don't store anything more sensitive than what you'd want a stranger
  who finds the QR to see, based on the chosen privacy mode.
